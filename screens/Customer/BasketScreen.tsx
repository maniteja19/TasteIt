import React, {useState, useCallback} from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const BasketScreen = () => {
  const navigation = useNavigation();
  const [basket, setBasket] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchBasket = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await axios.get(
        `http://192.168.1.10:8080/basket/${userId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setBasket(response.data);
      calculateTotal(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };
  const calculateTotal = items => {
    let total = items.reduce((acc, item) => {
      return acc + item.dish.dishPrice * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const updateQuantity = async (dishId:String, quantity:Number, price:Number) => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      if (quantity === 0) {
        removeItem(dishId);
      }
      await axios.put('http://192.168.1.10:8080/basket/update', {
        dishId,
        quantity,
        userId,
        price,
      });
      fetchBasket();
    } catch (error) {
      console.error(error);
    }
  };
  const removeItem = async (dishId:String )=> {
    const userId = await AsyncStorage.getItem('userId');
    try {
      await axios.delete('http://192.168.1.10:8080/basket/remove', {
        data: {dishId, userId},
      });
      fetchBasket();
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBasket();
    }, []),
  );
  const order = async (basket) =>{
    try{
      await axios.post('http://192.168.1.10:8080/orders', {
        basket,
      }).then(
        res=>console.log(res)
      );
    }
    catch(error){
      console.log(error);
    }
  };
  const PlaceAnOrder = async () =>{
    order(basket);
    if(basket){
      const length = basket.items.length;
      for(let i = 0; i < length; i++){
        const item = basket.items[i];
        await removeItem(item.dish._id);
      }
    }
    navigation.navigate('Feedback');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Basket</Text>

      <FlatList
        data={basket?.items || []}
        keyExtractor={item => item.dish._id}
        style={styles.flat}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.dishName}>{item.dish.dishName}</Text>
            <Text style={styles.quantity}>Price: ${item.dish.dishPrice}</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="-"
                onPress={() =>
                  updateQuantity(
                    item.dish._id,
                    item.quantity - 1,
                    item.dish.dishPrice,
                  )
                }
              />
              <Text>{item.quantity}</Text>
              <Button
                title="+"
                onPress={() =>
                  updateQuantity(
                    item.dish._id,
                    item.quantity + 1,
                    item.dish.dishPrice,
                  )
                }
              />
              <Button
                title="Remove"
                onPress={() => removeItem(item.dish._id)}
                color="red"
              />
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.Footercontainer}>
            <Text style={styles.summaryText}>Order Summary</Text>
            <Text style={styles.summaryItem}>
              Total Price: ${totalPrice.toFixed(2)}
            </Text>
            <Text style={styles.summaryItem}>Delivery Fee: Free</Text>
            <Text style={styles.summaryTotal}>
              Total Amount: ${totalPrice.toFixed(2)}
            </Text>
          </View>
        }
      />
      <View style={styles.priceContainer}>
        <Button title="Place Order" onPress={()=>PlaceAnOrder()}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    color: '#555',
  },
  Footercontainer:{
    marginVertical:100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  summaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryItem: {
    fontSize: 16,
    color: '#555',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  flat: {},
});

export default BasketScreen;
