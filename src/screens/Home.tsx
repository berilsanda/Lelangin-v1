import Feather from '@expo/vector-icons/Feather';
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  StatusBar as Bar,
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';

import { Skeleton, TextInputs } from '@/components/atoms';
import { EmptyState, ItemCard } from '@/components/molecules';
import { Spacing, Typography } from '@/config/constant';
import { useAppSelector } from '@/hooks/useRedux';
import { database } from '@/services/firebase';
import { Bid } from '@/types/bidModel';
import { ProductType } from '@/types/productModel';
import serializeTime from '@/utils/serializeTime';
import { navigate } from '@/utils/rootNavigation';

const SKELETON_WIDTH =
  (Dimensions.get('window').width - 2 * Spacing.xl - Spacing.l) / 2;
export default function Home() {
  const shouldHomeUpdate = useAppSelector(
    (state) => state.temp.homeUpdateState,
  );
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [items, setItems] = useState<ProductType[]>([]);
  const [search, setSearch] = useState('');

  async function fetchAuction() {
    setLoading(true);
    try {
      const q = query(
        collection(database, 'products'),
        where('status', '==', 'active'),
        where('auctionEnd', '>=', new Date()),
        orderBy('title'),
        startAt(search),
        endAt(search + '\uf8ff'),
      );
      const querySnapshot = await getDocs(q);

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
  }

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

  useEffect(() => {
    (async function () {
      await fetchAuction();
    })();
  }, [toggle, shouldHomeUpdate]);

  const [refreshing, setRefreshing] = useState(false);
  async function onRefresh() {
    setRefreshing(true);
    try {
      await fetchAuction();
    } catch (error: any) {
      Alert.alert('Kesalahan', error.message);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TextInputs
          value={search}
          placeholder="Cari lelang..."
          onChangeText={(val) => setSearch(val)}
          onPressIcon={() => setToggle((prev) => !prev)}
          icon="magnify"
          style={{ flex: 1, marginRight: Spacing.l, marginBottom: 0 }}
        />
        <Feather
          name="heart"
          size={24}
          style={{ marginRight: 16 }}
          onPress={() => navigate('Favourites')}
        />
        <Feather name="bell" size={24} />
      </View>

      <View style={{ marginTop: Spacing.l }}>
        <Text style={Typography.label3}>Lelang Terbaru</Text>
        <View style={{ marginTop: Spacing.l, flexShrink: 2 }}>
          {loading || refreshing ? (
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.l }}
            >
              {Array.from(Array(10).keys()).map((_, i) => {
                return <Skeleton key={i} style={styles.skeleton} />;
              })}
            </View>
          ) : (
            <FlatList
              keyExtractor={(item) => item.id}
              data={items}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              numColumns={2}
              showsVerticalScrollIndicator={false}
              style={{ flexGrow: 2 }}
              contentContainerStyle={{ paddingBottom: 64 }}
              ListEmptyComponent={
                <EmptyState
                  title="Data tidak ditemukan"
                  subtitle="Kami tidak dapat menemukan data lelang yang anda cari."
                />
              }
              renderItem={({ item }) => {
                return <ItemCard item={item} />;
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (Bar.currentHeight || Spacing.l) + Spacing.l,
    paddingHorizontal: Spacing.xl,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeleton: {
    width: SKELETON_WIDTH,
    height: 250,
    borderRadius: Spacing.s,
  },
});
