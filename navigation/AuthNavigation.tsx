import {} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomePage from '../screens/Auth/WelcomePage';
import LoginScreen from '../screens/Auth/LoginScreen';
import SellerSignup from '../screens/Auth/SellerSignup';
import CustomerSignup from '../screens/Auth/CustomerSignup';
const Stack = createNativeStackNavigator();
const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="WelcomePage" component={WelcomePage} />
      <Stack.Screen name="CustomerSignup" component={CustomerSignup} />
      <Stack.Screen name="SellerSignup" component={SellerSignup} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
