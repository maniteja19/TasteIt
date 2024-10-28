import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const FeedBack = () => {
  return (
    <View>
      <View>
        <Text>Order Successful</Text>
      </View>
      <View>
        <FontAwesome
            name = "star-o"
            size= {30}
            color={'black'}
        />

      </View>
    </View>
  );
}

export default FeedBack;

const styles = StyleSheet.create({});
