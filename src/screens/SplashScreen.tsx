import { APP_VER } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { StackParamList } from 'src/navigations/MainNavigator';
import { auth, getUser } from 'src/services/firebase';
import serializeTime from 'src/utils/serializeTime';

import { Colors, Typography } from '@/config/constant';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setUser } from '@/stores/reducer/persistReducer';
import { DocumentData } from 'firebase/firestore';

const { width, height } = Dimensions.get('screen');

type Props = NativeStackScreenProps<StackParamList, 'SplashScreen'>;

type CurrentUser = DocumentData & {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}
export default function SplashScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.persist.userData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userFirestoreData = await getUser(user.uid);

        const currentUser: CurrentUser = {
          ...userFirestoreData,
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        };

        currentUser.createdAt = serializeTime(
          currentUser.createdAt,
        )?.toString();
        currentUser.lastLogin = serializeTime(
          currentUser.lastLogin,
        )?.toString();
        currentUser.updateAt = serializeTime(currentUser.updateAt)?.toString();

        if (!_.isEqual(userData, currentUser)) {
          dispatch(setUser(currentUser));
        }
        return navigation.replace('HomeNav');
      } else {
        return navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{ height: height, width: width }}
        resizeMode="cover"
        source={require('assets/splash.png')}
      />
      <Text style={styles.versionText}>Ver {APP_VER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  versionText: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    textAlign: 'center',
    zIndex: 99,
    color: Colors.textSecondary,
    ...Typography.paragraph3,
  },
});
