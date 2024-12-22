import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { CountdownTimer, ImageLightbox } from "components/atoms";
import BiddingModal from "molecules/BiddingModal";
import AuctionerCard from "molecules/Card/AuctionerCard";
import { colors, size, typography } from "src/data/globals";
import { StackParamList } from "src/navigations/MainNavigator";
import {
  addRdxFavourite,
  removeRdxFavourite,
} from "src/reduxs/reducer/persistReducer";
import { addFavourite, database, removeFavourite } from "src/services/firebase";
import serializeTime from "src/utils/serializeTime";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = NativeStackScreenProps<StackParamList, "DetailLelang">;

const WINDOW_WIDTH = Dimensions.get("window").width;

export default function DetailAuction({
  navigation,
  route: { params },
}: Props) {
  const [item, setItem] = useState<DocumentData>();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.persist.userData);
  const isFavorite: boolean = userData.favorites.includes(params.id);

  async function fetchData() {
    setLoading(true);
    try {
      (async () => {
        const productData = await getDoc(
          doc(collection(database, "products"), params.id)
        );

        if (productData.exists()) {
          let fetchedItem = productData.data();
          fetchedItem.auctionEnd = serializeTime(fetchedItem.auctionEnd);
          fetchedItem.auctioner = await fetchUserData(fetchedItem.createdBy);
          setItem(fetchedItem);
        }
      })();
    } catch (error: any) {
      Alert.alert("Kesalahan", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserData(userId: string) {
    try {
      const userData = await getDoc(doc(collection(database, "user"), userId));

      if (userData.exists()) {
        let fetchedUser = userData.data();
        fetchedUser.createdAt = serializeTime(fetchedUser.createdAt);
        fetchedUser.updateAt = serializeTime(fetchedUser.updateAt);
        fetchedUser.lastLogin = serializeTime(fetchedUser.lastLogin);
        return fetchedUser;
      }
      return null;
    } catch (error: any) {
      Alert.alert("Kesalahan", error.message);
      return null;
    }
  }

  function subscribeData() {
    const unsubscribe = onSnapshot(
      doc(database, "products", params.id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const currentBid = data?.currentBid;
          setItem((prevState) => ({ ...prevState, currentBid }));
        } else {
          console.log("Error document not found");
        }
      }
    );

    return unsubscribe;
  }

  useEffect(() => {
    fetchData();

    const unsubscribe = subscribeData();

    return () => {
      unsubscribe();
    };
  }, [params.id]);

  async function toggleFavourite(userId: string, itemId: string) {
    try {
      if (!isFavorite) {
        dispatch(addRdxFavourite(itemId));
        await addFavourite(userId, itemId);
      } else {
        dispatch(removeRdxFavourite(itemId));

        await removeFavourite(userId, itemId);
      }
    } catch (error: any) {
      Alert.alert("Kesalahan", error.message);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons
          name={isFavorite ? "heart" : "heart-outline"}
          color={isFavorite ? colors.warning : colors.surfaceInverse}
          size={24}
          onPress={() => toggleFavourite(userData.uid, params.id)}
        />
      ),
    });
  }, [navigation, isFavorite]);

  //Handle carousel page
  const [currentPage, setCurrentPage] = useState(1);
  function onScrollCarousel(event: NativeSyntheticEvent<NativeScrollEvent>) {
    let currPage = Math.round(event.nativeEvent.contentOffset.x / WINDOW_WIDTH);
    setCurrentPage(currPage + 1);
  }

  const [currBid, setCurrBid] = useState(
    item?.currentBid == 0 ? item?.startingBid : item?.currentBid
  );

  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    translateY.value = withTiming(-50, { duration: 250 }, () => {
      if (item?.currentBid != 0) {
        runOnJS(setCurrBid)(item?.currentBid);
      } else {
        runOnJS(setCurrBid)(item?.startingBid);
      }
      translateY.value = 50;
      translateY.value = withTiming(0, { duration: 250 });
    });
  }, [item?.currentBid]);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/** Image Carousel */}
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                decelerationRate={"fast"}
                onMomentumScrollEnd={(e) => onScrollCarousel(e)}
              >
                {item?.images?.map((image: string) => {
                  return (
                    <ImageLightbox
                      key={image}
                      style={{
                        width: WINDOW_WIDTH,
                        height: (3 / 4) * WINDOW_WIDTH,
                        resizeMode: "cover",
                      }}
                      source={image}
                    />
                  );
                })}
              </ScrollView>

              <View style={styles.carouselIndicator}>
                <Text>{`${currentPage} / ${item?.images?.length || 0}`}</Text>
              </View>
            </View>

            {/** Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{item?.title}</Text>

              <View style={styles.bidContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subLabel}>Bid Tertinggi</Text>
                  <NumericFormat
                    value={currBid}
                    displayType={"text"}
                    prefix={"Rp "}
                    thousandSeparator="."
                    decimalSeparator=","
                    renderText={(val) => (
                      <View style={{ overflow: "hidden" }}>
                        <Animated.Text style={[styles.bidValue, animatedStyle]}>
                          {val}
                        </Animated.Text>
                      </View>
                    )}
                  />
                </View>

                <View>
                  <Text style={[styles.subLabel, { textAlign: "right" }]}>
                    Selesai Dalam
                  </Text>
                  <CountdownTimer date={item?.auctionEnd || null} />
                </View>
              </View>

              <View style={styles.separator} />

              <Text style={styles.sectionLabel}>Deskripsi</Text>
              <Text
                style={[
                  typography.paragraph3,
                  { color: colors.textSecondary, marginBottom: size.l },
                ]}
              >
                {item?.description}
              </Text>

              <View style={styles.separator} />

              <Text style={styles.sectionLabel}>Pelelang</Text>
              <AuctionerCard
                name={item?.auctioner?.displayName || "-"}
                city={item?.auctioner?.address?.city || "-"}
                image={item?.auctioner?.photoURL}
              />
            </View>
          </ScrollView>

          <BiddingModal
            auctionId={params.id}
            stepBid={item?.stepBid}
            currentBid={item?.currentBid}
            startingBid={item?.startingBid}
            disabled={new Date(item?.auctionEnd) < new Date()}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingVertical: size.l,
    paddingHorizontal: size.xl,
  },
  carouselIndicator: {
    position: "absolute",
    right: size.l,
    bottom: size.m,
    paddingHorizontal: size.m,
    paddingVertical: size.s,
    borderRadius: size.s,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  title: {
    ...typography.heading2,
    marginBottom: size.l,
  },
  bidValue: {
    ...typography.heading2,
    color: colors.warning,
  },
  separator: {
    marginVertical: size.l,
    borderTopWidth: 1,
    borderColor: colors.grey.light,
  },
  bidContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subLabel: {
    ...typography.paragraph4,
    color: colors.textSecondary,
  },
  sectionLabel: {
    ...typography.label2,
    marginBottom: size.m,
  },
});
