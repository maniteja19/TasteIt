import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

export default function RestaurantInsightsScreen() {
  const [totalLikes, setTotalLikes] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [customerFeedback, setCustomerFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurantDetails = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(
          'http://192.168.1.10:8080/sellerDetails',
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        setTotalLikes(response.data.count);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    } else {
      console.log('No token found');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRestaurantDetails();
      fetchCustomerFeedback();
    }, []),
  );

  useEffect(() => {
    const fetchLoader = async () => {
      try {
        await fetchCustomerFeedback();
      } finally {
        setLoading(false);
      }
    };
    fetchLoader();
  }, []);
  const fetchCustomerFeedback = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await axios(
        `http://192.168.1.10:8080/feedback/${userId}`,
      );
      setAverageRating(response.data.rating || 0);
      setCustomerFeedback(response.data.feedback);
    } catch (error) {
      console.error('Error fetching customer feedback:', error);
    }
  };

  const renderFeedbackItem = ({item}) => (
    <View style={styles.feedbackCard}>
      <View>
        <Text style={styles.customerUsername}>
          @{item.username.toLowerCase()}
        </Text>
        <Text style={styles.customerFeedback}>{item.feedback}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Customer Ratings & Feedback</Text>
        <View style={styles.statsContainer}>
          <View style={styles.likesBox}>
            <Text style={styles.likesCount}>{totalLikes}</Text>
            <Text style={styles.statsLabel}>Total Likes</Text>
          </View>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingCount}>{averageRating}</Text>
            <Text style={styles.statsLabel}>Average Rating</Text>
          </View>
        </View>
        <View style={styles.headerContainer}>
          <View style={styles.line} />
          <Text style={styles.headerText}>Customer FeedBacks</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.feedbackContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          ) : customerFeedback.length > 0 ? (
            <FlatList
              data={customerFeedback}
              renderItem={renderFeedbackItem}
              keyExtractor={item => item.orderId}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.emptyText}>No Feedbacks available</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    marginLeft: 6,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  likesBox: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#ff8c00',
    borderRadius: 8,
    padding: 15,
  },
  ratingBox: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#32cd32',
    borderRadius: 8,
    padding: 15,
  },
  likesCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  ratingCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statsLabel: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  feedbackContainer: {
    flex: 1,
    marginTop: 10,
  },
  feedbackCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 6,
    marginHorizontal: 4,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
  },
  customerUsername: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 18,
  },
  customerFeedback: {
    marginTop: 4,
    color: '#555',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  headerText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  emptyText:{
    textAlign:'center',
    marginTop:30,
    fontSize:16,
    color:'grey',
  },
loader:{
  alignItems:'center',
}
});
