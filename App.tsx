import {
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import MainNavigator from './src/navigations/MainNavigator';

import { Colors } from '@/config/constant';
import store from '@/stores/store';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.surface,
    },
  };

  const [loaded, error] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="auto" />
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}
