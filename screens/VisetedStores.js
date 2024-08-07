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
      try {
        const fetchedStores = await fetchStores();
        console.log('Fetched Stores:', fetchedStores);

        // الحصول على تاريخ اليوم
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const todayEnd = new Date(today.setHours(23, 59, 59, 999));
        
        // فلترة المحلات التي تمت زيارتها اليوم
        const filteredStores = fetchedStores.filter(store => {
          const visitDate = new Date(store.visitTime);
          return visitDate >= todayStart && visitDate <= todayEnd;
        });
        console.log('Filtered Stores:', filteredStores);

        // ترتيب المحلات من الأحدث إلى الأقدم
        const sortedStores = filteredStores.sort((a, b) => new Date(b.visitTime) - new Date(a.visitTime));
        console.log('Sorted Stores:', sortedStores);

        setStores(sortedStores);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
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
          {stores.length > 0 ? (
            stores.map((store, index) => (
              <StoreCard key={index} store={store} />
            ))
          ) : (
            <Text style={styles.noStoresText}>עוד אין חנויות שבוקרו היום</Text>
          )}
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
    elevation: 5,
    marginVertical: 20,
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
  noStoresText: {
    fontFamily:'HeeboBold',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default VisetedStores;
