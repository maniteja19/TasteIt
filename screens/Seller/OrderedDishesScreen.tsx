import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import {format} from 'date-fns';

const OrderedDishesScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrderedDishes = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('http://192.168.1.10:8080/orderedDishes', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching previous orders', error);
    }
  };
useEffect(() => {
  const fetchOrders = async () => {
    try {
      await getOrderedDishes();
    } finally {
      setLoading(false);
    }
  };
  fetchOrders();
}, []);

  const renderDish = ({item}) => (
    <View style={styles.dishContainer}>
      <View style={styles.dishDetails}>
        <Text style={styles.dishQuantity}>{item.quantity} x </Text>
        <Text style={styles.dishName}>{item.dish?.dishName}</Text>
      </View>
    </View>
  );
  const renderOrder = ({item}) => {
    return (
      <View style={styles.orderContainer}>
        <TouchableOpacity style={styles.containerOne}>
          <View style={styles.innerContainerOne}>
            <Text style={styles.orderHeader}>
              {item.userId.name}
            </Text>
            <Text style={styles.sellerLocation}>{item.userId.address}</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={item.items}
          keyExtractor={dishItem => dishItem._id}
          renderItem={renderDish}
          style={styles.dishesList}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.containerTwo}>
          <View>
            <Text style={styles.orderDate}>
              Order placed on:
              {format(new Date(item.createdAt), 'MMM dd, HH:mm')}
            </Text>
            <Text style={styles.orderDate}>Delivered</Text>
          </View>
          <View style={styles.InnerContainerTwo}>
            <Text style={styles.price}>₹ {item.total}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.screenHeader}>Ordered Dishes</Text>
      {loading ? (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    ) :
      orders.length > 0 ? (
        <FlatList
          data={[...orders].reverse()}
          keyExtractor={item => item._id}
          renderItem={renderOrder}
        />
      ) : (
        <View style={styles.EmptyContainer}>
          <FontAwesome name="bowl-food" size={90} color={'#9c978a'} />
          <Text style={styles.EmptyText}>Not yet ordered</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenHeader: {
    marginLeft: 15,
    fontSize: 29,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginTop: 10,
  },
  orderContainer: {
    flex: 1,
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
    borderBottomWidth: 0.7,
    paddingBottom: 12,
    borderBottomColor: 'grey',
    marginBottom: 10,
  },
  innerContainerOne: {
    marginLeft: 14,
  },
  containerTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  InnerContainerTwo: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 10,
  },
  price: {
    color: 'black',
    fontWeight: '500',
    fontSize: 18,
  },
  orderHeader: {
    fontSize: 22,
    fontWeight: '500',
    color: 'black',
    fontFamily: '	Arial',
    marginBottom: 4,
  },
  sellerLocation: {
    fontSize: 14,
    color: '#888',
    fontFamily: '	Arial',
  },
  orderDate: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
    fontFamily: '	Arial',
  },
  dishesList: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderStyle: 'dashed',
  },
  dishContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingBottom: 14,
  },
  dishDetails: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 16,
  },
  dishName: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: '	Arial',
    color: 'black',
  },

  dishQuantity: {
    fontSize: 18,
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

  starContainer: {
    flexDirection: 'row',
  },
  loader:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
});

export default OrderedDishesScreen;
