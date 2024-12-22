import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { colors, typography } from "src/data/globals";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "src/navigations/MainNavigator";
import { auth, getUser } from "src/services/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "src/reduxs/reducer/persistReducer";
import { onAuthStateChanged } from "firebase/auth";
import _ from 'lodash';
import serializeTime from "src/utils/serializeTime";
import { APP_VER } from "@env";

const { width, height } = Dimensions.get("screen");

type Props = NativeStackScreenProps<StackParamList, "SplashScreen">;

export default function SplashScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.persist.userData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userFirestoreData = await getUser(user.uid);

        let currentUser: any = {
          ...userFirestoreData,
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        };

        currentUser.createdAt = serializeTime(currentUser.createdAt)?.toString();
        currentUser.lastLogin = serializeTime(currentUser.lastLogin)?.toString();
        currentUser.updateAt = serializeTime(currentUser.updateAt)?.toString();

        if (!_.isEqual(userData, currentUser)) {
          dispatch(setUser(currentUser));
        }
        return navigation.replace("HomeNav");
      } else {
        return navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{ height: height, width: width }}
        resizeMode="cover"
        source={require("assets/splash.png")}
      />
      <Text style={styles.versionText}>Ver {APP_VER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  versionText: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16,
    textAlign: "center",
    zIndex: 99,
    color: colors.textSecondary,
    ...typography.paragraph3
  },
});
