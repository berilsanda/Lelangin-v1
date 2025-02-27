import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { EmptyState, ItemCard } from '@/components/molecules';
import { Spacing } from '@/config/constant';
import { database } from '@/services/firebase';
import { ProductType } from '@/types/productModel';
import serializeTime from '@/utils/serializeTime';

export default function FavouriteAuction() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ProductType[]>([]);
  const userData = useSelector((state: any) => state.persist.userData);

  async function fetchAuction() {
    setLoading(true);
    try {
      if (userData.favorites.length < 1) {
        return setItems([]);
      }

      const q = query(
        collection(database, 'products'),
        where('id', 'in', userData.favorites),
        where('auctionEnd', '>=', new Date()),
      );
      const querySnapshot = await getDocs(q);

      const productItems: ProductType[] = [];
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

        productItems.push(data);
      });

      setItems(productItems);
    } catch (error: any) {
      console.log(error.message);
      Alert.alert('Kesalahan', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async function () {
      await fetchAuction();
    })();
  }, []);

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
    <View style={{ paddingHorizontal: Spacing.xl, paddingVertical: Spacing.l }}>
      {loading || refreshing ? (
        <ActivityIndicator />
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
  );
}
