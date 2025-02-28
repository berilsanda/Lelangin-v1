import { Colors } from '@/config/constant';
import {
  addRdxFavourite,
  removeRdxFavourite,
} from '@/stores/reducer/persistReducer';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { addFavourite, removeFavourite } from '@/services/firebase';
import { Alert } from 'react-native';

const FavouriteButton = ({productId}: {productId: string}) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.persist.userData);
  const isFavorite: boolean = userData.favorites.includes(productId);

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

  return (
    <MaterialCommunityIcons
      name={isFavorite ? 'heart' : 'heart-outline'}
      color={isFavorite ? Colors.warning : Colors.surfaceInverse}
      size={24}
      onPress={() => toggleFavourite(userData.uid, productId)}
    />
  );
};

export default FavouriteButton;