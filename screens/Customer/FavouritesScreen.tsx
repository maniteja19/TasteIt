import {ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
export default function FavouritesScreen() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getFavourites();
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Favourite List</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : favourites.length > 0 ? (
        <FlatList
          data={favourites}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Image
                style={styles.restaurantImage}
                source={{
                  uri:
                    item.photo === '' || item.photo == null
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                      : item.photo,
                }}
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
    backgroundColor:'grey',
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
