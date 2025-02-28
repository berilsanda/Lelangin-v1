import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import React from 'react';
import { EmptyState } from '@/components/molecules';
import { Spacing } from '@/config/constant';
import { ProductType } from '@/types/productModel';
import ProductCard from './Card/ProductCard';

type ProductListProps = {
  items: ProductType[];
  refreshing: boolean;
  onRefresh?: () => void;
};

export default function ProductList({
  items,
  refreshing,
  onRefresh,
}: ProductListProps) {
  return (
    <FlatList
      keyExtractor={(_, i) => String(i)}
      data={items}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      numColumns={2}
      showsVerticalScrollIndicator={false}
      style={{ flexGrow: 2 }}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={
        <EmptyState
          title="Data tidak ditemukan"
          subtitle="Kami tidak dapat menemukan data lelang yang anda cari."
        />
      }
      renderItem={({ item }) => {
        return <ProductCard item={item} />;
      }}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 64,
    gap: Spacing.l,
  },
});
