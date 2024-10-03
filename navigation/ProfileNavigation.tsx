import {} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Customer/Profile';
import EditProfile from '../screens/Customer/EditProfile';
const Stack = createNativeStackNavigator();
export default function ProfileNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown:false}}/>
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}
