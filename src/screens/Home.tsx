import {
  StyleSheet,
  StatusBar as Bar,
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { TextInputs } from "src/components/atoms";
import { size, typography } from "src/data/globals";
import ItemCard from "src/components/molecules/Card/ItemCard";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  Timestamp,
  where,
} from "firebase/firestore";
import { database } from "src/services/firebase";
import EmptyState from "src/components/molecules/EmptyState";
import serializeTime from "src/utils/serializeTime";
import { useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "src/navigations/MainNavigator";
import { Bid } from "src/types/bid";
import { ProductType } from "src/types/productItem";

type Props = NativeStackScreenProps<StackParamList, "HomeNav">;

export default function Home({ navigation }: Props) {
  const shouldHomeUpdate = useSelector(
    (state: any) => state.temp.homeUpdateState
  );
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [items, setItems] = useState<ProductType[]>([]);
  const [search, setSearch] = useState("");

  async function fetchAuction() {
    setLoading(true);
    try {
      const q = query(
        collection(database, "products"),
        where("status", "==", "active"),
        where("auctionEnd", ">=", new Date()),
        orderBy("title"),
        startAt(search),
        endAt(search + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);

      let fetchedItems: (Omit<ProductType, "bidder"> & { bidder: string[] })[] =
        [];

      querySnapshot.forEach((doc) => {
        let data = {
          id: doc.id,
          title: doc.data().title || "-",
          description: doc.data().description || "-",
          startingBid: doc.data().startingBid || 0,
          currentBid: doc.data().currentBid || 0,
          images: doc.data().images || [],
          auctionEnd: serializeTime(doc.data().auctionEnd),
          condition: doc.data().condition || "-",
          createdAt: serializeTime(doc.data().createdAt),
          createdBy: doc.data().createdBy || "-",
          stepBid: doc.data().stepBid || 10000,
          status: doc.data().status || "active",
          bidder: doc.data().bidder || [],
          winner: doc.data().winner || "-",
        };

        fetchedItems.push(data);
      });

      let productItems: ProductType[] = [];
      for (const item of fetchedItems) {
        let bidData = [];
        for (const bid of item.bidder) {
          const fetchedBid = await fetchBid(bid);
          bidData.push(fetchedBid);
        }

        let totalBidder = bidData.reduce<Bid[]>((prev, curr) => {
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
      Alert.alert("Kesalahan", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBid(bidId: string) {
    try {
      const q = query(
        collection(database, "bidder"),
        where("__name__", "==", bidId)
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
      Alert.alert("Kesalahan", error.message);
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
          style={{ flex: 1, marginRight: size.l, marginBottom: 0 }}
        />
        <Feather
          name="heart"
          size={24}
          style={{ marginRight: 16 }}
          onPress={() => navigation.navigate("Favourites")}
        />
        <Feather name="bell" size={24} />
      </View>

      <View style={{ marginTop: size.l }}>
        <Text style={typography.label3}>Lelang Terbaru</Text>
        <View style={{ marginTop: size.l, flexShrink: 2 }}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (Bar.currentHeight || size.l) + size.l,
    paddingHorizontal: size.xl,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
