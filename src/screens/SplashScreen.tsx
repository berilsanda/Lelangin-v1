import { APP_VER } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';

import { Colors, Typography } from '@/config/constant';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  INITIAL_USER,
  setSession,
  setUser,
} from '@/stores/reducer/persistReducer';
import { StackParamList } from '@/types/navigation/MainNavigationType';
import supabase from '@/services/supabase';
import { User } from '@/types/userModel';

const { width, height } = Dimensions.get('screen');

type Props = NativeStackScreenProps<StackParamList, 'SplashScreen'>;
export default function SplashScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.persist.userData);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));

      if (session) {
        setTimeout(async () => {
          try {
            const { data } = await supabase
              .from('users')
              .select()
              .eq('uid', session.user.id);

            if (!data || data.length === 0) {
              throw new Error('User data not found!');
            }

            const currentUser: Omit<
              User,
              'created_at' | 'last_login' | 'updated_at'
            > & {
              created_at: string;
              last_login: string;
              updated_at: string;
            } = data[0];

            currentUser.created_at = currentUser.created_at.toString();
            currentUser.last_login = currentUser.last_login.toString();
            currentUser.updated_at = currentUser.updated_at.toString();

            if (!_.isEqual(userData, currentUser)) {
              dispatch(setUser(currentUser));
            }
          } catch (error: any) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            throw new Error(error.message);
          }
        }, 0);

        return navigation.replace('HomeNav');
      } else {
        dispatch(setUser(INITIAL_USER));
        return navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={styles.image}
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
  image: {
    height: height,
    width: width,
  },
});
