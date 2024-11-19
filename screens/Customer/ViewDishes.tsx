import { Alert, FlatList, Modal, StyleSheet, Text,TouchableOpacity,View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Searchbar } from 'react-native-paper';
interface Dish {
  _id: string;
  dishName: string;
  dishPrice: string;
  dishDescription: string;
  dishQuantity: string;
  dishType: string;
  seller:string
}

export default function ViewDishes() {
  const navigation = useNavigation();
  const route = useRoute();

  const [showHeaderText, setShowHeaderText] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{[key: string]: boolean;}>({});
  const [showReadMore, setShowReadMore] = useState<{[key: string]: boolean}>({});
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [basket, setBasket] = useState(null);
  const [itemDetails, setItemDetails] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [isCartButton, setIsCartButton] = useState(false);

    const handleExit = () =>{
      setIsSearching(false);
      setSearchQuery('');
    };

    const handleBack = () => {
      navigation.goBack();
    };

    const fetchDishes = async () => {
      const sellerId = route.params?._id;
      try {
        const res = await axios.get<{dishes: Dish[]}>(
          `http://192.168.1.10:8080/sellers/${sellerId}/dishes`,
        );
        setDishes(res.data.dishes);
      } catch (error) {
        console.error('Error fetching dishes', error);
      }
    };
    useEffect(() => {
      fetchDishes();
      fetchCustomerFeedback();
    });
  const fetchCustomerFeedback = async () => {
    const userId = route.params?._id;
    try {
      const response = await axios(
        `http://192.168.1.10:8080/feedback/${userId}`,
      );
      setAverageRating(response.data.rating || 0);
    } catch (error) {
      console.error('Error fetching customer feedback:', error);
    }
  };
    const handleSearch = (query) =>{
      setSearchQuery(query);
      if(query.length > 0){
        const filtered = dishes.filter(
          dish => dish.dishName.toLowerCase().includes(query.toLowerCase())
        );
          setFilteredData(filtered);
       }
      else{
        setFilteredData(dishes);
      }

    };
    const addToBasket = async (
      dishId: string,
      sellerId: string,
      price:Number,
    ) => {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      try {
        const response = await axios
          .post(
            'http://192.168.1.10:8080/basket/add',
            {userId, dishId, sellerId, quantity: 1, price},
            {headers: {Authorization: `Bearer ${token}`}},
          );
        if(response.data.message === 'cannot be added'){
          setIsVisible(true);
          setItemDetails({dishId,sellerId,price});
        }else if(response.data.message === 'out of stock'){
          Alert.alert('Out of Stock');
        }
        else{
          Alert.alert('Added to Basket', 'Dish has been added to your basket.');
        }
      } catch (error) {
        console.error('error in adding dishes', error);
      }
    };
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
        } catch (error) {
          console.error(error);
        }
      };
      useEffect(()=>{
        fetchBasket();
      },[]);
        const removeItem = async (dishId: String) => {
          const userId = await AsyncStorage.getItem('userId');
          try {
            await axios.delete('http://192.168.1.10:8080/basket/remove', {
              data: {dishId, userId},
            });
          } catch (error) {
            console.error(error);
          }
        };
    const replaceItems = async() =>{
      if (basket) {
        const length = basket.items.length;
        for (let i = 0; i < length; i++) {
          const item = basket.items[i];
          await removeItem(item.dish._id);
        }
      }
      addToBasket(itemDetails.dishId,itemDetails.sellerId, itemDetails.price);
      setItemDetails({});
      setIsVisible(false);
    };
    const toggleDescription = (dishId: string) => {
      setExpandedDescriptions(prevState => ({
        ...prevState,
        [dishId]: !prevState[dishId],
      }));
    };
    const onTextLayout = (dishId: string, event: any) => {
      const { lines } = event.nativeEvent;
      if (lines.length > 3) {
        setShowReadMore(prevState => ({
          ...prevState,
          [dishId]: true,
        }));
      }
    };
        const handleScroll = event => {
          const scrollY = event.nativeEvent.contentOffset.y;
          setShowHeaderText(scrollY > 60);
        };
    const renderDishes = ({item}) => {
      const isExpanded = expandedDescriptions[item._id];
      const shouldShowReadMore = showReadMore[item._id];
      return (
        <View style={styles.itemContainer}>
          <View style={styles.itemDetails}>
            <View style={styles.itemNameContainer}>
              <Text style={styles.itemName}>{item.dishName}</Text>
            </View>
            <View style={styles.itemNameContainer}>
              <View style={styles.itemRatingContainer}>
                <Text style={styles.itemPrice}>₹{item.dishPrice}</Text>
                <Text
                  style={styles.itemDescription}
                  numberOfLines={isExpanded ? undefined : 3}
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
              {item.dishQuantity === 0 ? (
                <View>
                  <Text>Out of Stock</Text>
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      addToBasket(item._id, item.seller, item.dishPrice);
                    }}>
                    <Text style={styles.addButtonText}>ADD</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    };

  return (
    <View>
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleBack()}>
            <Ionicons name="chevron-back" size={30} color={'black'} />
          </TouchableOpacity>
          {showHeaderText && (
            <Text style={styles.headerTitle}>
              {route.params?.restaurantName}
            </Text>
          )}
          <Ionicons
            name="search"
            size={30}
            color={'black'}
            onPress={() => setIsSearching(true)}
            style={styles.searchIcon}
          />
        </View>
      )}
      {!isSearching && searchQuery === '' ? (
        <FlatList
          data={dishes}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={renderDishes}
          onScroll={handleScroll}
          ListHeaderComponent={
            <>
              <View style={styles.restaurantContainer}>
                <View>
                  <Text style={styles.restaurantName}>
                    {route.params?.restaurantName}
                  </Text>
                  <Text style={styles.Location}>
                    {route.params?.address} . Free delivery
                  </Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Text style={styles.itemRating}>⭐ {averageRating}</Text>
                </View>
                {/* <Text style={styles.offers}>{dummyData.offers}</Text> */}
              </View>
              <Text style={styles.headingText}>
                ----------Recommended for you----------
              </Text>
            </>
          }
        />
      ) : (
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={renderDishes}
        />
      )}
      <Modal visible={isVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                You have items from another restaurant in your basket. Would you
                like to clear your basket and add this new dish?
              </Text>
            </View>
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.buttonOne}
                onPress={() => setIsVisible(false)}>
                <Text style={styles.buttonText}>No, thanks!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonTwo}
                onPress={() => replaceItems()}>
                <Text style={styles.buttonText}>Replace</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  readMoreText: {
    color: 'blue',
    fontSize: 14,
  },
  header: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 10,
    color: '#262525',
  },
  restaurantContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: '5%',
    paddingVertical: '10%',
    elevation: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#262525',
  },
  Location: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 4,
  },
  rating: {
    fontSize: 20,
    color: 'green',
    fontWeight: 'bold',
  },

  filters: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemRating: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262525',
    marginVertical: 4,
  },
  itemDescription: {
    fontSize: 18,
    // color: 'gray',
    marginBottom: 8,
    color: '#4f4a4a',
  },
  addButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0dfdf',
    borderRadius: 10,
  },
  itemRatingContainer: {
    flex: 0.75,
  },
  itemContainer: {
    flexDirection: 'column',
    padding: 30,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    marginHorizontal: 10,
  },
  itemNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#121111',
    flex: 1,
  },

  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#ebd7d5',
    paddingVertical: 6,
    paddingHorizontal: 26,
    borderRadius: 8,
  },
  ratingContainer: {
    backgroundColor: 'lightgreen',
    marginVertical: 10,
    borderRadius: 10,
    flex: 0.35,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    height: '200',
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  buttonOne: {
    flex: 0.5,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 8,
  },
  buttonTwo: {
    flex: 0.5,
    backgroundColor: '#ebd7d5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerContainer: {},
  headerText: {
    fontSize: 20,
    fontFamily: 'Arial',
  },
});



