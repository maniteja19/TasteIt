import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView, Alert} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = ()=>{
    navigation.navigate('WelcomePage');
  };
  // const handleBack = () => {
  //   navigation.goBack();
  // }
  const handleLogin = ()=>{
    //console.log(email,password);
     const userData = {email,password};
     setErrorMessage('');
     if(!email || !password){
      return Alert.alert('fill all fields');
     }
            axios
                .post('http://192.168.1.10:8080/login',userData)
                .then(res => {
                    if(res.data.status === 'Ok'){
                        Alert.alert('Welcome Back');
                        AsyncStorage.setItem('token',res.data.data);
                        AsyncStorage.setItem('isLogedIn',JSON.stringify(true));
                        AsyncStorage.setItem('role',res.data.data);
                        AsyncStorage.setItem('userId',res.data.userId);
                        setEmail('');
                        setPassword('');
                        if(res.data.role === 'seller' && res.data.Status === 'approved'){
                          navigation.navigate('Seller');
                        }
                        else if(res.data.role === 'seller' && res.data.Status === 'pending'){
                          Alert.alert('You are not allowed. Admin approval required.');
                          navigation.navigate('Login');
                        }
                        else if(res.data.role === 'seller' && res.data.Status === 'rejected'){
                          Alert.alert('Sorry, your request have been rejected.');
                          navigation.navigate('Login');
                        }
                        else if(res.data.role === 'customer'){
                          navigation.navigate('Home');
                        }
                        else if(res.data.role === 'admin'){
                          navigation.navigate('Admin');
                        }
                    }else{
                      setErrorMessage(res.data.message || 'Login Failed');
                    }
                })
                .catch(err =>{
                  //console.error('Login error:', err.response?.data || err.message);
                  setErrorMessage(err.response?.data?.message || 'Server error. Please try again later.');
                });
  };
  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps={'always'}>
        <View style = {styles.container}>
          {/* <TouchableOpacity
              style = {styles.exitButton}
              onPress={handleBack}>
            <Ionicons
              name = "arrow-back-outline"
              size ={30}
              color = {'black'}
            />
          </TouchableOpacity> */}
          <View style = {styles.titleContainer}>
            <Text style = {styles.headingText}>Login Here</Text>
          </View>
          <View style= {styles.textContainer}>
            <Text style = {styles.heading}>Welcome back you're</Text>
            <Text style = {styles.heading}>been missed.</Text>
          </View>
          <View>
            <Image
              source={
                require('../../assets/Tasteitlogo3.png')
              }
              style={styles.image}
            />
          </View>
          <View style={styles.loginContainer}>
              <View style={[styles.inputContainer,styles.inputElevation]}>
                  <FontAwesome
                      name="user-o"
                      color={'#428475'}
                      style ={styles.Icon}
                      />
                  <TextInput
                      placeholder="Enter email address"
                      style={styles.textInput}
                      onChange={e => setEmail(e.nativeEvent.text)}
                      value={email}
                    />
              </View>
              <View style={[styles.inputContainer,styles.inputElevation]}>
                  <FontAwesome
                      name="lock"
                      color={'#428475'}
                      style ={styles.Icon}
                      />
                  <TextInput
                      placeholder="Enter password"
                      style={styles.textInput}
                      secureTextEntry={secureEntry}
                      onChange={e => setPassword(e.nativeEvent.text)}
                      value={password}
                  />
                  <TouchableOpacity onPress = { ()=>{
                    setSecureEntry((prev)=>(!prev));
                  }}>
                    {secureEntry ? (<Feather
                      name ="eye"
                      size={20}
                      color={'grey'}
                      style={styles.featherIcon}
                    />) : (
                      <Feather
                      name ="eye-off"
                      size={20}
                      color={'grey'}
                      style={styles.featherIcon}
                    />
                    )}
                  </TouchableOpacity>
              </View>
              {
                errorMessage ? (
                  <Text style ={styles.errorMessage}>{errorMessage}</Text>
                ) : null
              }
              <View>
                <TouchableOpacity>
                  <Text style={styles.forgetText}>Forget password?</Text>
                </TouchableOpacity>
              </View>
          </View>
          <View>
                  <TouchableOpacity style={[styles.button,styles.buttonElevation]} onPress={() => handleLogin()} >
                      <View>
                          <Text style={styles.buttonText}>Login</Text>
                      </View>
                  </TouchableOpacity>
          </View>
          <View style={styles.bottomText}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity  onPress={handleSignup} >
               <Text style={styles.signupText}>  Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    padding:20,
    backgroundColor:'white',
  },
  titleContainer:{
    justifyContent:'center',
    alignItems:'center',
    marginVertical:20,
  },
  headingText:{
    color:'#8c61c2',
    fontSize:32,
    fontWeight:'bold',
  },
  exitButton:{
    backgroundColor:'grey',
    opacity:0.3,
    width:50,
    height:50,
    borderRadius:25,
    justifyContent:'center',
    alignItems:'center',

  },
  textContainer:{
    justifyContent:'center',
    alignItems:'center',
  },
  heading:{
    fontSize:20,
    color:'black',
    textAlign:'center',
  },
  inputContainer:{
    flexDirection:'row',
    borderWidth:0,
    alignItems:'center',
    backgroundColor: '#f5f5f5',
    borderRadius:50,
    marginBottom:20,
    marginHorizontal:8,
  },
  errorMessage:{
    color:'red',
    fontSize:17,
    textAlign:'center',
  },
  Icon:{
    fontSize:22,
    padding:10,
  },
  loginContainer:{
    marginVertical:40,
  },
  forgetText:{
    color:'black',
    fontSize:15,
    textAlign:'right',
    marginRight:10,
  },
  button:{
    backgroundColor:'#8c61c2',
    height:40,
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center',
    marginTop:-15,
    marginHorizontal:8,
  },
  buttonText:{
    fontSize:24,
    color:'white',
  },
  inputElevation:{
    backgroundColor:'white',
    elevation: 5,
    shadowOffset: {
        width: 2,
        height:4,
    },
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonElevation:{
    backgroundColor:'#8c61c2',
    elevation: 5,
    shadowOffset: {
        width: 2,
        height:4,
    },
    shadowColor: '#8c61c2',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image:{
    height:250,
    width:350,
    marginTop:15,
    marginBottom:-12,
  },
  bottomText:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:12,
  },
  signupText:{
    color:'blue',
    fontSize:15,
  },
  footerText:{
    color:'black',
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
    marginRight:20,
  },
  featherIcon:{
    paddingRight:13,
  },
});
