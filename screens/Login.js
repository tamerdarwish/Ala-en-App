// Login.js
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableWithoutFeedback, ScrollView, Keyboard, Image } from 'react-native';
import React, { useState } from 'react';
import Button from '../components/Button';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase'; // تأكد من استيراد db

const { width, height } = Dimensions.get('window');

export default function Login() {
  const navigation = useNavigation();
  const handlePress = () => {
    Keyboard.dismiss();
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onPressConfirmation = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then( () => {
        navigation.navigate('Home'); // تمرير اسم المستخدم
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert('תוודא שהפרטים נכונים');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cover}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled' automaticallyAdjustKeyboardInsets={true}>
          <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.contentContainer}>
              <Text style={styles.text}> התחבר לחשבונך </Text>
              <TextInput
                style={styles.input}
                placeholder='דואר אלקטרוני'
                placeholderTextColor="black"
                keyboardType='email-address'
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder=' סיסמה'
                placeholderTextColor="black"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <Button text='כניסה' onPress={onPressConfirmation} buttonColor='#fff' textColor='#100ea0' />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#100ea0',
    paddingHorizontal: 20,
  },
  cover: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#100ea0',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'HeeboBold',
    margin: 5,
    textAlign: 'center',
  },
  input: {
    width: width / 1.3,
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    fontFamily: 'HeeboRegular',
    textAlign: 'center',
    color: 'black',
    borderColor: '#B0E0E6',
    backgroundColor: '#B0E0E6',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

