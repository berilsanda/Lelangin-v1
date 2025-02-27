import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Colors, Spacing, Typography } from '@/config/constant';

interface AuctionerCardProps {
  image: string;
  name: string;
  city: string;
}

const AuctionerCard: React.FC<AuctionerCardProps> = ({ image, name, city }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FastImage style={styles.image} source={{ uri: image }} />
      <View>
        <Text style={Typography.label3}>{name || '-'}</Text>
        <Text style={styles.city}>{city || '-'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    height: 64,
    marginRight: Spacing.l,
    borderRadius: Spacing.s,
  },
  city: {
    ...Typography.paragraph3,
    color: Colors.textSecondary,
  },
});

export default AuctionerCard;
