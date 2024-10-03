import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SellerDashboard = () => {
  const [dishes, setDishes] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [newDish, setNewDish] = useState({
    dishName: '',
    dishPrice: '',
    dishDescription: '',
    dishQuantity:'',
    dishType:'',
  });

  const fetchDishes = async () => {
    const sellerId = await AsyncStorage.getItem('userId');
    try {
      const res = await axios.get(
        `http://192.168.1.10:8080/sellers/${sellerId}/dishes`,
      );
      setDishes(res.data.dishes);
    } catch (error) {
      console.error('Error fetching dishes', error);
    }
  };

  const addDish = async () => {
    const sellerId = await AsyncStorage.getItem('userId');
    try {
      if (
        !newDish.dishName ||
        !newDish.dishPrice ||
        !newDish.dishDescription ||
        !newDish.dishType ||
        !newDish.dishQuantity
      ) {
        Alert.alert('Please fill all the fields');
      }
      const res = await axios.post(
        `http://192.168.1.10:8080/sellers/${sellerId}/dishes/`,
        newDish,
      );
      setDishes([...dishes, res.data.dish]);
      setNewDish({
        dishName: '',
        dishPrice: '',
        dishDescription: '',
        dishQuantity: '',
        dishType: '',
      });
      console.log(res.data);
      setIsAdd(false);
    } catch (error) {
      console.error('Error adding dish', error);
    }
  };

  const deleteDish = async (dishId: any) => {
    const sellerId = await AsyncStorage.getItem('userId');
    try {
      await axios
        .delete(`http://192.168.1.10:8080/sellers/${sellerId}/dishes/${dishId}`);
      setDishes(dishes.filter((dish: { _id: any; }) => dish._id !== dishId));

    } catch (error) {
      console.error('Error deleting dish', error);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seller Dashboard</Text>
      {isAdd ? (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Dish Name"
            value={newDish.dishName}
            onChangeText={value => setNewDish({...newDish, dishName: value})}
            style={styles.input}
          />
          <TextInput
            placeholder="Dish Price"
            value={newDish.dishPrice}
            onChangeText={value => setNewDish({...newDish, dishPrice: value})}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Dish Description"
            value={newDish.dishDescription}
            onChangeText={value =>
              setNewDish({...newDish, dishDescription: value})
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Dish Type"
            value={newDish.dishType}
            onChangeText={value => setNewDish({...newDish, dishType: value})}
            style={styles.input}
          />
          <TextInput
            placeholder="Dish Quantity"
            value={newDish.dishQuantity}
            onChangeText={value =>
              setNewDish({...newDish, dishQuantity: value})
            }
            style={styles.input}
          />
          <Button title="Add Dish" onPress={addDish} />
          <Button title="Cancel" onPress={() => setIsAdd(false)} />
        </View>
      ) : (
        <View style={styles.flatContainer}>
          <Button title="Add Dish" onPress={() => setIsAdd(true)} />
          <FlatList
            data={dishes}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={styles.dishItem}>
                <Text>Dish: {item.dishName}</Text>
                <Text>Price: {item.dishPrice}</Text>
                <Text>Description: {item.dishDescription}</Text>
                <TouchableOpacity onPress={() => deleteDish(item._id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  flatContainer:{
    marginBottom:100,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  dishItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  deleteButton: {
    color: 'red',
    marginTop: 8,
  },
});

export default SellerDashboard;
