import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const StoreCard = ({ store }) => {
  const formatVisitTime = (visitTime) => {
    if (typeof visitTime === 'string') {
      return new Date(visitTime).toLocaleString();
    } else if (typeof visitTime === 'object' && visitTime.seconds) {
      const date = new Date(visitTime.seconds * 1000);
      return date.toLocaleString();
    }
    return 'Unknown date';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{store.name}</Text>
      <Text style={styles.address}>{store.address}</Text>
      <Text style={styles.time}>ביקר ב: {formatVisitTime(store.visitTime)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#100ea0',
    direction: 'rtl',  // تحديد اتجاه النصوص من اليمين لليسار
  },
  title: {
    fontSize: 20,
    fontFamily: 'Heebo-Bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'left', // محاذاة النص إلى اليمين
  },
  address: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Heebo-Regular',
    marginBottom: 10,
    textAlign: 'left', // محاذاة النص إلى اليمين
  },
  time: {
    fontSize: 14,
    color: '#888',
    textAlign: 'left', // محاذاة النص إلى اليمين
    fontFamily: 'Heebo-Bold',

  },
});

export default StoreCard;
