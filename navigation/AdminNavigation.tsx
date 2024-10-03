import {} from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../screens/Admin/AdminScreen';
import AdminPendingRequestsScreen from '../screens/Admin/AdminPendingRequestsScreen';
import ManageSeller from '../screens/Admin/ManageSeller';
import AdminProfile from '../screens/Admin/AdminProfile';
import AdminEditProfile from '../screens/Admin/AdminEditProfile';

const Stack = createNativeStackNavigator();

export default function AdminNavigation() {
  return (
    <Stack.Navigator initialRouteName="Admin">
      <Stack.Screen
        name="AdminScreen"
        component={AdminDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PendingRequests"
        component={AdminPendingRequestsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ManageSellers"
        component={ManageSeller}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={AdminProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={AdminEditProfile}
      />
    </Stack.Navigator>
  );
}
