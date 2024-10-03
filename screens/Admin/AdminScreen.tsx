import React,{useCallback, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
const AdminScreen = () => {
    const navigation = useNavigation();
    const [pendingCount,setPendingCount] = useState(0);
    const [totalSellers,setTotalSellers] = useState(0);
    const pendingRequests = () => {
        navigation.navigate('PendingRequests');
    }
    const manageSeller = () =>{
      navigation.navigate('ManageSellers');
    };
    const editProfile = () =>{
      navigation.navigate('Profile');
    };
      const fetchSellerCount = async () => {
       try {
         const response = await axios.get(
           'http://192.168.1.10:8080/restaurants',
         );
         setTotalSellers(response.data.data.length);
       } catch (error) {
         console.log(error);
       }
     };
     const fetchPendingCount = async () => {
       try {
         const response = await axios.get(
           'http://192.168.1.10:8080/sellers?status=pending',
         );
         setPendingCount(response.data.length);
       } catch (error) {
         console.error(error);
       }
     };
     useFocusEffect(
        useCallback(()=>{
            fetchPendingCount();
            fetchSellerCount();
        })
     );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.adminName}>Welcome, Admin</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {pendingCount}
          </Text>
          <Text style={styles.statText}>Pending Requests</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalSellers}</Text>
          <Text style={styles.statText}>Sellers</Text>
        </View>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={pendingRequests}>
          <Text style={styles.navText}>View Pending Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={manageSeller}>
          <Text style={styles.navText}>Manage Sellers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={editProfile}>
          <Text style={styles.navText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f8f9fa'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
},
  logoutButton: {backgroundColor: '#dc3545', padding: 10, borderRadius: 5},
  logoutText: {color: '#fff', fontWeight: 'bold'},
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  statNumber: {fontSize: 28, fontWeight: 'bold', color: '#007bff'},
  statText: {fontSize: 16, color: '#6c757d'},
  navigationContainer: {alignItems: 'center'},
  navButton: {
    width: '90%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginVertical: 10,
  },
  navText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AdminScreen;
