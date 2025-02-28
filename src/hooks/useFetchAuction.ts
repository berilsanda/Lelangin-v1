import { database } from '@/services/firebase';
import { Bid } from '@/types/bidModel';
import { ProductType } from '@/types/productModel';
import serializeTime from '@/utils/serializeTime';
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAppSelector } from './useRedux';

type FetchAuctionType = 'product' | 'favourite'

async function fetchBid(bidId: string) {
  try {
    const q = query(
      collection(database, 'bidder'),
      where('__name__', '==', bidId),
    );

    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return results[0] as Bid;
  } catch (error: any) {
    console.log(error.message);
  }

  return null;
}

export default function useFetchAuction(type: FetchAuctionType) {
  const shouldHomeUpdate = useAppSelector(
    (state) => state.temp.homeUpdateState,
  );
  const userData = useAppSelector((state) => state.persist.userData);

  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [items, setItems] = useState<ProductType[]>([]);
  const [search, setSearch] = useState('');

  const queryData = type === 'product' ? query(
    collection(database, 'products'),
    where('status', '==', 'active'),
    where('auctionEnd', '>=', new Date()),
    orderBy('title'),
    startAt(search),
    endAt(search + '\uf8ff'),
  ) : query(
    collection(database, 'products'),
    where('id', 'in', userData.favorites),
    where('auctionEnd', '>=', new Date()),
  );

  useEffect(() => {
    (async function () {
      const fetchAuction = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(queryData);

          const fetchedItems: (Omit<ProductType, 'bidder'> & {
            bidder: string[];
          })[] = [];

          querySnapshot.forEach((doc) => {
            const data = {
              id: doc.id,
              title: doc.data().title || '-',
              description: doc.data().description || '-',
              startingBid: doc.data().startingBid || 0,
              currentBid: doc.data().currentBid || 0,
              images: doc.data().images || [],
              auctionEnd: serializeTime(doc.data().auctionEnd),
              condition: doc.data().condition || '-',
              createdAt: serializeTime(doc.data().createdAt),
              createdBy: doc.data().createdBy || '-',
              stepBid: doc.data().stepBid || 10000,
              status: doc.data().status || 'active',
              bidder: doc.data().bidder || [],
              winner: doc.data().winner || '-',
            };

            fetchedItems.push(data);
          });

          const productItems: ProductType[] = [];
          for (const item of fetchedItems) {
            const bidData = [];
            for (const bid of item.bidder) {
              const fetchedBid = await fetchBid(bid);
              bidData.push(fetchedBid);
            }

            const totalBidder = bidData.reduce<Bid[]>((prev, curr) => {
              if (!prev.some((bidder) => bidder.userId === curr!.userId)) {
                prev.push(curr!);
              }
              return prev;
            }, []);

            productItems.push({ ...item, bidder: totalBidder.length });
          }

          setItems(productItems);
        } catch (error: any) {
          console.log(error.message);
          Alert.alert('Kesalahan', error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAuction();
    })();
  }, [toggle, shouldHomeUpdate]);

  return {
    loading,
    items,
    search,
    setSearch,
    toggle,
    setToggle,
  };
}
