import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppTextInputs, Buttons } from "components/atoms";
import { colors, size, typography } from "data/globals";
import { UserLogin } from "src/services/firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "src/navigations/MainNavigator";

type LoginData = { email: string; password: string };

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Format email salah")
    .required("Silahkan masukkan email"),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Silahkan masukkan password"),
});

type Props = NativeStackScreenProps<StackParamList, "Login">;

export default function Login({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: LoginData) {
    setLoading(true);
    try {
      await UserLogin(data.email, data.password);
      reset();
      navigation.navigate("SplashScreen");
    } catch (error: any) {
      Alert.alert("Gagal", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Image
          style={{
            height: 40,
            width: WINDOW_WIDTH * 0.75,
            alignSelf: "center",
            marginTop: WINDOW_HEIGHT * 0.25,
            marginBottom: 64,
          }}
          resizeMode="contain"
          source={require("assets/logo.png")}
        />
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
          style={{
            ...typography.label3,
            textAlign: "right",
            marginBottom: size.l,
          }}
        >
          Lupa Password?
        </Text>
        <Buttons
          label="Masuk"
          onPress={handleSubmit(onSubmit)}
          style={{ marginBottom: size.l }}
          disabled={loading}
          loading={loading}
        />
        <Text style={{ ...typography.paragraph3, textAlign: "center" }}>
          Belum punya akun?{" "}
          <Text
            style={{ ...typography.label3, color: colors.primary }}
            suppressHighlighting
            onPress={() => navigation.navigate("Register")}
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
    paddingHorizontal: size.xl,
    paddingVertical: size.l,
  },
});
