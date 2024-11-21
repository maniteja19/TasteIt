import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { format } from 'date-fns';
import Entypo from 'react-native-vector-icons/Entypo';

const PreviouslyOrderedItemsScreen = () => {
  const [orders, setOrders] = useState([]);
  const [addToBasket, setAddToBasket] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [comments, setComments] = useState('');
  const [modalParameter, setModalParameter] = useState(null);
  const [totalComments, setTotalComments] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [loading,setLoading] = useState(true);
      // const addBasket = async (dishId: string, sellerId: string, price) => {
      //   const token = await AsyncStorage.getItem('token');
      //   const userId = await AsyncStorage.getItem('userId');
      //   try {
      //     await axios
      //       .post(
      //         'http://192.168.1.10:8080/basket/add',
      //         {userId, dishId, sellerId, quantity: 1, price},
      //         {headers: {Authorization: `Bearer ${token}`}},
      //       )
      //       .then(res => console.log(res.data));
      //     Alert.alert('Added to Basket', 'Dish has been added to your basket.');
      //   } catch (error) {
      //     console.error('error', error);
      //   }
      // };
  const fetchPreviousOrders = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(
        'http://192.168.1.10:8080/orders',
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching previous orders', error);
    }
  };

  const getComments = async () => {
    const userId = await AsyncStorage.getItem('userId');

    const response = await axios.get(
      `http://192.168.1.10:8080/comment/${userId}`,
    );
    const commentArray = response.data.map(comment => comment.orderId);
    setComments(commentArray);
    setTotalComments(response.data);
  };
   useFocusEffect(
     React.useCallback(() => {
       fetchPreviousOrders();
       getComments();
     }, []),
   );
   useEffect(() => {
     const fetchOrders = async () => {
       try {
         await fetchPreviousOrders();
       } finally {
         setLoading(false);
       }
     };
     fetchOrders();
   }, []);
   const submitRating = async (orderId) => {

    console.log(orderId);
    if(rating === 0){
        Alert.alert("please enter rating");
        setModalVisible(true);
        return;
    }
    try {
      await axios.post(
        'http://192.168.1.10:8080/comment',
        {
          orderId,
          rating,
          feedback,
        },
      );
      Alert.alert('Rating Submitted', 'Thank you for your feedback!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting rating', error);
    }
  };
