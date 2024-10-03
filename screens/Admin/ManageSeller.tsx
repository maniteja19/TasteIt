import {FlatList, Text, TouchableOpacity, View, StyleSheet,Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import swal from 'sweetalert';



export default function ManageSeller() {
    const navigation = useNavigation();
    const [restaurants, setRestaurants] = useState([]);
    const handleBack = () =>{
        navigation.goBack();
    };
    const handleSellers = async () => {
        try {
        const response = await axios.get('http://192.168.1.10:8080/restaurants');
        setRestaurants(response.data.data);
        } catch (error) {
        console.log(error);
        }
    };

    useEffect(() => {
        handleSellers();
    }, []);

    const handleDelete = async (id: Object) => {
        try {
            Alert.alert('Are you sure?');
            await axios.delete(`http://192.168.1.10:8080/restaurants/${id}`);
            handleSellers();
        } catch (error) {
        console.log(error);
        }
    };

    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.exitButton} onPress={handleBack}>
            <Ionicons name="chevron-back-outline" size={30} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.title}>Manage Sellers</Text>
        </View>
        {restaurants.length === 0 ? (
          <Text style={styles.noRequestsText}>No Restaurants</Text>
        ) : (
          <FlatList
            data={restaurants}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={styles.card}>
                <View style={styles.infoContainer}>
                  <Text style={styles.restaurantName}>
                    {item.restaurantName}
                  </Text>
                  <Text style={styles.detailText}>{item.email}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item._id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    marginTop: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  detailText: {
    fontSize: 14,
    color: '#6c757d',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noRequestsText: {
    fontSize: 20,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 22,
  },
  exitButton:{
    opacity:0.3,
  },
});
