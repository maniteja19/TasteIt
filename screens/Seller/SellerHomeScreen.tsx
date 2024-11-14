import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Dish {
  _id: string;
  dishName: string;
  dishPrice: string;
  dishDescription: string;
  dishQuantity: string;
  dishType: string;
}

interface NewDish {
  dishName: string;
  dishPrice: string;
  dishDescription: string;
  dishQuantity: string;
  dishType: string;
}

const SellerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [newDish, setNewDish] = useState<NewDish>({
    dishName: '',
    dishPrice: '',
    dishDescription: '',
    dishQuantity: '',
    dishType: '',
  });
  const [isSelected, setIsSelected] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [currentDishId, setCuurentDishId] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [showReadMore, setShowReadMore] = useState<{[key: string]: boolean}>(
    {},
  );

  const fetchDishes = async () => {
    const sellerId = await AsyncStorage.getItem('userId');
    try {
      const res = await axios.get<{dishes: Dish[]}>(
        `http://192.168.1.10:8080/sellers/${sellerId}/dishes`,
      );
      setDishes(res.data.dishes);
    } catch (error) {
      console.error('Error fetching dishes', error);
    }
  };

  const addDish = async () => {
    const sellerId = await AsyncStorage.getItem('userId');
    try {
      if (
        !newDish.dishName ||
        !newDish.dishPrice ||
        !newDish.dishDescription ||
        !newDish.dishType ||
        !newDish.dishQuantity
      ) {
        Alert.alert('Please fill all the fields');
        return;
      }
      const res = await axios.post<{dish: Dish}>(
        `http://192.168.1.10:8080/sellers/${sellerId}/dishes/`,
        newDish,
      );
      setDishes([...dishes, res.data.dish]);
      setNewDish({
        dishName: '',
        dishPrice: '',
        dishDescription: '',
        dishQuantity: '',
        dishType: '',
      });
      setIsAdd(false);
    } catch (error) {
      console.error('Error adding dish', error);
    }
  };
      const toggleDescription = (dishId: string) => {
        setExpandedDescriptions(prevState => ({
          ...prevState,
          [dishId]: !prevState[dishId],
        }));
      };
      const onTextLayout = (dishId: string, event: any) => {
        const {lines} = event.nativeEvent;
        if (lines.length > 3) {
          setShowReadMore(prevState => ({
            ...prevState,
            [dishId]: true,
          }));
        }
      };
  const deleteDish = async (dishId: string) => {
    const sellerId = await AsyncStorage.getItem('userId');
    try {
      await axios.delete(
        `http://192.168.1.10:8080/sellers/${sellerId}/dishes/${dishId}`,
      );
      setDishes(dishes.filter(dish => dish._id !== dishId));
    } catch (error) {
      console.error('Error deleting dish', error);
    }
  };

  const updateDishes = async(dishId: string) =>{
    console.log(dishId);
    try{
      if (
          !newDish.dishName ||
          !newDish.dishPrice ||
          !newDish.dishDescription ||
          !newDish.dishType ||
          !newDish.dishQuantity
        ) {
          Alert.alert('Please fill all the fields');
          return;
        }
        console.log(dishId);
        axios.put(
          `http://192.168.1.10:8080/sellers/${dishId}/dishes`,newDish
        ).then(res => console.log(res.data));
      setNewDish({
        dishName: '',
        dishPrice: '',
        dishDescription: '',
        dishQuantity: '',
        dishType: '',
      });
      setIsSelected(false);
      fetchDishes();
    }catch(error){
      console.log(error);
    }

  }
  const renderDishes = ({item}) => {
    const isExpanded = expandedDescriptions[item._id];
    const shouldShowReadMore = showReadMore[item._id];
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.dishName}</Text>
          <View style={styles.itemNameContainer}>
            <View style={styles.itemRatingContainer}>
              <Text style={styles.itemPrice}>₹{item.dishPrice}</Text>
              <Text
                style={styles.itemDescription}
                numberOfLines={isExpanded ? undefined : 2}
                onTextLayout={event => onTextLayout(item._id, event)}>
                {item.dishDescription}
              </Text>
              {shouldShowReadMore && (
                <TouchableOpacity onPress={() => toggleDescription(item._id)}>
                  <Text style={styles.readMoreText}>
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.sideContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setIsDelete(true);
                }}>
                <Text style={styles.addButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const handleEdit = (dish) =>{
    setIsSelected(true);
    setNewDish({
      dishName: dish.dishName,
      dishPrice: dish.dishPrice.toString(),
      dishDescription: dish.dishDescription,
      dishQuantity: dish.dishQuantity.toString(),
      dishType: dish.dishType,
    });
    setCuurentDishId(dish._id);

  };
useEffect(() => {
  const fetchLoader = async () => {
    try {
      await fetchDishes();
    } finally {
      setLoading(false);
    }
  };
  fetchLoader();
}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hey, Welcome Back</Text>
      <View style={styles.flatContainer}>
        <View style={styles.addDishContainer}>
          <Text style={styles.addMoreText}>Add More Dishes : </Text>
          <TouchableOpacity
            onPress={() => setIsAdd(true)}
            style={styles.addDishButton}>
            <Text style={styles.addDishText}>Add Dish</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subheading}> AVAILABLE DISHES </Text>
        <View style={styles.footerContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          ) : (
            <FlatList
              data={dishes}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
              renderItem={renderDishes}
            />
          )}
        </View>
      </View>
      <Modal visible={isAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Dish</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Dish Name"
                value={newDish.dishName}
                onChangeText={value =>
                  setNewDish({...newDish, dishName: value})
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Dish Price"
                value={newDish.dishPrice}
                onChangeText={value =>
                  setNewDish({...newDish, dishPrice: value})
                }
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Dish Description"
                value={newDish.dishDescription}
                onChangeText={value =>
                  setNewDish({...newDish, dishDescription: value})
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Dish Type"
                value={newDish.dishType}
                onChangeText={value =>
                  setNewDish({...newDish, dishType: value})
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Dish Quantity"
                value={newDish.dishQuantity}
                onChangeText={value =>
                  setNewDish({...newDish, dishQuantity: value})
                }
                style={styles.input}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Add Dish"
                onPress={() => {
                  setIsAdd(true);
                  addDish();
                }}
              />
              <TouchableOpacity
                onPress={() => setIsAdd(false)}
                style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={isSelected} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Dish</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Dish Name"
                value={newDish.dishName}
                onChangeText={value =>
                  setNewDish({...newDish, dishName: value})
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Dish Price"
                value={newDish.dishPrice}
                onChangeText={value =>
                  setNewDish({...newDish, dishPrice: value})
                }
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Dish Description"
                value={newDish.dishDescription}
                onChangeText={value =>
                  setNewDish({...newDish, dishDescription: value})
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Dish Type"
                value={newDish.dishType}
                onChangeText={value =>
                  setNewDish({...newDish, dishType: value})
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Dish Quantity"
                value={newDish.dishQuantity}
                onChangeText={value =>
                  setNewDish({...newDish, dishQuantity: value})
                }
                style={styles.input}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Update Dish"
                onPress={() => {
                  setIsSelected(true);
                  updateDishes(currentDishId);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsSelected(false);
                  setNewDish({
                    dishName: '',
                    dishPrice: '',
                    dishDescription: '',
                    dishQuantity: '',
                    dishType: '',
                  });
                }}
                style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={isDelete} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View>
              <Text style={styles.deleteText}>Are you want to delete?</Text>
            </View>
            <View style={styles.DeleteContainer}>
              <TouchableOpacity>
                <Text>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsDelete(false)}>
                <Text>Cancel</Text>
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
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
    fontFamily: 'Arial',
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 24,
  },
  flatContainer: {
    marginBottom: 100,
  },
  heading: {
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    // marginBottom: 12,
    margin: 12,
  },
  dishItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  deleteButton: {
    color: 'red',
    marginTop: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemRating: {
    fontSize: 18,
    color: 'goldenrod',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262525',
    marginVertical: 4,
  },
  itemDescription: {
    fontSize: 18,
    marginBottom: 8,
    color: '#4f4a4a',
  },
  addButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemRatingContainer: {
    flex: 0.6,
  },
  itemContainer: {
    flexDirection: 'column',
    padding: 30,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 10,
    elevation: 4,
  },
  itemNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#121111',
    width: '70%',
  },

  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#ebd7d5',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  ratingContainer: {
    backgroundColor: 'green',
    marginVertical: '2%',
    paddingVertical: '2%',
    paddingHorizontal: '2%',
    borderRadius: 10,
  },
  headingText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  searchbar: {
    marginBottom: 16,
  },
  searchbarInput: {
    color: 'black',
  },
  searchIcon: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: 'blue',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: 'grey',
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 12,
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  sideContainer: {
    marginTop: -18,
  },
  subheading: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    color: 'black',
    backgroundColor: '#f5f0f0',
  },
  addDishButton: {
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingVertical: 10,
    width: 100,
    borderRadius: 8,
  },
  addDishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    justifyContent: 'space-between',
  },
  addDishText: {
    color: 'white',
    fontWeight: '700',
    fontFamily: 'Arial',
    fontSize: 18,
  },
  addMoreText: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Arial',
  },
  footerContainer: {
    paddingBottom: 220,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonContainer: {
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
  },
  DeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginVertical:20,
  },
  deleteText: {},
  loader:{
    alignItems:'center',
  },
});


export default SellerDashboard;
