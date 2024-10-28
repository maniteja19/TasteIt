import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Image,Button} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);

  const fetchPreviousOrders = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('http://192.168.1.10:8080/orders', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setOrders(response.data);
      console.log(orders);
    } catch (error) {
      console.error('Error fetching previous orders', error);
    }
  };

    const renderDish = ({item}) => (
      <View style={styles.dishContainer}>
        {/* <Image source={{uri: item.dish.imageUrl}} style={styles.dishImage} /> */}
        <View style={styles.dishDetails}>
          <Text style={styles.dishName}>{item.dish.dishName}</Text>
          <Text style={styles.dishPrice}>Price: ${item.price}</Text>
          <Text style={styles.dishQuantity}>Quantity: {item.quantity}</Text>
        </View>
      </View>
    );

    const renderOrder = ({item}) => (
      <View style={styles.orderContainer}>
        <Text style={styles.orderHeader}>Order ID: {item._id}</Text>
        <Text style={styles.sellerInfo}>Seller: {item.sellerId}</Text>
        <Text style={styles.orderDate}>
          {/* Ordered on: {format(new Date(item.orderDate), 'MMMM dd, yyyy')} */}
        </Text>

        {/* List of dishes in the order */}
        <FlatList
          data={item.items}
          keyExtractor={dishItem => dishItem._id}
          renderItem={renderDish}
          style={styles.dishesList}
        />
      </View>
    );

  useEffect(() => {
    fetchPreviousOrders();
  }, []);
  console.log(orders);
  return (
    <View style={styles.container}>
    
      <Text style={styles.screenHeader}>My Previous Orders</Text>
    <Button title='ok' onPress={fetchPreviousOrders}/>
      {/* List of orders */}
      <FlatList
        data={orders}
        keyExtractor={item => item._id}
        renderItem={renderOrder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  screenHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sellerInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  dishesList: {
    marginTop: 8,
  },
  dishContainer: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  dishDetails: {
    flex: 1,
    marginLeft: 16,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dishPrice: {
    fontSize: 14,
    color: '#333',
  },
  dishQuantity: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default OrderScreen;
