import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function FavouritesScreen() {
        
      const getFavourites = async () => {
        const userId = await AsyncStorage.getItem('userId');
        try {
          const response = await axios.get(
            `http://192.168.1.10:8080/favourites/${userId}`,
          );
          setFavourites(response.data.data);
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <View>
      <Text>FavouritesScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({})