import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BasketScreen from '../screens/Customer/BasketScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProfileNavigation from './ProfileNavigation';
import OrderScreen from '../screens/Customer/OrderScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/Customer/HomeScreen';
import FavouritesScreen from '../screens/Customer/FavouritesScreen';

const TabNav = createBottomTabNavigator();

interface TabConfig {
  name: string;
  Component: React.ComponentType<any>;
  focusedIcon: string;
  UnfocusedIcon: string;
  iconComponent: typeof Ionicons | typeof FontAwesome;
}

const CustomerNavigation = () => {
  const tabConfig: TabConfig[] = [
    {
      name: 'Home',
      Component: HomeScreen,
      focusedIcon: 'home',
      UnfocusedIcon: 'home-outline',
      iconComponent: Ionicons,
    },
    {
      name: 'Profile',
      Component: ProfileNavigation,
      focusedIcon: 'user',
      UnfocusedIcon: 'user-o',
      iconComponent: FontAwesome,
    },
    {
      name: 'Favourites',
      Component: FavouritesScreen,
      focusedIcon: 'heart',
      UnfocusedIcon: 'heart-o',
      iconComponent: FontAwesome,
    },
    {
      name: 'Reorder',
      Component: OrderScreen,
      focusedIcon: 'food',
      UnfocusedIcon: 'food-outline',
      iconComponent: MaterialCommunityIcons,
    },
    {
      name: 'Basket',
      Component: BasketScreen,
      focusedIcon: 'cart',
      UnfocusedIcon: 'cart-outline',
      iconComponent: Ionicons,
    },
  ];

  const screenOption = ({route}: any) => ({
    // eslint-disable-next-line react/no-unstable-nested-components
    tabBarIcon: ({
      focused,
      size,
      color,
    }: {
      focused: boolean;
      size: number;
      color: string;
    }) => {
      const routeConfig = tabConfig.find(config => config.name === route.name);
      const iconName = focused
        ? routeConfig?.focusedIcon
        : routeConfig?.UnfocusedIcon;
      const IconComponent = routeConfig?.iconComponent;

      if (!IconComponent || !iconName) {
        return null;
      }

      return <IconComponent name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#0163da',
    tabBarInactiveTintColor: 'black',
    tabBarHideOnKeyboard: true,
    keyboardHidesTabBar: true,
    headerShown: false,
    tabBarLabelStyle: {
      fontSize: 12,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    tabBarStyle: {
      height: 60,
      padding: 0,
    },
  });

  return (
    <TabNav.Navigator screenOptions={screenOption}>
      {tabConfig.map(routeConfig => (
        <TabNav.Screen
          key={routeConfig.name}
          name={routeConfig.name}
          component={routeConfig.Component}
        />
      ))}
    </TabNav.Navigator>
  );
};

export default CustomerNavigation;
