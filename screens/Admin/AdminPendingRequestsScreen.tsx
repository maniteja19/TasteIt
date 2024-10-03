import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const AdminPendingRequestsScreen = () => {
  const navigation = useNavigation();
  const [pendingSellers, setPendingSellers] = useState([]);
  const handleBack = () =>{
    navigation.goBack();
  }
  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    try {
      const response = await axios.get(
        'http://192.168.1.10:8080/sellers?status=pending',
      );
      setPendingSellers(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleApproval = async (sellerId: object, status: string) => {
    try {
      await axios.put(`http://192.168.1.10:8080/sellers/${sellerId}/status`, {
        status,
      });
      fetchPendingSellers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitButton} onPress={handleBack}>
          <Ionicons name="chevron-back-outline" size={30} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.title}>Pending Requests</Text>
      </View>
      {pendingSellers.length === 0 ? (
        <View style={styles.noRequestsContainer}>
          <Text style={styles.noRequestsText}>No Pending Requests</Text>
        </View>
      ) : (
        <FlatList
          data={pendingSellers}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.restaurantName}>{item.restaurantName}</Text>
              <Text style={styles.email}>{item.email}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleApproval(item._id, 'approved')}>
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleApproval(item._id, 'rejected')}>
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
    marginLeft: 20,
  },
  pendingCount: {
    fontSize: 16,
    marginBottom: 16,
    color: '#6c757d',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noRequestsText: {
    fontSize: 20,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
  },
  exitButton: {
    flex:0.45,
    justifyContent:'center',
    marginTop:-5,
    opacity:0.5,
  },
});

export default AdminPendingRequestsScreen;
