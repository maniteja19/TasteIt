import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

const BasketScreen = () => {
  const navigation = useNavigation();
  const [basket, setBasket] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const handleHome = () => navigation.navigate('Home');

  const fetchBasket = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await axios.get(
        `http://192.168.1.10:8080/basket/${userId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setBasket(response.data);
      calculateTotal(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };
  const calculateTotal = items => {
    let total = items.reduce((acc, item) => {
      return acc + item.dish.dishPrice * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const updateQuantity = async (
    dishId: String,
    quantity: Number,
    price: Number,
  ) => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      if (quantity === 0) {
        removeItem(dishId);
      }
      const response = await axios.put('http://192.168.1.10:8080/basket/update', {
        dishId,
        quantity,
        userId,
        price,
      });
      if(response.data.message){
        Alert.alert('item out of stock');
      }
      fetchBasket();
    } catch (error) {
      console.error(error);
    }
  };
  const removeItem = async (dishId: String) => {
        const userId = await AsyncStorage.getItem('userId');
        try {
          await axios.delete('http://192.168.1.10:8080/basket/remove', {
            data: {dishId, userId},
          });
          fetchBasket();
        } catch (error) {
          console.error(error);
        }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBasket();
    }, []),
  );
  const order = async basket => {
    const grandTotal = totalPrice;
    try {
      await axios
        .post('http://192.168.1.10:8080/orders', {
          basket,
          grandTotal,
        })
        .then(res => console.log(res));
    } catch (error) {
      console.log(error);
    }
  };
  const PlaceAnOrder = async () => {
    order(basket);
    if (basket) {
      const length = basket.items.length;
      for (let i = 0; i < length; i++) {
        const item = basket.items[i];
        await removeItem(item.dish._id);
      }
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Basket</Text>
      {basket?.items.length > 0 ? (
        <>
          <FlatList
            data={basket.items || []}
            keyExtractor={item => item.dish._id}
            // style={styles.flat}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <View>
                  <Text style={styles.dishName}>{item.dish.dishName}</Text>
                  <Text style={styles.quantity}>
                    ₹{item.dish.dishPrice.toFixed(2)}
                  </Text>
                </View>
                <View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        updateQuantity(
                          item.dish._id,
                          item.quantity - 1,
                          item.dish.dishPrice,
                        )
                      }>
                      <Text style={styles.adjustButton}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(
                            item.dish._id,
                            item.quantity + 1,
                            item.dish.dishPrice,
                          )
                        }
                        >
                        <Text style={styles.adjustButton}>+</Text>
                      </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeItem(item.dish._id)}
                    style={styles.deleteContainer}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListFooterComponent={
              <View style={styles.footerContainer}>
                <Text style={styles.summaryText}>Order Summary</Text>
                <Text style={styles.summaryItem}>
                  Total Price: ₹{totalPrice.toFixed(2)}
                </Text>
                <Text style={styles.summaryItem}>Delivery Fee: Free</Text>
                <Text style={styles.summaryTotal}>
                  Total Amount: ₹{totalPrice.toFixed(2)}
                </Text>
              </View>
            }
          />
          <View style={styles.priceContainer}>
            <View style={styles.DeliveryButton}>
              <Text>Delivery at</Text>
              <Text>ok</Text>
            </View>
            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={PlaceAnOrder}>
              <View style={styles.PlacePriceContainer}>
                <View>
                  <Text style={styles.buttonText}>
                    ₹{totalPrice.toFixed(2)}
                  </Text>
                  <Text style={styles.totalText}>Total</Text>
                </View>
                <Text style={styles.buttonText}>Place Order</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="user-lock" size={90} color={'#9c978a'} />
          <Text style={styles.emptyText}>Your basket is empty</Text>
          <TouchableOpacity style={styles.button} onPress={handleHome}>
            <Text style={styles.buttonText}>Browse Dishes</Text>
          </TouchableOpacity>
        </View>
      )}
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FontAwesome
                name="check-circle"
                size={80}
                color="#28a745"
                style={styles.icon}
              />

              <Text style={styles.title}>Hooray! 🎉</Text>
              <Text style={styles.message}>
                Your order is on its way! We'll notify you when it's arriving
                hot and fresh.
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.primaryButtonText}>Great, Thanks!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  Order More Goodies
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f9fa'},
  header: {
    marginLeft: 15,
    fontSize: 29,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  dishName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 12,
  },
  quantity: {
    fontSize: 18,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0dfdf',
    borderRadius: 10,
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  adjustButton: {
    fontSize: 22,
    color: 'red',
  },
  deleteContainer: {
    alignItems: 'center',
    backgroundColor: '#f23333',
    padding: 8,
    borderRadius: 10,
    marginHorizontal: 10,
    marginRight: 16,
  },
  deleteText: {
    color: 'white',
  },
  priceContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
  },
  placeOrderButton: {
    flex: 0.7,
    backgroundColor: '#e32222',
    paddingVertical: 10,
    borderRadius: 10,
  },
  PlacePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    },
  DeliveryButton: {
    flex: 0.3,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginTop: 10,
    borderRadius: 8,
  },
  addressText: {fontSize: 16, fontWeight: 'bold'},
  addressDetails: {fontSize: 14, color: '#555'},
  summaryText: {fontSize: 20, fontWeight: 'bold', marginTop: 16},
  summaryItem: {fontSize: 16, color: '#555', marginTop: 4},
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {marginVertical: 14, color: 'black'},
  button: {
    backgroundColor: '#2b2a27',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 13,
  },
  buttonText: {color: 'white', fontSize: 20, fontWeight: '500'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    height: 400,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    // width: 320,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  icon: {marginBottom: 15},
  title: {fontSize: 28, fontWeight: 'bold', marginBottom: 10},
  message: {textAlign: 'center', fontSize: 18, color: '#666', marginBottom: 20},
  primaryButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  primaryButtonText: {color: 'white', fontWeight: '600', fontSize: 18},
  secondaryButton: {paddingVertical: 8, paddingHorizontal: 30},
  secondaryButtonText: {color: '#007bff', fontWeight: '600', fontSize: 16},
  totalText:{
    color:'white',
    fontSize:16,
    textAlign:'center',
    fontWeight:'600',
  }
});

export default BasketScreen;
