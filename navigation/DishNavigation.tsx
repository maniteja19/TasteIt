import {} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ViewDishes from '../screens/Customer/ViewDishes';
import CustomerNavigation from './CustomerNavigation';
const Stack = createNativeStackNavigator();
export default function DishNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen
        name="food"
        component={CustomerNavigation}
      />
      <Stack.Screen
        name="Dishes"
        component={ViewDishes}
      />
    </Stack.Navigator>
  );
}
