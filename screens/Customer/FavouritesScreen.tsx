import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
export default function FavouritesScreen() {
  const [favourites, setFavourites] = useState([]);

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

  const removeFromFavourite = async (restaurantId: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.post(
        'http://192.168.1.10:8080/favorites',
        {
          userId,
          restaurantId,
        },
      );
      setFavourites(prev =>
        prev.filter(restaurant => restaurant._id !== restaurantId),
      );
      getFavourites();
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getFavourites();
    }, []),
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Favourite List</Text>
      {favourites.length > 0 ? (
        <FlatList
          data={favourites}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Image
                style={styles.restaurantImage}
                source={{uri: `${item.photo}`}}
              />
              <View style={styles.textContainer}>
                <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                <Text style={styles.address}>{item.address}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => removeFromFavourite(item._id)}>
                  <FontAwesome name="heart" size={30} color={'red'} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noContentcontainer}>
          <Material name="heart-plus-outline" size={90} color={'#9c978a'} />
          <Text style={styles.noContent}>No favorites.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
  },
  restaurantImage: {
    height: 80,
    width: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  heading: {
    // textAlign: 'center',
    marginLeft:15,
    fontSize: 29,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginTop: 10,
  },
  noContentcontainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContent:{
   fontSize:22,
  }
});