const getRatingsByOrderId = orderId => {
  return totalComments
    .filter(order => order.orderId === orderId)
    .map(order => order.rating);
};
  const renderRatingStars = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
          >
            <Material
              name={star <= rating ? 'star' : 'star-outline'}
              size={24}
              color="#e32222"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  const renderDish = ({item}) => (
    <View style={styles.dishContainer}>
      <View style={styles.dishDetails}>
        <Text style={styles.dishQuantity}>{item.quantity} x </Text>
        <Text style={styles.dishName}>{item.dish?.dishName}</Text>
      </View>
    </View>
  );

  const renderOrder = ({item}) => {
    return (
      <View style={styles.orderContainer}>
        <TouchableOpacity style={styles.containerOne}>
          <Image
            style={styles.dishImage}
            source={{
              uri:
                item.sellerId.photo === '' || item.sellerId.photo == null
                  ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                  : item.sellerId.photo,
            }}
          />
          <View style={styles.innerContainerOne}>
            <Text style={styles.orderHeader}>
              {item.sellerId.restaurantName}
            </Text>
            <Text style={styles.sellerLocation}>{item.sellerId.address}</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={item.items}
          keyExtractor={dishItem => dishItem._id}
          renderItem={renderDish}
          style={styles.dishesList}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.containerTwo}>
          <View>
            <Text style={styles.orderDate}>
              Order placed on:
              {format(new Date(item.createdAt), 'MMM dd, HH:mm')}
            </Text>
            <Text style={styles.orderDate}>Delivered</Text>
          </View>
          <View style={styles.InnerContainerTwo}>
            <Text style={styles.price}>₹ {item.total}</Text>
          </View>
        </View>

        <View style={styles.orderAgainContainer}>
          {comments.includes(item._id.toString()) ? (
            <View style={styles.commentContainer}>
              <View style={styles.ratingContainer}>
                <Text style={styles.starText}>
                  You rated: {getRatingsByOrderId(item._id)}
                </Text>
                <Text style={styles.star}>★</Text>
              </View>
            </View>
          ) : (
            <View style={styles.ratingContainer}>
              <TouchableOpacity
                onPress={() => {
                  setModalParameter(item._id);
                  setModalVisible(true);
                  setOrderId(item._id);
                }}>
                <Text style={styles.feedbackText}>
                  Share rating and feedback
                  <Entypo name="triangle-right" size={15} color={'#e32222'} />
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={styles.orderAgainButton}
            onPress={() => setAddToBasket(item.items)}>
            <Text style={styles.orderText}>
              <FontAwesome name="arrow-rotate-left" size={15} /> Order Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
};

  return (
    <View style={styles.container}>
      <Text style={styles.screenHeader}>Previous Orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : orders.length > 0 ? (
        <FlatList
          data={[...orders].reverse()}
          keyExtractor={item => item._id}
          renderItem={renderOrder}
        />
      ) : (
        <View style={styles.EmptyContainer}>
          <FontAwesome name="bowl-food" size={90} color={'#9c978a'} />
          <Text style={styles.EmptyText}>Yet to order</Text>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.innerRatingContainer}>
              <Text style={styles.ratingText}>Rate:</Text>
              <Text> {renderRatingStars()}</Text>
            </View>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Leave a feedback..."
              value={feedback}
              onChangeText={setFeedback}
              editable={!isSubmitted}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errorMessage ? (
              <Text style={styles.errorMessageText}>{errorMessage}</Text>
            ) : (
              ''
            )}
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  if (rating === 0) {
                    setErrorMessage('Please provide rating.');
                  } else {
                    submitRating(modalParameter);
                    setRating(0);
                    setFeedback('');
                    setModalVisible(false);
                    setErrorMessage('');
                  }
                }}
                disabled={isSubmitted}>
                <Text style={styles.submitButtonText}>
                  {isSubmitted ? 'Submitted' : 'Submit'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setRating(0);
                  setFeedback('');
                  setModalVisible(false);
                }}
                style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    // padding: 16,
  },
  screenHeader: {
    marginLeft: 15,
    fontSize: 29,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginTop: 10,
  },
  orderContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
  },
  containerOne: {
    flexDirection: 'row',
    borderBottomWidth: 0.2,
    paddingBottom: 12,
    borderBottomColor: 'grey',
    marginBottom: 10,
  },
  innerContainerOne: {
    marginLeft: 14,
  },
  containerTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  InnerContainerTwo: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 10,
  },
  price: {
    color: 'black',
    fontWeight: '500',
    fontSize: 18,
  },
  orderHeader: {
    fontSize: 22,
    fontWeight: '500',
    color: 'black',
    fontFamily: '	Arial',
  },
  sellerLocation: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    fontFamily: '	Arial',
  },
  orderDate: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
    fontFamily: '	Arial',
  },
  dishesList: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderStyle: 'dashed',
  },
  dishContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingBottom: 14,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor:'grey',
  },
  dishDetails: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 16,
  },
  dishName: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: '	Arial',
    color: 'black',
  },

  dishQuantity: {
    fontSize: 18,
  },
  EmptyContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  EmptyText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '400',
    marginTop: 10,
  },
  orderAgainContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    flex: 0.6,
    alignItems: 'center',
    margin: 5,
  },
  commentContainer:{
    flex:0.6,
  },
  innerRatingContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 16,
  },
  orderAgainButton: {
    backgroundColor: '#e32222',
    flex: 0.5,
    paddingVertical: 12,
    borderRadius: 10,
  },
  orderText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  starContainer: {
    flexDirection: 'row',
  },
  feedbackText: {
    color: '#e32222',
    fontSize: 15,
    fontFamily: 'Arial',
    marginLeft: 12,
  },
  feedbackInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    width: '80%',
  },
  submitButton: {
    backgroundColor: '#e32222',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 14,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 16,
  },
  rateText: {
    fontSize: 18,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 320,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  errorMessageText: {
    color: 'red',
    fontSize: 16,
  },
  star: {
    color: '#e32222',
    fontSize: 20,
  },
  starText:{
    color:'black',
    fontSize:16,
  }
});

export default PreviouslyOrderedItemsScreen;
