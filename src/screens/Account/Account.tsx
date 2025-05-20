import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { AppModals, Buttons, TextInputs } from '@/components/atoms';
import { Colors, Spacing, Typography } from '@/config/constant';

import { resetUser, setUser } from '@/stores/reducer/persistReducer';
import pickImage from '@/utils/imagePicker';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { AccountStackParamList } from '@/types/navigation/AccountNavigationType';
import supabase, { updateUser, UploadUserImage } from '@/services/supabase';

type Props = NativeStackScreenProps<AccountStackParamList, 'Account'>;

export default function Account({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const userData = useAppSelector((state) => state.persist.userData);
  const [userName, setUserName] = useState<string | null>(
    userData.display_name,
  );
  const [userImage, setUserImage] = useState<{
    uri: string;
    base64?: string | null;
  }>({
    uri: '',
    base64: null,
  });

  function onCloseModal() {
    setUserName(userData?.display_name);
    setUserImage((prev) => ({ ...prev, uri: userData?.photo_url }));
    setModalVisible(false);
  }

  async function onSignOut() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      dispatch(resetUser());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'SplashScreen',
            },
          ],
        }),
      );
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit() {
    //Validation
    if (userImage == null || userName!.trim().length == 0) {
      return Alert.alert('', 'Data tidak boleh kosong!');
    }

    if (userName!.trim().length < 4) {
      return Alert.alert('', 'Nama minimal berisi 4 karakter!');
    }

    setLoadingModal(true);
    try {
      const pathToUpload = `${userData.uid}/user_image.${userImage.uri.slice(userImage.uri.length - 4)}`;

      const photo = await UploadUserImage(userImage.base64!, pathToUpload);

      await updateUser({
        uid: userData.uid,
        display_name: userName || '',
        photo_url: photo,
      });

      dispatch(setUser({ displayName: userName, photoURL: photo }));
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setLoadingModal(false);
    }
  }

  interface ItemListProps {
    label: string;
    onPress: () => void;
    style?: ViewStyle;
    loading?: boolean;
  }

  const ItemList: React.FC<ItemListProps> = ({
    label,
    onPress,
    style,
    loading,
  }) => {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.itemList, style]}>
        {loading ? (
          <ActivityIndicator
            color={Colors.grey.dark}
            size={18}
            style={{ marginRight: Spacing.m }}
          />
        ) : null}
        <Text style={{ ...Typography.paragraph3, flex: 1 }}>{label}</Text>
        <Feather name="chevron-right" color={Colors.grey.dark} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {userData?.photo_url ? (
          <FastImage
            source={{ uri: userData?.photo_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.image}>
            <MaterialCommunityIcons
              name="image-off-outline"
              color={Colors.grey.dark}
              size={20}
            />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={Typography.label2}>
            {userData.display_name || 'Belum ada nama'}
          </Text>
          <Text
            style={{ ...Typography.paragraph3, color: Colors.textSecondary }}
          >
            {userData.email}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="pencil-outline"
          color={Colors.grey.dark}
          size={24}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <ItemList
        label="Ubah Password"
        onPress={() => navigation.navigate('ChangePassword')}
      />
      <View style={styles.divider} />
      <ItemList
        label="Keluar"
        onPress={() => onSignOut()}
        style={{ borderBottomWidth: 0 }}
        loading={loading}
      />

      <AppModals
        visible={modalVisible}
        onDismiss={() => (loadingModal ? null : onCloseModal())}
        style={{ paddingHorizontal: Spacing.xl }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={Typography.label3}>Edit Profil</Text>
            <MaterialCommunityIcons
              name="close"
              size={20}
              onPress={() => onCloseModal()}
            />
          </View>

          <View>
            {/* Image Selector */}
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  const pickedImage = await pickImage('galery', true);
                  if (pickedImage != null) {
                    setUserImage(pickedImage);
                  }
                }}
                style={{ alignSelf: 'center', marginBottom: Spacing.l }}
              >
                {userImage ? (
                  <FastImage
                    source={{ uri: userImage.uri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.image}>
                    <MaterialCommunityIcons
                      name="image-off-outline"
                      color={Colors.grey.dark}
                      size={20}
                    />
                  </View>
                )}
              </TouchableOpacity>

              {userImage ? (
                <TouchableOpacity
                  style={styles.deleteImage}
                  onPress={() => setUserImage({ uri: '', base64: null })}
                >
                  <MaterialCommunityIcons name="close" size={14} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Username Input */}
            <TextInputs
              value={userName ?? ''}
              placeholder="Masukkan nama anda"
              onChangeText={(val) => setUserName(val)}
            />

            <Buttons
              label="Simpan"
              onPress={() => onSubmit()}
              disabled={loadingModal}
              loading={loadingModal}
            />
          </View>
        </View>
      </AppModals>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  headerContainer: {
    marginBottom: Spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.l,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: Colors.grey.light,
    width: '100%',
  },
  image: {
    height: 64,
    width: 64,
    borderRadius: Spacing.s,
    overflow: 'hidden',
    backgroundColor: Colors.grey.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.l,
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.s,
    marginHorizontal: Spacing.xl,
    padding: Spacing.l,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  deleteImage: {
    position: 'absolute',
    right: '40%',
    top: -12,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 50,
    padding: 4,
  },
});
