import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/config/constant';
import ProductListSkeleton from '@/components/molecules/ProductListSkeleton';
import ProductList from '@/components/molecules/ProductList';
import useFetchAuction from '@/hooks/useFetchAuction';

export default function FavouriteAuction() {
  const { items, loading, setToggle } = useFetchAuction('favourite');

  return (
    <View style={styles.container}>
      {loading ? (
        <ProductListSkeleton />
      ) : (
        <ProductList
          items={items}
          refreshing={loading}
          onRefresh={() => setToggle((prev) => !prev)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.l,
  },
});
