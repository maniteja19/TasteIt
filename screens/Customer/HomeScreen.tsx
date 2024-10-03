import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity, ScrollView,Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Text } from 'react-native-paper';
import axios from 'axios';
import Swiper from 'react-native-swiper';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const allUserDetails = async () => {
    try {
      const res = await axios.get('http://192.168.1.10:8080/restaurants');
      setUserDetails(res.data.data);
      setFilteredData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = userDetails.filter((user) =>
        user.restaurantName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(userDetails);
    }
  };

  useEffect(() => {
    allUserDetails();
  }, []);

  const renderUser = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.userName}>{item.restaurantName}</Text>
      <Text style={styles.userDetails}>{item.phoneNumber}</Text>
      <Text style={styles.userDetails}>{item.email}</Text>
      <Text style={styles.userDetails}>{item.role}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.searchbarContainer}>
        <Searchbar
          placeholder="Search for restaurant"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchbarInput}
          iconColor="grey"
        />
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
        <View>
          <View style={styles.slideContainer}>
            <Swiper autoplay={true} autoplayTimeout={4}
            dotColor="#ccc" activeDotColor="red"
            >
              <View style={styles.slider}>
                <Image source={require('../../assets/download.jpeg')} style={styles.image} />
              </View>
              <View style={styles.slider}>
                <Image source={require('../../assets/food.jpeg')} style={styles.image} />
              </View>
              <View style={styles.slider}>
                <Image source={require('../../assets/chicken.jpeg')} style={styles.image} />
              </View>
              <View style={styles.slider}>
                <Image source={require('../../assets/biryani.jpeg')} style={styles.image} />
              </View>
            </Swiper>
            </View>
            <View>
                <View style={styles.headerContainer}>
                    <View style={styles.line} />
                    <Text style={styles.headerText}>All Restaurants</Text>
                    <View style={styles.line} />
                </View>
            </View>
        </View>
        }
      />

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
    marginBottom:100,
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
  item: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  userDetails: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    margin: 20,
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonElevation: {
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  slideContainer:{
    height:200,
  },
  slider:{
    height:200,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  image:{
    height:200,
    width:'90%',
    borderRadius:10,
  },
  headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 40,
  marginBottom:20,
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
