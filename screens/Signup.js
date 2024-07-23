import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, ScrollView, Keyboard, Alert, Dimensions } from 'react-native';
import Button from '../components/Button';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { addDoc, collection, doc, setDoc, getFirestore, updateDoc, arrayUnion } from 'firebase/firestore';


const { width, height } = Dimensions.get('window');



export default function Signup({ navigation }) {

    const signUpUser = async (email, password, fullName) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
      
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            fullName,
            userId:user.uid

          });
      
          return { success: true, user };
        } catch (error) {
          console.error("Error registering user: ", error);
          return { success: false, error: error.message };
        }
      };


  const handlePress = () => {
    Keyboard.dismiss();
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');



  const handleSignUp = async () => {

    const result = await signUpUser(email, password, fullName);

    if (result.success) {
      Alert.alert('User registered successfully!');
      navigation.navigate('Home');
    } else {
      Alert.alert('Error registering user:', result.error);
    }
  };

  const onPressContinueAsVisitor = () => {
    navigation.navigate('Home');
  };

  return (
    <View  style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled' automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.cover}>
          <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.innerContainer}>
              <Text style={styles.text}>هل انت عضو جديد؟</Text>
              <Text style={styles.text}>سجل معنا</Text>
              <Text style={styles.text}> أو</Text>
              
              <TextInput
                style={styles.input}
                placeholder='البريد الإلكتروني'
                placeholderTextColor="#4682B4"
                keyboardType='email-address'
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder='الاسم الكامل'
                placeholderTextColor="#4682B4"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                style={styles.input}
                placeholder=' كلمة المرور '
                placeholderTextColor="#4682B4"
                keyboardType='visible-password'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <Button text='تأكيد' onPress={handleSignUp} buttonColor='#4682B4' textColor='white' />
              <Button text='المتابعة كزائر' onPress={onPressContinueAsVisitor} buttonColor='#FFF3CF' textColor='black' />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
  cover: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#4682B4',
    fontSize: 25,
    fontFamily: 'Cairo-Regular',
    margin: 5,
  },
  input: {
    width: width / 1.3,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    color: '#4682B4',
    borderColor: '#4682B4',
    backgroundColor: 'transparent',
  },
});