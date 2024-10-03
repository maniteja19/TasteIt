import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, ScrollView} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

export default function SellerSignup(){
    const [name, setName] = useState('');
    const [verifyName, setVerifyName] = useState(false);
    const [email, setEmail] = useState('');
    const [verifyEmail,setVerifyEmail] = useState(false);
    const [phone, setPhone] = useState('');
    const [verifyPhone,setverifyPhone] = useState(false);
    const [password, setPassword] = useState('');
    const [verifyPassword,setverifyPassword] = useState(false);
    const [secureEntry, setSecureEntry] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verfiyConfirmPassword, setverifyConfirmPassword] = useState(false);
    const [restaurantName , setRestaurantName] = useState('');
    const [role, setRole] = useState('customer');

    const navigation = useNavigation();
    const handleLogin = ()=>{
        navigation.navigate('Login');
    };
    const handleBack = () => {
        navigation.goBack();
    };
    function handleSubmit(){
        const userData = {
            name,
            restaurantName,
            email,
            phoneNumber: phone,
            password,
            role,
        };
        if(!name || !email || !phone || !password || !restaurantName){
            Alert.alert('please fill all the fileds.');
            return;
        }
        if(!verifyName || !verifyEmail || !verifyPassword || !verifyPhone || !verfiyConfirmPassword){
            Alert.alert('Please ensure all the fields are valid');
            return;
        }
        if(password !== confirmPassword){
          Alert.alert('confirm password doesnot match');
          return;
        }
        axios
            .post('http://192.168.1.10:8080/register-seller',userData)
            .then(res => {
                console.log(res.data);
                if(res.data.status === 'ok'){
                    Alert.alert('Registered successfully');
                    setName('');
                    setEmail('');
                    setPassword('');
                    setPhone('');
                    setConfirmPassword('');
                    setRestaurantName('');
                    setRole('seller');
                    setVerifyEmail(false);
                    setVerifyName(false);
                    setverifyPassword(false);
                    setverifyPhone(false);
                    setverifyConfirmPassword(false);
                    navigation.navigate('Login');
                }
                else{
                    Alert.alert(JSON.stringify(res.data));
                }
            })
            .catch(e => console.log(e));
    }
    function handleName(e){
        const nameVar = e.nativeEvent.text;
        setName(nameVar);
        setVerifyName(false);

        if(nameVar.length > 1){
            setVerifyName(true);
        }
    }
    function handleRestaturantName(e){
        const Restaurant = e.nativeEvent.text;
        setRestaurantName(Restaurant);
    }
    function handleEmail(e){
        const emailVar = e.nativeEvent.text;
        setEmail(emailVar);
        setVerifyEmail(false);
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailVar)){
            setVerifyEmail(true);
            setEmail(emailVar);
        }
    }
    function handlePhone(e){
        const phoneVar = e.nativeEvent.text;
        setPhone(phoneVar);
        setverifyPhone(false);

        if(/[6-9]{1}[0-9]{9}/.test(phoneVar)){
            setPhone(phoneVar);
            setverifyPhone(true);
        }
    }
    function handlePassword(e){
        const passwordVar = e.nativeEvent.text;
        setPassword(passwordVar);
        setverifyPassword(false);
        if(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(passwordVar)){
            setPassword(passwordVar);
            setverifyPassword(true);
        }
    }function handleConfirmPassword(e){
        const confirmPasswordVar = e.nativeEvent.text;
        setConfirmPassword(confirmPasswordVar);
        setverifyConfirmPassword(false);
        if(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(confirmPasswordVar)){
            setConfirmPassword(confirmPasswordVar);
            setverifyConfirmPassword(true);
        }
    }
  return (
    <SafeAreaView>
      <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator = {false}
      >
        <View style = {styles.container}>
          <TouchableOpacity
              style = {styles.exitButton}
              onPress={handleBack}>
            <Ionicons
              name = "arrow-back-outline"
              size ={30}
              color = {'black'}
            />
          </TouchableOpacity>
          <View style = {styles.titleContainer}>
            <Text style = {styles.headingText}>Create account</Text>
          </View>
          <View style= {styles.textContainer}>
            <Text style = {styles.heading}>Start your foodie journey with us</Text>
            <Text style = {styles.subheading}>—sign up now!</Text>
          </View>
          <View style={styles.loginContainer}>
              <View style={[styles.inputContainer,styles.inputElevation]}>
                  <FontAwesome
                      name="user-o"
                      color={'#428475'}
                      style ={styles.Icon}
                      />
                  <TextInput
                      placeholder="Enter name"
                      style={styles.textInput}
                      onChange={e=>handleName(e)}
                      value={name}
                    />
              </View>
              <View style={[styles.inputContainer,styles.inputElevation]}>
                      <MaterialIcons
                      name="restaurant"
                      color={'#428475'}
                      style ={styles.Icon}
                      />
                  <TextInput
                      placeholder="Enter restaurant name"
                      style={styles.textInput}
                      onChange={e => handleRestaturantName(e)}
                      value={restaurantName}/>
              </View>
              <View style={[styles.inputContainer,styles.inputElevation]}>
                  <Feather
                      name="mail"
                      color={'#428475'}
                      style ={styles.Icon}
                    />
                  <TextInput
                      placeholder="Enter restaurant email"
                      style={styles.textInput}
                      onChange={e => handleEmail(e)}
                      value={email}/>
              </View>
              <View style={[styles.inputContainer,styles.inputElevation]}>
                  <FontAwesome
                      name="phone"
                      color={'#428475'}
                      style ={styles.Icon}
                      />
                  <TextInput
                      placeholder="Enter restaurant mobile number"
                      style={styles.textInput}
                      onChange={e => handlePhone(e)}
                      value={phone}/>
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
                      onChange={e => handlePassword(e)}
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
              <View style={[styles.inputContainer,styles.inputElevation]}>
                  <FontAwesome
                      name="lock"
                      color={'#428475'}
                      style ={styles.Icon}
                      />
                  <TextInput
                      placeholder="Confirm password"
                      style={styles.textInput}
                      secureTextEntry={secureEntry}
                      onChange={(e)=> handleConfirmPassword(e)}
                      value={confirmPassword}
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
          </View>

          <View>
                  <TouchableOpacity style={[styles.button,styles.buttonElevation]} onPress={() => handleSubmit()}>
                      <View>
                          <Text style={styles.buttonText}>Signup</Text>
                      </View>
                  </TouchableOpacity>
          </View>
          <View style={styles.bottomText}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity  onPress={handleLogin} >
               <Text style={styles.signupText}>  Login</Text>
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
  picker:{
    flex:1,
    height:40,
    marginLeft:10,
    color:'black',
    fontWeight:'bold',
  },
  titleContainer:{
    justifyContent:'center',
    alignItems:'center',
    marginBottom:15,
    marginTop:10,
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
    // justifyContent:'center',
    // alignItems:'center',
  },
  heading:{
    fontSize:20,
    color:'black',
    textAlign:'center',
    fontWeight:'500',
  },
  subheading:{
    color:'black',
    fontSize:16,
    fontWeight:'500',
    textAlign:'right',
    marginRight:30,
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
  Icon:{
    fontSize:22,
    padding:10,
  },
  loginContainer:{
    marginVertical:40,
  },
  forgetText:{
    color:'red',
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
