import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import React, { useState } from 'react';

const ProductCard = ({ barcode, img, name, onPriceQuantityChange }) => {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleQuantityChange = (text) => {
    const parsedQuantity = parseFloat(text);
    setQuantity(text);
    onPriceQuantityChange(barcode, parsedQuantity, price);
  };

  const handlePriceChange = (text) => {
    const parsedPrice = parseFloat(text);
    setPrice(text);
    onPriceQuantityChange(barcode, quantity, parsedPrice);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: img }} style={styles.img} />
      <View style={styles.textContainer}>
        <Text style={styles.barcode}>{barcode}</Text>
        <Text style={styles.name}>{name}</Text>
        <TextInput
          placeholder='כמות'
          style={styles.input}
          keyboardType='numeric'
          value={quantity}
          onChangeText={handleQuantityChange}
        />
        <TextInput
          placeholder='מחיר (יח)'
          style={styles.input}
          keyboardType='numeric'
          value={price}
          onChangeText={handlePriceChange}
        />
        <Text style={styles.price}>מחיר: ₪{(quantity * price || 0).toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row-reverse', // Change direction to right-to-left
    alignItems: 'flex-start',
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10, // Adjust spacing for RTL
  },
  textContainer: {
    flex: 1,
  },
  barcode: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
    textAlign: 'right', // Align text to the right
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right', // Align text to the right
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: 'right', // Align text inside input to the right
  },
  price: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'right', // Align text to the right
  },
});

export default ProductCard;