// Home.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const Home = ({ route }) => {
  const { userName } = route.params || {};
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const hours = currentTime.getHours();
    if (hours < 12) {
      setGreeting('בוקר טוב');
    } else if (hours < 18) {
      setGreeting('צהריים טובים');
    } else {
      setGreeting('ערב טוב');
    }
  }, [currentTime]);

  const handleNewOrderPress = () => {
    navigation.navigate('NewOrder');
  };

  const handleAddStorePress = () => {
    navigation.navigate('AddStore');
  };

  return (
    <SafeAreaWrapper barStyle="light-content" backgroundColor="#100ea0">
      <View style={styles.container}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.greeting}>{`${greeting}, ${userName}`}</Text>
        <Text style={styles.clock}>{currentTime.toLocaleTimeString()}</Text>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.card} onPress={handleNewOrderPress}>
            <Image source={require('../assets/new-order.png')} style={styles.icon} />
            <Text style={styles.cardText}>יצירת הזמנה חדשה</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={handleAddStorePress}>
            <Image source={require('../assets/add-store.png')} style={styles.icon} />
            <Text style={styles.cardText}>הוסף חנות שביקרת</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#100ea0',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'Heebo-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  clock: {
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'Heebo-Bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Heebo-Bold',
    textAlign: 'center',
  },
});

export default Home;
