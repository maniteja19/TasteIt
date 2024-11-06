import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Searchbar, Text, IconButton} from 'react-native-paper';
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
    // getFavourites();
    allRestaurants();
  }, []);
  useFocusEffect(
    useCallback(()=>{
      getFavourites();
    })
  )
  const removeFromFavourite = async (restaurantId:string) => {
    try{
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
            source={{uri: `${item.photo}`}}
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
      { !isSearching && searchQuery === '' ? (
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
});

export default HomeScreen;
