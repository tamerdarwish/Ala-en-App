import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/dbFunctions';
import { saveOrder } from '../services/dbFunctions';
import { shareOrder } from '../services/shareService'; // تأكد من مسار ملف الخدمة
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const NewOrder = () => {
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [productData, setProductData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    getProducts();
  }, []);

const handlePriceQuantityChange = (barcode, quantity, price,name) => {
  const updatedProductData = {
    ...productData,
    [barcode]: {
      ...productData[barcode],
      quantity,
      price,
      name,
    }
  };
  setProductData(updatedProductData);

  const newTotalPrice = Object.values(updatedProductData).reduce((total, data) => {
    return total + (data.quantity * data.price || 0);
  }, 0);

  setTotalPrice(newTotalPrice);
};


  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveOrder = async () => {
    const order = {
      storeName,
      storeAddress,
      totalPrice,
      products: productData,
      date: new Date()
    };

    try {
      // محاولة مشاركة الطلب
      const isShared = await shareOrder(order);

      if (isShared) {
        // حفظ الطلبية فقط إذا تمت المشاركة بنجاح
        await saveOrder(order, isShared);
        alert('Order saved and shared successfully!');
      } else {
      }
    } catch (error) {
      console.log('Error saving order: ' + error.message);
      alert('Error saving order: ' + error.message);
    }
  };

  return (
    <SafeAreaWrapper barStyle="dark-content">
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="חיפוש מוצר"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.header}>הזמנה חדשה</Text>
            <TextInput
              style={styles.storeInput}
              placeholder="שם העסק"
              value={storeName}
              onChangeText={setStoreName}
            />
            <TextInput
              style={styles.storeInput}
              placeholder="כתובת העסק"
              value={storeAddress}
              onChangeText={setStoreAddress}
            />
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                barcode={product.id}
                img={product.img}
                onPriceQuantityChange={handlePriceQuantityChange}
                quantity={productData[product.id]?.quantity || ''}
                price={productData[product.id]?.price || ''}
                name={product.name}
              />
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Text style={styles.totalPrice}>מחיר סופי: ₪{totalPrice.toFixed(2)}</Text>
            <TouchableOpacity style={styles.button} onPress={handleSaveOrder}>
              <Text style={styles.buttonText}>שליחת ההזמנה</Text>
            </TouchableOpacity>
          </View>
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
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontFamily: 'Heebo',
  },
  scrollViewContent: {
    paddingBottom: 100,
    paddingTop: 80,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
    fontFamily: 'Heebo',
  },
  storeInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontFamily: 'Heebo',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    backgroundColor: '#100ea0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
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
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Heebo',
  },
});

export default NewOrder;
