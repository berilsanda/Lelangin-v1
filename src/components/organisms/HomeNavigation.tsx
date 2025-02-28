import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TextInputs } from '@/components/atoms';
import Feather from '@expo/vector-icons/Feather';
import { Spacing } from '@/config/constant';
import { navigate } from '@/utils/rootNavigation';

type HomeNavigationProps = {
    search: string,
    setSearch: React.Dispatch<React.SetStateAction<string>>,
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HomeNavigation({search, setSearch, setToggle} : HomeNavigationProps) {
  return (
    <View style={styles.headerContainer}>
      <TextInputs
        value={search}
        placeholder="Cari lelang..."
        onChangeText={(val) => setSearch(val)}
        onPressIcon={() => setToggle((prev) => !prev)}
        icon="magnify"
        style={{ flex: 1, marginRight: Spacing.l, marginBottom: 0 }}
      />
      <Feather
        name="heart"
        size={24}
        style={{ marginRight: 16 }}
        onPress={() => navigate('Favourites')}
      />
      <Feather name="bell" size={24} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
