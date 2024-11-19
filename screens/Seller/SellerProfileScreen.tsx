import { StyleSheet, View, Text, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function SellerProfileScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    function handleLogout() {
      navigation.navigate('Login');
      AsyncStorage.setItem('isLoggedIn', '');
      AsyncStorage.setItem('role', '');
      AsyncStorage.setItem('token', '');
    }
    const selectImage = () => {
      ImagePicker.openPicker({
        width: 380,
        height: 300,
        cropping: true,
        includeBase64: true,
        freeStyleCropEnabled: true,
      }).then(image => {
        const data = `data:${image.mime};base64,${image.data}`;
        setPhoto(data);
      });
    };
  const restaurantprofileDetails = async () => {
     const token = await AsyncStorage.getItem('token');
     if (token) {
       try {
         const response = await axios.get(
           'http://192.168.1.10:8080/sellerDetails',
           {
             headers: {
               Authorization: `Bearer ${token}`,
             },
           },
         );
         setEmail(response.data.email);
         setName(response.data.restaurantName);
         setPhone(response.data.phoneNumber);
         setAddress(response.data.address);
         setPhoto(response.data.photo);
       } catch (error) {
         console.error('Error fetching user details:', error);
       }
     } else {
       console.log('No token found');
     }
  };
  const updateProfile = async() =>{
    const userData = {
      photo,
      phone,
      address,
      email,
    };
    const response = await axios.post(
      'http://192.168.1.10:8080/updateSellerDetails',
      userData,
    );
    console.log(response.data);
  };
  useEffect(()=>
  {
    restaurantprofileDetails();
  },[]);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.profileContainer}>
          <View style={styles.profileSection}>
            <Image
              style={styles.avatar}
              source={{
                uri:
                  photo === '' || photo == null
                    ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                    : photo,
              }}
            />
            <TouchableOpacity style={styles.edit} onPress={selectImage}>
                <MaterialIcon
                  name="account-edit-outline"
                  size={25}
                  color={'white'}
                />
                <Text style ={{color:"white",fontSize:18,}}> Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={{margin: 10}}>
              <View style={styles.labelContainer}>
                <Text>Restaurant Name</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter Restaurant Name"
                  style={styles.textInput}
                  value={name}
                  editable={false}
                />
              </View>
            </View>
            <View style={{margin: 10}}>
              <View style={styles.labelContainer}>
                <Text>Email Address</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  editable={false}
                  placeholder="Enter email address"
                  value={email}
                  style={styles.textInput}
                />
              </View>
            </View>
            <View style={{margin: 10}}>
              <View style={styles.labelContainer}>
                <Text>Phone Number</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter Phone Number"
                  value={phone}
                  style={styles.textInput}
                  onChange={e => setPhone(e.nativeEvent.text)}
                />
              </View>
            </View>
            <View style={{margin: 10}}>
              <View style={styles.labelContainer}>
                <Text>Address</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter address"
                  onChange={e => setAddress(e.nativeEvent.text)}
                  value={address}
                />
              </View>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.Button} onPress={handleLogout}>
              <Text style={styles.text}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={updateProfile}>
              <Text style={styles.text}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    height: 300,
    width: 380,
    borderRadius: 20,
    position: 'relative',
  },
  labelContainer: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    marginStart: 10,
    zIndex: 1,
    elevation: 1,
    shadowColor: 'white',
    position: 'absolute',
    top: -10,
  },
  edit: {
    position: 'absolute',
    margin: 'auto',
    top: '90%',
    bottom: '0%',
    right: '3%',
    backgroundColor:'black',
    borderRadius:4,
    padding:5,
    flexDirection:'row',
    borderBottomRightRadius:10,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    zIndex: 0,
    width: '100%',
    borderColor: '#ccc',
    marginBottom: 10,
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 18,
    color: '#333',
  },
  profileContainer: {
    marginHorizontal: 5,
    paddingVertical: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    borderRadius: '50%',
  },
  Button: {
    backgroundColor: '#8c61c2',
    borderRadius: 30,
    width: 170,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
