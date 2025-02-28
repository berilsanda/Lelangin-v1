import React from 'react';
import { StyleSheet, StatusBar as Bar, View, Text } from 'react-native';

import { Spacing, Typography } from '@/config/constant';
import useFetchAuction from '@/hooks/useFetchAuction';
import HomeNavigation from '../components/organisms/HomeNavigation';
import ProductList from '@/components/molecules/ProductList';
import ProductListSkeleton from '@/components/molecules/ProductListSkeleton';

export default function Home() {
  const { items, loading, search, setSearch, toggle, setToggle } =
    useFetchAuction('product');

  return (
    <View style={styles.container}>
      <HomeNavigation
        search={search}
        setSearch={setSearch}
        setToggle={setToggle}
      />

      <View style={{ marginTop: Spacing.l }}>
        <Text style={Typography.label3}>Lelang Terbaru</Text>
        <View style={styles.productContainer}>
          {loading ? (
            <ProductListSkeleton />
          ) : (
            <ProductList
              items={items}
              refreshing={toggle}
              onRefresh={() => setToggle((prev) => !prev)}
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
  productContainer: {
    marginTop: Spacing.l,
    flexShrink: 2,
  },
});
