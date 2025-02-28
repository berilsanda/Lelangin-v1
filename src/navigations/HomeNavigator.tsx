import Feather from '@expo/vector-icons/Feather';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AccountNavigator from './AccountNavigator';
import { TabParamList } from '@/types/navigation/HomeNavigationType';
import { StackParamList } from '@/types/navigation/MainNavigationType';
import Home from '@/screens/Home';

type NavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<StackParamList>
>;

const Tab = createBottomTabNavigator<TabParamList>();

export default function HomeNavigator() {
  const navigation = useNavigation<NavigationProps>();

  const AddLelangComponent = () => {
    return null;
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSans_700Bold',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Transaksi"
        component={Transaction}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="TambahLelang"
        component={AddLelangComponent}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();

            navigation.navigate('TambahLelang');
          },
        }}
        options={() => {
          return {
            tabBarIcon: ({ color, size }) => (
              <Feather name="plus-square" color={color} size={size} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="AccountNav"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
