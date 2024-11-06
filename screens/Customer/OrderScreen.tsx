import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Image} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { format } from 'date-fns';

const PreviouslyOrderedItemsScreen = () => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchPreviousOrders = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(
        'http://192.168.1.10:8080/orders',
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching previous orders', error);
    }
  };

    const calculateTotal = items => {
      let total = items.reduce((acc, item) => {
        return acc + item.dish.dishPrice * item.quantity;
      }, 0);
      setTotalPrice(total);
    };
   useFocusEffect(
     React.useCallback(() => {
       fetchPreviousOrders();
     }, []),
   );

  const renderDish = ({item}) => (
    <View style={styles.dishContainer}>
      <View style={styles.dishDetails}>
        <Text style={styles.dishName}>
          {item.quantity} x {item.dish?.dishName}
        </Text>
        <Text>{totalPrice}</Text>
      </View>
    </View>
  );

  const renderOrder = ({item}) => (
    <View style={styles.orderContainer}>
      <TouchableOpacity style={styles.containerOne}>
        <Image
          style={styles.dishImage}
          source={{uri: `${item.sellerId.photo}`}}
        />
        <View style={styles.innerContainerOne}>
          <Text style={styles.orderHeader}>{item.sellerId.restaurantName}</Text>
          <Text style={styles.sellerLocation}>{item.sellerId.address}</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={item.items}
        keyExtractor={dishItem => dishItem._id}
        renderItem={renderDish}
        style={styles.dishesList}
        showsVerticalScrollIndicator={false}
      />

      <Text style={styles.orderDate}>
        Ordered on:
        {format(new Date(item.createdAt), 'MMMM dd, yyyy - hh:mm a')}
      </Text>
      <Text>Delivered</Text>

      <View>
        <TouchableOpacity>
          <Text>
            <Material name="arrow-u-left-top" size={30} />
            Order Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenHeader}>Previous Orders</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          renderItem={renderOrder}
        />
      ) : (
        <View style={styles.EmptyContainer}>
          <FontAwesome name="bowl-food" size={90} color={'#9c978a'} />
          <Text style={styles.EmptyText}>Yet to order</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    // padding: 16,
  },
  screenHeader: {
    // fontSize: 29,
    // fontWeight: 'bold',
    // marginBottom: 16,
    // // textAlign: 'center',
    marginLeft: 15,
    fontSize: 29,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginTop: 10,
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
  },
  containerOne: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 12,
    borderBottomColor: 'grey',
  },
  innerContainerOne: {
    marginLeft: 14,
  },
  orderHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sellerInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  sellerLocation: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  dishesList: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderStyle: 'dashed',
  },
  dishContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingBottom:14,
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
  EmptyContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  EmptyText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '400',
    marginTop: 10,
  },
});

export default PreviouslyOrderedItemsScreen;
