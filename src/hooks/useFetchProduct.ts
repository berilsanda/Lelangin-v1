import { database } from '@/services/firebase';
import serializeTime from '@/utils/serializeTime';
import { collection, doc, DocumentData, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function useFetchProduct(productId: string) {
  const [item, setItem] = useState<DocumentData>();
  const [loading, setLoading] = useState(true);

  function subscribeData() {
    const unsubscribe = onSnapshot(
      doc(database, 'products', productId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const currentBid = data?.currentBid;
          setItem((prevState) => ({ ...prevState, currentBid }));
        } else {
          console.log('Error document not found');
        }
      },
    );
    return unsubscribe;
  }

  async function fetchProduct() {
    setLoading(true);
    try {
      (async () => {
        const productData = await getDoc(
          doc(collection(database, 'products'), productId),
        );

        if (productData.exists()) {
          const fetchedItem = productData.data();
          fetchedItem.auctionEnd = serializeTime(fetchedItem.auctionEnd);
          fetchedItem.auctioner = await fetchUserData(fetchedItem.createdBy);
          setItem(fetchedItem);
        }
      })();
    } catch (error: any) {
      Alert.alert('Kesalahan', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserData(userId: string) {
    try {
      const userData = await getDoc(doc(collection(database, 'user'), userId));

      if (userData.exists()) {
        const fetchedUser = userData.data();
        fetchedUser.createdAt = serializeTime(fetchedUser.createdAt);
        fetchedUser.updateAt = serializeTime(fetchedUser.updateAt);
        fetchedUser.lastLogin = serializeTime(fetchedUser.lastLogin);
        return fetchedUser;
      }
      return null;
    } catch (error: any) {
      Alert.alert('Kesalahan', error.message);
      return null;
    }
  }

  useEffect(() => {
    fetchProduct();

    const unsubscribe = subscribeData();

    return () => {
      unsubscribe();
    }
  }, [productId]);

  return {
    item, loading
  }
}
