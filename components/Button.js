import React from 'react'
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'


const width = Dimensions.get('window').width


const Button = ({ text, onPress, buttonColor,textColor }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.btnContainerStyle, {backgroundColor:buttonColor , margin:15}]}>
        <Text style={[styles.btnTextStyle, {color:textColor}]}> {text} </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btnContainerStyle: {
    paddingVertical: 8,
    width: width / 1.3,
    borderRadius: 20,
  },
  btnTextStyle: {
    fontSize: 16,
    textAlign: 'center',
  }
})

export default Button