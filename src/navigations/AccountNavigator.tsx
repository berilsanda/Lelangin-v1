import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from 'src/screens/Account/Account';
import ChangePassword from 'src/screens/Account/ChangePassword';

export type AccountStackParamList = {
  Account: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<AccountStackParamList>();

export default function AccountNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSans_700Bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: 'Ubah Password' }}
      />
    </Stack.Navigator>
  );
}
