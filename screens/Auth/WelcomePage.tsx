import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function WelcomePage() {
  const navigation = useNavigation();

  const handleCustomerSignup = () => {
    navigation.navigate('CustomerSignup');
  };

  const handleSellerSignup = () => {
    navigation.navigate('SellerSignup');
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.titleContainer}>
        <Text style={Styles.title}>TASTEIT</Text>
      </View>
      <View>
        <Image
          style={Styles.image}
          source={require('../../assets/logo.png')}
        />
      </View>
      <View style={Styles.titleContainer}>
        <Text style={Styles.text}>Join us and dive into a world of flavors!</Text>
      </View>
      <View style={Styles.mainContainer}>
        <View style={Styles.customerContainer}>
          <Text style={Styles.userText}>For Customers,</Text>
          <Text style={Styles.userDescription}>
            Register to explore, order, and review dishes from a variety of restaurants.
          </Text>
          <TouchableOpacity style={Styles.signupContainer} onPress={handleCustomerSignup}>
            <Text style={Styles.signupText}>Customer Signup</Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.sellerContainer}>
          <Text style={Styles.userText}>For Sellers,</Text>
          <Text style={Styles.userDescription}>
            Restaurant owners can apply for registration to manage their listings.
          </Text>
          <TouchableOpacity style={Styles.signupContainer} onPress={handleSellerSignup}>
            <Text style={Styles.signupText}>Seller Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
    borderRadius:100,
  },
  text: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '90%',
    marginVertical: 10,
  },
  loginContainer: {
    backgroundColor: '#8c61c2',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContainer: {
    width: '100%',
    alignItems: 'center',
  },
  customerContainer: {
    marginBottom: 20,
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  sellerContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  userText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  signupContainer: {
    backgroundColor: '#8c61c2',
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
    width: '100%',
  },
  signupText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  animation: {
    elevation:4,
    shadowOffset:{
        width:11,
        height:1,
    }
  },
});
