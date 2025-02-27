import { NavigationProp, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { NumericFormat } from 'react-number-format';
import { StackParamList } from 'src/navigations/MainNavigator';
import { ProductType } from 'src/types/productModel';

import { Colors, Spacing, Typography } from '@/config/constant';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 2 * Spacing.xl - Spacing.l) / 2;

interface ItemCardProps {
  item: ProductType;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate('DetailLelang', { id: item.id })}
    >
      <FastImage
        source={{ uri: item.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={Typography.label3}>{item.title}</Text>
        <NumericFormat
          value={item.currentBid == 0 ? item.startingBid : item.currentBid}
          displayType={'text'}
          prefix={'Rp '}
          thousandSeparator="."
          decimalSeparator=","
          renderText={(val) => <Text style={styles.price}>{val}</Text>}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={styles.infoText}>{item.bidder} Bidder</Text>
          <Text style={styles.infoText}>
            {moment(item.auctionEnd).fromNow()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: Spacing.l,
    marginBottom: Spacing.l,
    width: ITEM_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.s,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.grey.light,
  },
  image: {
    height: ITEM_WIDTH,
    width: ITEM_WIDTH,
  },
  contentContainer: {
    padding: Spacing.m,
  },
  price: {
    marginTop: Spacing.s,
    marginBottom: Spacing.m,
    color: Colors.warning,
    ...Typography.label1,
  },
  infoText: {
    color: Colors.textSecondary,
    ...Typography.paragraph4,
  },
});

export default ItemCard;
