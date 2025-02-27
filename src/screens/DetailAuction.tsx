import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CountdownTimer, Divider, PriceCounter } from '@/components/atoms';
import {
  AuctionerCard,
  BiddingModal,
  ImageCarousel,
} from '@/components/molecules';
import { Colors, Spacing, Typography } from '@/config/constant';
import { StackParamList } from '@/navigations/MainNavigator';
import { addFavourite, database, removeFavourite } from '@/services/firebase';
import {
  addRdxFavourite,
  removeRdxFavourite,
} from '@/stores/reducer/persistReducer';
import serializeTime from '@/utils/serializeTime';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

type Props = NativeStackScreenProps<StackParamList, 'DetailLelang'>;

export default function DetailAuction({
  navigation,
  route: { params },
}: Props) {
  const [item, setItem] = useState<DocumentData>();
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.persist.userData);
  const isFavorite: boolean = userData.favorites.includes(params.id);

  async function fetchData() {
    setLoading(true);
    try {
      (async () => {
        const productData = await getDoc(
          doc(collection(database, 'products'), params.id),
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

  function subscribeData() {
    const unsubscribe = onSnapshot(
      doc(database, 'products', params.id),
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
      Alert.alert('Kesalahan', error.message);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons
          name={isFavorite ? 'heart' : 'heart-outline'}
          color={isFavorite ? Colors.warning : Colors.surfaceInverse}
          size={24}
          onPress={() => toggleFavourite(userData.uid, params.id)}
        />
      ),
    });
  }, [navigation, isFavorite]);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/** Image Carousel */}
            <ImageCarousel images={item?.images} />

            {/** Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{item?.title}</Text>

              <View style={styles.bidContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subLabel}>Bid Tertinggi</Text>
                  <PriceCounter
                    bidValue={
                      item?.currentBid == 0
                        ? item?.startingBid
                        : item?.currentBid
                    }
                  />
                </View>

                <View>
                  <Text style={[styles.subLabel, { textAlign: 'right' }]}>
                    Selesai Dalam
                  </Text>
                  <CountdownTimer date={item?.auctionEnd || null} />
                </View>
              </View>

              <Divider />

              <Text style={styles.sectionLabel}>Deskripsi</Text>
              <Text
                style={[
                  Typography.paragraph3,
                  { color: Colors.textSecondary, marginBottom: Spacing.l },
                ]}
              >
                {item?.description}
              </Text>

              <Divider />

              <Text style={styles.sectionLabel}>Pelelang</Text>
              <AuctionerCard
                name={item?.auctioner?.displayName || '-'}
                city={item?.auctioner?.address?.city || '-'}
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
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.xl,
  },
  title: {
    ...Typography.heading2,
    marginBottom: Spacing.l,
  },
  bidContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subLabel: {
    ...Typography.paragraph4,
    color: Colors.textSecondary,
  },
  sectionLabel: {
    ...Typography.label2,
    marginBottom: Spacing.m,
  },
});
