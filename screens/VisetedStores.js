import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import StoreCard from '../components/StoreCard';
import { fetchStores } from '../services/dbFunctions';
import { generateVisitedStoresPDF } from '../services/pdfService';
import SafeAreaWrapper from '../components/SafeAreaWrapper';


const VisetedStores = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const getStores = async () => {
      const fetchedStores = await fetchStores();
      setStores(fetchedStores);
    };

    getStores();
  }, []);

  const handleCreatePDF = () => {
    generateVisitedStoresPDF(stores);
  };

  return (
    <SafeAreaWrapper barStyle="dark-content" backgroundColor='#f1f1f1'> 

    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreatePDF}>
          <Text style={styles.buttonText}>צור דוח יומי</Text>
        </TouchableOpacity>
                <Text style={styles.header}>החנויות שבוקרו</Text>

      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {stores.map((store, index) => (
          <StoreCard key={index} store={store} />
        ))}
      </ScrollView>
    </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#100ea0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,  // Adding shadow for elevation
    marginVertical:20
  },
  header: {
    fontSize: 24,
    fontFamily: 'HeeboBold',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'HeeboBold',
    color: '#100ea0',
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default VisetedStores;
