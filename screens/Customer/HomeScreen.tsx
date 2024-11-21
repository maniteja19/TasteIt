import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Searchbar, Text } from 'react-native-paper';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = userDetails.filter(
        user =>
          user.restaurantName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(userDetails);
    }
  };
  const handleExit = () =>{
    setSearchQuery('');
    setIsSearching(false);
    setFilteredData(userDetails);
  };

  const handleDishes = item => {
    navigation.navigate('Dishes', item);
    setSearchQuery('');
    setFilteredData(userDetails);
  };

  const addToFavourite = async (restaurantId:string) => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      await axios.post('http://192.168.1.10:8080/updateProfile', {
        userId,
        restaurantId,
      });
      setFavourites([...favourites, restaurantId]);
    } catch (error) {
      console.error(error);
    }
  };

  const allRestaurants = async () => {
    try {
      const res = await axios.get('http://192.168.1.10:8080/restaurants');
      setUserDetails(res.data.data);
      setFilteredData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getFavourites = async() => {
    const userId = await AsyncStorage.getItem('userId');
    try{
      const response = await axios.get(`http://192.168.1.10:8080/favourites/${userId}`);
      const resto = response.data.data.map((restaurant)=> restaurant._id);
      setFavourites(resto);
    }
    catch(error){
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchLoader = async () => {
      setLoading(true);
      await allRestaurants();
      await getFavourites();
      setLoading(false);
    };
    fetchLoader();
  }, []);
  useFocusEffect(
    useCallback(()=>{
      getFavourites();
    })
  );
  const removeFromFavourite = async (restaurantId:string) => {
    try{
      const userId = await AsyncStorage.getItem('userId');
      await axios.post(
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
    }
    catch(error){
      console.log(error);
    }
  };

  const renderUser = ({item}) => (
    <TouchableOpacity onPress={() => handleDishes(item)}>
      <View style={styles.item}>
        <View>
          <Image
            style={styles.restaurantImage}
            source={{
              uri:
                item.photo === '' || item.photo == null
                  ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                  : item.photo,
            }}
          />
        </View>

        <View style={styles.cardContainer}>
          <View>
            <Text style={styles.restaurantName}>{item.restaurantName}</Text>
            <Text style={styles.userDetails}>{item.address}</Text>
          </View>
          <View>
            {favourites.includes(item._id) ? (
              <TouchableOpacity onPress={() => removeFromFavourite(item._id)}>
                <FontAwesome name="heart" size={30} color={'red'} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => addToFavourite(item._id)}>
                <FontAwesome name="heart-o" size={30} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.searchbarContainer}>
        {isSearching ? (
          <Searchbar
            placeholder="Search for Dishes"
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbar}
            inputStyle={styles.searchbarInput}
            // eslint-disable-next-line react/no-unstable-nested-components
            icon={() => (
              <Ionicons
                name="chevron-back-outline"
                size={30}
                color={'black'}
                onPress={handleExit}
              />
            )}
            iconColor="grey"
          />
        ) : (
          <Searchbar
            placeholder="Search for restaurant"
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbar}
            inputStyle={styles.searchbarInput}
            iconColor="grey"
            onPress={() => setIsSearching(true)}
          />
        )}
      </View>
      {/* {loading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          ) :( */}
      {!isSearching && searchQuery === '' ? (
        <View>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          ) : (
            <FlatList
              data={filteredData}
              renderItem={renderUser}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View>
                  <View style={styles.slideContainer}>
                    <Swiper
                      autoplay={true}
                      autoplayTimeout={4}
                      dotColor="#ccc"
                      activeDotColor="red">
                      <View style={styles.slider}>
                        <Image
                          source={require('../../assets/download.jpeg')}
                          style={styles.image}
                        />
                      </View>
                      <View style={styles.slider}>
                        <Image
                          source={require('../../assets/food.jpeg')}
                          style={styles.image}
                        />
                      </View>
                      <View style={styles.slider}>
                        <Image
                          source={require('../../assets/chicken.jpeg')}
                          style={styles.image}
                        />
                      </View>
                      <View style={styles.slider}>
                        <Image
                          source={require('../../assets/biryani.jpeg')}
                          style={styles.image}
                        />
                      </View>
                    </Swiper>
                  </View>
                  <View style={styles.headerContainer}>
                    <View style={styles.line} />
                    <Text style={styles.headerText}>All Restaurants</Text>
                    <View style={styles.line} />
                  </View>
                </View>
              }
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderUser}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchbarContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  searchbar: {
    marginVertical: 10,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: '#fff',
  },
  searchbarInput: {
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingTop: 70,
    paddingBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  item: {
    paddingBottom: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  restaurantName: {
    fontWeight: '600',
    fontSize: 25,
    color: 'black',
  },
  userDetails: {
    fontSize: 16,
    color: '#555',
  },
  slideContainer: {
    height: 200,
  },
  slider: {
    height: 200,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 200,
    width: '90%',
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },
  headerText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  loader:{
    alignItems:'center',
  },
});

export default HomeScreen;
