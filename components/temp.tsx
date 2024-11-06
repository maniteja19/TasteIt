// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   ListRenderItem,
// } from 'react-native';

// type RecommendedItem = {
//   id: string;
//   name: string;
//   price: string;
//   description: string;
//   rating: string;
//   ratingsCount: string;
//   imageUrl: string;
// };

// const dummyData = {
//   restaurantName: 'Chickpet Donne Biryani House',
//   deliveryInfo: '36 mins • 5 km • Miyapur',
//   rating: '3.9',
//   ratingsCount: '15.5K ratings',
//   offers: '4 offers',
//   recommendedItems: [
//     {
//       id: '1',
//       name: 'Donne Kshatriya Kabab Biryani',
//       price: '₹309',
//       description:
//         'Cooked with Chitti Muthyalu Rice, Mint & Spices, Serve with properly cooked deep fried chicken.',
//       rating: '4.5',
//       ratingsCount: '959 ratings',
//       imageUrl: 'https://via.placeholder.com/150',
//     },
//     {
//       id: '2',
//       name: 'Donne Kshatriya Kabab Biryani',
//       price: '₹309',
//       description:
//         'Cooked with Chitti Muthyalu Rice, Mint & Spices, Serve with properly cooked deep fried chicken.',
//       rating: '4.5',
//       ratingsCount: '959 ratings',
//       imageUrl: 'https://via.placeholder.com/150',
//     },
//     {
//       id: '3',
//       name: 'Donne Kshatriya Kabab Biryani',
//       price: '₹309',
//       description:
//         'Cooked with Chitti Muthyalu Rice, Mint & Spices, Serve with properly cooked deep fried chicken.',
//       rating: '4.5',
//       ratingsCount: '959 ratings',
//       imageUrl: 'https://via.placeholder.com/150',
//     },
//     {
//       id: '4',
//       name: 'Donne Kshatriya Kabab Biryani',
//       price: '₹309',
//       description:
//         'Cooked with Chitti Muthyalu Rice, Mint & Spices, Serve with properly cooked deep fried chicken.',
//       rating: '4.5',
//       ratingsCount: '959 ratings',
//       imageUrl: 'https://via.placeholder.com/150',
//     },
//     {
//       id: '5',
//       name: 'Donne Kshatriya Kabab Biryani',
//       price: '₹309',
//       description:
//         'Cooked with Chitti Muthyalu Rice, Mint & Spices, Serve with properly cooked deep fried chicken.',
//       rating: '4.5',
//       ratingsCount: '959 ratings',
//       imageUrl: 'https://via.placeholder.com/150',
//     },
//     {
//       id: '6',
//       name: 'Donne Kshatriya Kabab Biryani',
//       price: '₹309',
//       description:
//         'Cooked with Chitti Muthyalu Rice, Mint & Spices, Serve with properly cooked deep fried chicken.',
//       rating: '4.5',
//       ratingsCount: '959 ratings',
//       imageUrl: 'https://via.placeholder.com/150',
//     },
//   ] as RecommendedItem[],
// };

// const App = () => {
//   const renderRecommendedItem: ListRenderItem<RecommendedItem> = ({item}) => (
//     <View style={styles.itemContainer}>
//       <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
//       <View style={styles.itemDetails}>
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemRating}>
//           ⭐ {item.rating} ({item.ratingsCount})
//         </Text>
//         <Text style={styles.itemPrice}>{item.price}</Text>
//         <Text style={styles.itemDescription} numberOfLines={2}>
//           {item.description}
//         </Text>
//         <TouchableOpacity style={styles.addButton}>
//           <Text style={styles.addButtonText}>ADD</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.restaurantName}>{dummyData.restaurantName}</Text>
//         <Text style={styles.deliveryInfo}>{dummyData.deliveryInfo}</Text>
//         <Text style={styles.rating}>
//           ⭐ {dummyData.rating} ({dummyData.ratingsCount})
//         </Text>
//         <Text style={styles.offers}>{dummyData.offers}</Text>
//       </View>

//       <View style={styles.filters}>
//         <TouchableOpacity style={styles.filterButton}>
//           <Text>Veg</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.filterButton}>
//           <Text>Egg</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.filterButton}>
//           <Text>Non-veg</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.sectionTitle}>Recommended for you</Text>
//       <FlatList
//         data={dummyData.recommendedItems}
//         renderItem={renderRecommendedItem}
//         keyExtractor={item => item.id}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 16, backgroundColor: '#fff'},
//   header: {marginBottom: 16},
//   restaurantName: {fontSize: 20, fontWeight: 'bold'},
//   deliveryInfo: {fontSize: 14, color: 'gray', marginVertical: 4},
//   rating: {fontSize: 14, color: 'green', fontWeight: 'bold'},
//   offers: {fontSize: 14, color: 'blue', marginTop: 4},

//   filters: {flexDirection: 'row', marginVertical: 8},
//   filterButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#eee',
//     marginRight: 8,
//   },

//   sectionTitle: {fontSize: 18, fontWeight: 'bold', marginVertical: 8},

//   itemContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: '#f9f9f9',
//     marginBottom: 16,
//   },
//   itemImage: {width: 80, height: 80, borderRadius: 8, marginRight: 16},
//   itemDetails: {flex: 1},
//   itemName: {fontSize: 16, fontWeight: 'bold'},
//   itemRating: {fontSize: 14, color: 'goldenrod'},
//   itemPrice: {fontSize: 16, fontWeight: 'bold', marginVertical: 4},
//   itemDescription: {fontSize: 14, color: 'gray', marginBottom: 8},
//   addButton: {
//     backgroundColor: '#FF6347',
//     paddingVertical: 4,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//   },
//   addButtonText: {color: '#fff', fontWeight: 'bold'},
// });

// export default App;

import React, {useState} from 'react';
import {Modal, View, Text, Button, StyleSheet} from 'react-native';


const MyComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Modal" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // For Android back button
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>This is a modal!</Text>
            <Button
              title="Close Modal"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
module.exports = MyComponent;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
