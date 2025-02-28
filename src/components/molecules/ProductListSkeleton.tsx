import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import { Skeleton } from '@/components/atoms';
import { Spacing } from '@/config/constant';

const SKELETON_WIDTH =
  (Dimensions.get('window').width - 2 * Spacing.xl - Spacing.l) / 2;
export default function ProductListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from(Array(10).keys()).map((_, i) => {
        return <Skeleton key={i} style={styles.skeleton} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.l,
  },
  skeleton: {
    width: SKELETON_WIDTH,
    height: 250,
    borderRadius: Spacing.s,
  },
});
