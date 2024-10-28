import {} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Customer/HomeScreen';
import ViewDishes from '../screens/Customer/ViewDishes';
import FeedBack from '../screens/Customer/FeedBack';
const Stack = createNativeStackNavigator();
export default function DishNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Dishes" component={ViewDishes} />
      <Stack.Screen name = "Feedback" component={FeedBack} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
}
