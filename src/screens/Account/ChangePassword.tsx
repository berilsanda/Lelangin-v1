import React, { useLayoutEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { AppTextInputs, Buttons } from "components/atoms";
import { colors, size } from "data/globals";
import { AccountStackParamList } from "navigations/AccountNavigator";
import { auth } from "services/firebase";

type Props = NativeStackScreenProps<AccountStackParamList, "ChangePassword">;

const schema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Silahkan masukkan password"),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Silahkan masukkan password")
    .notOneOf(
      [yup.ref("oldPassword")],
      "Password tidak boleh sama dengan password lama"
    ),
  cpassword: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Silahkan masukkan konfirmasi password")
    .oneOf(
      [yup.ref("password"), ""],
      "Konfirmasi Password harus sama dengan Password Baru"
    )
    .notOneOf(
      [yup.ref("oldPassword"), null],
      "Password tidak boleh sama dengan password lama"
    ),
});

export default function ChangePassword({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, []);

  async function onSubmit(data: {
    oldPassword: string;
    password: string;
    cpassword: string;
  }) {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Anda belum login!");
      }

      const credentials = EmailAuthProvider.credential(
        currentUser.email!,
        data.oldPassword
      );

      await reauthenticateWithCredential(currentUser, credentials);

      await updatePassword(currentUser, data.password);

      reset();
      Alert.alert("Berhasil!", "Password anda berhasil dirubah.");
    } catch (error: any) {
      Alert.alert("Gagal", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppTextInputs
          name="oldPassword"
          label="Password Lama"
          placeholder="Masukkan password lama anda"
          secureTextEntry
          control={control}
          disabled={loading}
        />
        <AppTextInputs
          name="password"
          label="Password Baru"
          placeholder="Masukkan password baru anda"
          secureTextEntry
          control={control}
          disabled={loading}
        />
        <AppTextInputs
          name="cpassword"
          label="Konfirmasi Password Baru"
          placeholder="Masukkan kembali password baru anda"
          secureTextEntry
          control={control}
          disabled={loading}
        />
      </View>
      <View style={styles.btnContainer}>
        <Buttons
          label="Simpan"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: size.xl,
    paddingVertical: size.l,
  },
  btnContainer: {
    paddingHorizontal: size.xl,
    paddingVertical: size.l,
    borderTopWidth: 1,
    borderColor: colors.grey.light,
  },
});
