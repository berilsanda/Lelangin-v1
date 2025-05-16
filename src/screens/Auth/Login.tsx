import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import * as yup from 'yup';

import { AppTextInputs, Banner, Buttons } from '@/components/atoms';
import { Colors, Spacing, Typography } from '@/config/constant';
import { StackParamList } from '@/types/navigation/MainNavigationType';
import { UserLogin } from '@/services/supabase';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';

type LoginData = { email: string; password: string };

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Format email salah')
    .required('Silahkan masukkan email'),
  password: yup
    .string()
    .min(8, 'Password minimal 8 karakter')
    .required('Silahkan masukkan password'),
});

type Props = NativeStackScreenProps<StackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: LoginData) {
    setLoading(true);
    setError('');
    try {
      const response = await UserLogin(data.email, data.password);

      if (response.error) {
        return setError(response.error.message);
      }

      reset();
      navigation.navigate('SplashScreen');
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setLoading(false);
    }
  }

  const AnimatedBanner = Animated.createAnimatedComponent(Banner);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require('assets/logo.png')}
        />
        {error && (
          <AnimatedBanner
            layout={LinearTransition}
            entering={FadeInDown}
            exiting={FadeOutUp}
            type="error"
            description={error}
          />
        )}
        <AppTextInputs
          name="email"
          label="Email"
          placeholder="Masukkan email anda"
          control={control}
          disabled={loading}
        />
        <AppTextInputs
          name="password"
          label="Password"
          placeholder="Masukkan password anda"
          secureTextEntry
          control={control}
          disabled={loading}
        />
        <Text
          style={[
            Typography.label3,
            {
              textAlign: 'right',
              marginBottom: Spacing.l,
            },
          ]}
        >
          Lupa Password?
        </Text>
        <Buttons
          label="Masuk"
          onPress={handleSubmit(onSubmit)}
          style={{ marginBottom: Spacing.l }}
          disabled={loading}
          loading={loading}
        />
        <Text style={[Typography.paragraph3, { textAlign: 'center' }]}>
          Belum punya akun?{' '}
          <Text
            style={[Typography.paragraph3, { color: Colors.primary }]}
            suppressHighlighting
            onPress={() => navigation.navigate('Register')}
          >
            Daftar disini.
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.l,
  },
  logo: {
    alignSelf: 'center',
    height: 40,
    width: WINDOW_WIDTH * 0.75,
    marginTop: WINDOW_HEIGHT * 0.25,
    marginBottom: 64,
  },
});
