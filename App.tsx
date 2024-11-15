import {} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthNavigation from './navigation/AuthNavigation';
import SellerNavigation from './navigation/SellerNavigation';
import AdminNavigation from './navigation/AdminNavigation';
import DishNavigation from './navigation/DishNavigation';
const Stack = createNativeStackNavigator();
function App(){
  return(
      <NavigationContainer>
       <Stack.Navigator screenOptions={
        {headerShown:false}
       }>
        <Stack.Screen name ="Auth" component={AuthNavigation}/>
        <Stack.Screen name = "Home" component={DishNavigation}/>
        <Stack.Screen name ="Seller" component={SellerNavigation}/>
        <Stack.Screen name = "Admin" component={AdminNavigation}/>
       </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
