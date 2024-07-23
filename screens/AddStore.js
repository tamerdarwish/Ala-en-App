// screens/AddStore.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { addStore } from '../services/dbFunctions'; // قم بإنشاء هذه الوظيفة في ملف dbFunctions.js
import SafeAreaWrapper from '../components/SafeAreaWrapper'; // تعديل الاستيراد


const AddStore = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [visitTime, setVisitTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setVisitTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddStore = async () => {
    const store = {
      name,
      address,
      visitTime: visitTime.toString()
    };

    try {
      await addStore(store);
      alert('تم إضافة المحل بنجاح!');
      setName('');
      setAddress('');
      setVisitTime(new Date());
    } catch (error) {
      console.log('Error adding store: ' + error.message);
      alert('Error adding store: ' + error.message);
    }
  };

  return (
    <SafeAreaWrapper barStyle="dark-content" >

    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.header}>הוספת חנות</Text>
        <TextInput
          style={styles.input}
          placeholder="שם העסק"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="כתובת העסק"
          value={address}
          onChangeText={setAddress}
        />
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{visitTime.toDateString()}</Text>
          <Text style={styles.timeText}>{visitTime.toLocaleTimeString()}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddStore}>
          <Text style={styles.buttonText}>הוספת ביקור חנות</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  keyboardAvoidingView: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Heebo',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontFamily: 'Heebo',
  },
  dateTimeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'Heebo-Bold',
    color: '#333',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 18,
    fontFamily: 'Heebo-Bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#100ea0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Heebo',
  },
});

export default AddStore;