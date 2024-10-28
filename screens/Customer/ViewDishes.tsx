import { Alert, Button, FlatList, StyleSheet, Text,View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Dish {
  _id: string;
  dishName: string;
  dishPrice: string;
  dishDescription: string;
  dishQuantity: string;
  dishType: string;
  seller:string
}

export default function ViewDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
    const route = useRoute();
      const fetchDishes = async () => {
        const sellerId = route.params?._id;
        try {
          const res = await axios.get<{dishes: Dish[]}>(
            `http://192.168.1.10:8080/sellers/${sellerId}/dishes`,
          );
          setDishes(res.data.dishes);
        } catch (error) {
          console.error('Error fetching dishes', error);
        }
      };
        useEffect(() => {
          fetchDishes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        const addToBasket = async (dishId: string, sellerId: string,price:Number) => {
          const token = await AsyncStorage.getItem('token');
          const userId = await AsyncStorage.getItem('userId');
          try {
            await axios.post(
              'http://192.168.1.10:8080/basket/add',
              {userId, dishId, sellerId, quantity: 1,price},
              {headers: {Authorization: `Bearer ${token}`}},
            ).then(
              res => console.log(res.data)
            );
            Alert.alert(
              'Added to Basket',
              'Dish has been added to your basket.',
            );
          } catch (error) {
            console.error('error',error);
          }
        };
  return (
    <View>
      <View style={styles.flatContainer}>
        <FlatList
          data={dishes}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.dishItem}>
              <Text>Dish: {item.dishName}</Text>
              <Text>Price: {item.dishPrice}</Text>
              <Text>Description: {item.dishDescription}</Text>
              <View>
                <Button
                  title="Add to Basket"
                  onPress={() => addToBasket(item._id,item.seller,item.dishPrice)}
                />
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flatContainer: {
    marginBottom: 100,
  },
  dishItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
});
