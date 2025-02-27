import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar as Bar,
  View,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as yup from 'yup';

import { AppTextInputs, Buttons } from '@/components/atoms';
import { Colors, Spacing, Typography } from '@/config/constant';
import { StackParamList } from '@/navigations/MainNavigator';
import { createUser, UserRegister } from '@/services/firebase';
import uploadImageAsync from '@/services/uploadImageAsync';
import { setUser } from '@/stores/reducer/persistReducer';
import pickImage from '@/utils/imagePicker';
import { useAppDispatch } from '@/hooks/useRedux';

const schema = yup.object().shape({
  phoneNumber: yup.string().required('Silahkan masukkan nomor telepon anda'),
  streetAddress: yup.string().required('Silahkan masukkan alamat anda'),
  city: yup.string().required('Silahkan masukkan kota anda tinggal'),
  zipCode: yup.string().required('Silahkan masukkan kode pos anda'),
});

type Props = NativeStackScreenProps<StackParamList, 'UserDetail'>;

export default function UserDetail({ navigation, route: { params } }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: {
    phoneNumber: string;
    streetAddress: string;
    city: string;
    zipCode: string;
  }) {
    if (userImage == null) {
      return Alert.alert('', 'Silahkan menambahkan foto!');
    }

    setLoading(true);
    try {
      const registerUser = await UserRegister(params.email, params.password);

      if (registerUser) {
        const pathToUpload = `User/${registerUser.uid}/Profil`;
        const photo = await uploadImageAsync(userImage!, pathToUpload, `photo`);

        const sendData = {
          address: {
            city: data.city,
            streetAddress: data.streetAddress,
            zipCode: data.zipCode,
          },
          createdAt: new Date(),
          displayName: params.displayName,
          email: params.email,
          favorites: [],
          lastLogin: new Date(),
          phoneNumber: parseInt(data.phoneNumber),
          photoURL: photo,
          uid: registerUser.uid,
          updateAt: new Date(),
        };

        await createUser(sendData);

        dispatch(
          setUser({
            ...sendData,
            createdAt: sendData.createdAt.toDateString,
            lastLogin: sendData.lastLogin.toDateString,
            updatedAt: sendData.updateAt.toDateString,
          }),
        );
      }
      reset();
      navigation.navigate('SplashScreen');
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}>Langkah 2 dari 2</Text>
        <Text style={styles.title}>Data Pengguna</Text>

        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              const pickedImage = await pickImage('galery');
              if (pickedImage != null) {
                setUserImage(pickedImage.uri);
              }
            }}
            style={{ alignSelf: 'center', marginBottom: Spacing.l }}
          >
            {userImage ? (
              <FastImage
                source={{ uri: userImage }}
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
              onPress={() => setUserImage(null)}
            >
              <MaterialCommunityIcons name="close" size={14} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/** TODO: create app text input mask */}
        <AppTextInputs
          name="phoneNumber"
          label="Nomor Telepon"
          placeholder="Masukkan nomor telepon anda"
          keyboardType="phone-pad"
          control={control}
          disabled={loading}
        />

        {/** TODO: integrate google place autocomplete */}
        <AppTextInputs
          name="streetAddress"
          label="Alamat"
          placeholder="Masukkan alamat anda"
          control={control}
          disabled={loading}
        />

        {/** TODO: app picker for city list */}
        <AppTextInputs
          name="city"
          label="Kota"
          placeholder="Masukkan kota anda tinggal"
          control={control}
          disabled={loading}
        />
        <AppTextInputs
          name="zipCode"
          label="Kode Pos"
          placeholder="Masukkan kode pos alamat anda"
          keyboardType="numeric"
          maxLength={6}
          control={control}
          disabled={loading}
        />
      </ScrollView>

      <View style={{ paddingHorizontal: Spacing.xl }}>
        <Buttons
          label="Daftar"
          onPress={handleSubmit(onSubmit)}
          style={{ marginBottom: Spacing.l }}
          disabled={loading}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.l,
    paddingTop: (Bar?.currentHeight || 16) + Spacing.l,
  },
  image: {
    height: 72,
    width: 72,
    borderRadius: Spacing.s,
    overflow: 'hidden',
    backgroundColor: Colors.grey.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.l,
  },
  deleteImage: {
    position: 'absolute',
    right: '40%',
    top: -12,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 50,
    padding: 4,
  },
  title: {
    ...Typography.heading2,
    marginBottom: Spacing.xl,
  },
  subtitle: {
    ...Typography.paragraph4,
    color: Colors.textSecondary,
  },
});
