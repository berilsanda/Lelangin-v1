import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { TextInputs, AppModals, Buttons } from "components/atoms";
import { colors, size, typography } from "data/globals";
import { AccountStackParamList } from "navigations/AccountNavigator";
import { resetUser, setUser } from "src/reduxs/reducer/persistReducer";
import { auth, updateUser } from "services/firebase";
import uploadImageAsync from "services/uploadImageAsync";
import pickImage from "utils/imagePicker";

type Props = NativeStackScreenProps<AccountStackParamList, "Account">;

export default function Account({ navigation }: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const userData = useSelector((state: any) => state.persist.userData);
  const [userName, setUserName] = useState<string | null>(userData.displayName);
  const [userImage, setUserImage] = useState<string | null>(userData.photoURL);

  function onCloseModal() {
    setUserName(userData?.displayName);
    setUserImage(userData?.photoURL);
    setModalVisible(false);
  }

  async function onSignOut() {
    setLoading(true);
    try {
      await signOut(auth);
      dispatch(resetUser());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "SplashScreen",
            },
          ],
        })
      );
    } catch (error: any) {
      Alert.alert("Gagal", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit() {
    //Validation
    if (userImage == null || userName!.trim().length == 0) {
      return Alert.alert("", "Data tidak boleh kosong!");
    }

    if (userName!.trim().length < 4) {
      return Alert.alert("", "Nama minimal berisi 4 karakter!");
    }

    setLoadingModal(true);
    try {
      const pathToUpload = `User/${userData.uid}/Profil`;
      const photo = await uploadImageAsync(userImage!, pathToUpload, `photo`);

      await updateUser({
        id: userData.uid,
        displayName: userName,
        photoURL: photo,
      });

      dispatch(setUser({ displayName: userName, photoURL: photo }));
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert("Gagal", error.message);
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
            color={colors.grey.dark}
            size={18}
            style={{ marginRight: size.m }}
          />
        ) : null}
        <Text style={{ ...typography.paragraph3, flex: 1 }}>{label}</Text>
        <Feather name="chevron-right" color={colors.grey.dark} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {!!userData?.photoURL ? (
          <Image
            source={{ uri: userData?.photoURL }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.image}>
            <MaterialCommunityIcons
              name="image-off-outline"
              color={colors.grey.dark}
              size={20}
            />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={typography.label2}>
            {userData.displayName || "Belum ada nama"}
          </Text>
          <Text
            style={{ ...typography.paragraph3, color: colors.textSecondary }}
          >
            {userData.email}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="pencil-outline"
          color={colors.grey.dark}
          size={24}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <ItemList
        label="Ubah Password"
        onPress={() => navigation.navigate("ChangePassword")}
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
        style={{ paddingHorizontal: size.xl }}
      >
        <View style={styles.modalContainer}>
          
          <View style={styles.modalHeader}>
            <Text style={typography.label3}>Edit Profil</Text>
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
                  let pickedImage = await pickImage("galery");
                  if (pickedImage != null) {
                    setUserImage(pickedImage);
                  }
                }}
                style={{ alignSelf: "center", marginBottom: size.l }}
              >
                {!!userImage ? (
                  <Image
                    source={{ uri: userImage }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.image}>
                    <MaterialCommunityIcons
                      name="image-off-outline"
                      color={colors.grey.dark}
                      size={20}
                    />
                  </View>
                )}
              </TouchableOpacity>

              {!!userImage ? (
                <TouchableOpacity
                  style={styles.deleteImage}
                  onPress={() => setUserImage(null)}
                >
                  <MaterialCommunityIcons name="close" size={14} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Username Input */}
            <TextInputs
              value={userName ?? ""}
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
    paddingHorizontal: size.xl,
  },
  headerContainer: {
    marginBottom: size.l,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: size.l,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: colors.grey.light,
    width: "100%",
  },
  image: {
    height: 64,
    width: 64,
    borderRadius: size.s,
    overflow: "hidden",
    backgroundColor: colors.grey.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: size.l,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: size.s,
    marginHorizontal: size.xl,
    padding: size.l,
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: size.l,
  },
  deleteImage: {
    position: "absolute",
    right: "40%",
    top: -12,
    backgroundColor: colors.primaryContainer,
    borderRadius: 50,
    padding: 4,
  },
});
