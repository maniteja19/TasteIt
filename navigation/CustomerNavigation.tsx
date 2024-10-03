import {} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomePage from '../screens/Customer/HomeScreen';
import BasketScreen from '../screens/Customer/BasketScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProfileNavigation from './ProfileNavigation';

const TabNav = createBottomTabNavigator();
const CustomerNavigation = () => {
  const tabConfig = [
    {
      name: 'HomeScreen',
      Component: HomePage,
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
      name: 'Cart',
      Component: BasketScreen,
      focusedIcon: 'cart',
      UnfocusedIcon: 'cart-outline',
      iconComponent: Ionicons,
    },
  ];
  const screenOption = ({route}) => ({
    //eslint-disable-next-line react/no-unstable-nested-components
    tabBarIcon: ({focused, size, color}) => {
      const routeConfig = tabConfig.find(config => config.name === route.name);
      const iconName = focused
        ? routeConfig?.focusedIcon
        : routeConfig?.UnfocusedIcon;
      const IconComponent = routeConfig.iconComponent;
      if (!IconComponent || !iconName) {
        return null;
      }
      return <IconComponent name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#0163da',
    tabBarInactiveTintColor: 'black',
    tabBarHideOnKeyboard:true,
    keyboardHidesTabBar:true,
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
