import { View, Text } from 'react-native';
import React from 'react';
import Home from '../screens/Home';
import Signup from '../screens/Signup';
import NewOrder from '../screens/NewOrder';
import AddStore  from '../screens/AddStore';
import Login from '../screens/Login';
import VisitedStores from '../screens/VisetedStores'
import firestore from '@react-native-firebase/firestore';





import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function index() {
  const [fontsLoaded] = useFonts({
    HeeboRegular: require('../assets/fonts/HeeboRegular.ttf'),
    HeeboBold: require('../assets/fonts/HeeboBold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // يمكنك عرض مؤشر تحميل هنا
  }
  return (

    

    <Stack.Navigator initialRouteName="Login">
     
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="NewOrder" component={NewOrder} options={{ headerShown: false}}/>
        <Stack.Screen name="AddStore" component={AddStore} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
        <Stack.Screen name="VisitedStores" component={VisitedStores} options={{ headerShown: false }}/>

    </Stack.Navigator>

  );
}