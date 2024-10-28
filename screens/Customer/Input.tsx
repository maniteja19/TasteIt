import {View, Text, TextInput, StyleSheet} from 'react-native';
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';

const Input = () => {
  return (
    <SafeAreaView>
      <View style={{margin:100}}>
        <View style={styles.labelContainer}>
          <Text>Email Address</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput placeholder="Enter email address" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    backgroundColor: 'white', // Same color as background
    alignSelf: 'flex-start', // Have View be same width as Text inside
    paddingHorizontal: 3, // Amount of spacing between border and first/last letter
    marginStart: 10, // How far right do you want the label to start
    zIndex: 1, // Label must overlap border
    elevation: 1, // Needed for android
    shadowColor: 'white', // Same as background color because elevation: 1 creates a shadow that we don't want
    position: 'absolute', // Needed to be able to precisely overlap label with border
    top: -12, // Vertical position of label. Eyeball it to see where label intersects border.
  },
  inputContainer: {
    borderWidth: 1, // Create border
    borderRadius: 8, // Not needed. Just make it look nicer.
    padding: 8, // Also used to make it look nicer
    zIndex: 0, // Ensure border has z-index of 0
  },
});

export default Input;
