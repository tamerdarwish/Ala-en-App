import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';

const ProductCard = ({ barcode, img, name, onPriceQuantityChange, quantity, price }) => {
  const [localQuantity, setLocalQuantity] = useState(quantity.toString());
  const [localPrice, setLocalPrice] = useState(price.toString());

  const handleQuantityChange = (text) => {
    setLocalQuantity(text);
    const parsedQuantity = parseFloat(text) || 0; // إذا كانت القيمة فارغة، يتم ضبطها على صفر
    onPriceQuantityChange(barcode, parsedQuantity, parseFloat(localPrice) || 0, name);
  };

  const handlePriceChange = (text) => {
    setLocalPrice(text);
    const parsedPrice = parseFloat(text) || 0; // إذا كانت القيمة فارغة، يتم ضبطها على صفر
    onPriceQuantityChange(barcode, parseFloat(localQuantity) || 0, parsedPrice, name);
  };

  const totalPrice = (parseFloat(localQuantity) || 0) * (parseFloat(localPrice) || 0);

  return (
    <View style={styles.container}>
      <Image source={{ uri: img }} style={styles.img} />
      <View style={styles.textContainer}>
        <Text style={styles.barcode}>{barcode}</Text>
        <Text style={styles.name}>{name}</Text>
        <TextInput
          placeholder='כמות'
          style={styles.input}
          keyboardType='decimal-pad'
          value={localQuantity}
          onChangeText={handleQuantityChange}
        />
        <TextInput
          placeholder='מחיר (יח)'
          style={styles.input}
          keyboardType='decimal-pad'
          value={localPrice}
          onChangeText={handlePriceChange}
        />
        <Text style={styles.price}>מחיר: ₪{totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
};

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
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
  },
  textContainer: {
    flex: 1,
  },
  barcode: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
    textAlign: 'right',
  },
  name: {
    fontSize: 20,
    fontFamily: 'HeeboBold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: 'right',
    fontFamily: 'HeeboRegular',
  },
  price: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'right',
    fontFamily: 'HeeboRegular',
  },
});

export default ProductCard;
