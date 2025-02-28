import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
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
import { StackParamList } from '@/types/navigation/MainNavigationType';
import useFetchProduct from '@/hooks/useFetchProduct';
import FavouriteButton from '@/components/atoms/FavouriteButton';

type Props = NativeStackScreenProps<StackParamList, 'DetailLelang'>;

export default function DetailAuction({
  navigation,
  route: { params },
}: Props) {
  const { item, loading } = useFetchProduct(params.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <FavouriteButton productId={params.id} />,
    });
  }, [navigation]);

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
