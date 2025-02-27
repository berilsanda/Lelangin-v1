import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar as Bar,
  View,
} from 'react-native';
import { StackParamList } from 'src/navigations/MainNavigator';
import * as yup from 'yup';

import { AppTextInputs, Buttons } from '@/components/atoms';
import { Colors, Spacing, Typography } from '@/config/constant';

export interface UserRegisterData {
  displayName: string;
  email: string;
  password: string;
  cpassword: string;
}

const schema = yup.object().shape({
  displayName: yup.string().required('Silahkan masukkan nama lengkap anda'),
  email: yup
    .string()
    .email('Format email salah')
    .required('Silahkan masukkan email'),
  password: yup
    .string()
    .min(8, 'Password minimal 8 karakter')
    .required('Silahkan masukkan password'),
  cpassword: yup
    .string()
    .min(8, 'Password minimal 8 karakter')
    .required('Silahkan masukkan konfirmasi password')
    .oneOf(
      [yup.ref('password'), ''],
      'Konfirmasi Password harus sama dengan Password',
    ),
});

type Props = NativeStackScreenProps<StackParamList, 'Register'>;

export default function Register({ navigation }: Props) {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  function onSubmit(data: UserRegisterData) {
    navigation.navigate('UserDetail', data);
    reset();
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.subtitle}>Langkah 1 dari 2</Text>
        <Text style={styles.title}>Data Akun</Text>

        <AppTextInputs
          name="displayName"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          control={control}
        />
        <AppTextInputs
          name="email"
          label="Email"
          placeholder="Masukkan email anda"
          control={control}
        />
        <AppTextInputs
          name="password"
          label="Password"
          placeholder="Masukkan password anda"
          secureTextEntry
          control={control}
        />
        <AppTextInputs
          name="cpassword"
          label="Konfirmasi Password"
          placeholder="Masukkan kembali password anda"
          secureTextEntry
          control={control}
        />
      </ScrollView>

      <View style={{ paddingHorizontal: Spacing.xl }}>
        <Text style={styles.labelInfo}>
          Sudah punya akun?{' '}
          <Text
            style={[Typography.label3, { color: Colors.primary }]}
            suppressHighlighting
            onPress={() => navigation.navigate('Login')}
          >
            Masuk disini.
          </Text>
        </Text>

        <Buttons
          label="Lanjut"
          onPress={handleSubmit(onSubmit)}
          style={{ marginBottom: Spacing.l }}
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
  title: {
    ...Typography.heading2,
    marginBottom: Spacing.xl,
  },
  subtitle: {
    ...Typography.paragraph4,
    color: Colors.textSecondary,
  },
  labelInfo: {
    ...Typography.label3,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
});
