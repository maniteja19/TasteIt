import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Searchbar } from 'react-native-paper';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userDetails, setUserDetails] = useState('');

  const allUserDetails = async ()=>{
    axios.get('http://192.168.1.10:8080/userDetails')
    .then(res=>{console.log(res.data);
      setUserDetails(res.data.data);
      setSearchQuery
    }
  );
  };

  useEffect(()=>{
    allUserDetails();
  },[]);


  const renderRestaurant = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantName}>{item.phone}</Text>
      <Text style={styles.restaurantName}>{item.email}</Text>
      <Text style={styles.restaurantName}>{item.role}</Text>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Searchbar
        placeholder="Search for restaurants"
        //onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchbarInput}
        iconColor="#ff6347"
      />
      <FlatList
        data={userDetails}
        renderItem={renderRestaurant}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchbar: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  searchbarInput: {
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
  },
  restaurantName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});
