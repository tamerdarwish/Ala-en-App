import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import ProductCard from '../components/ProductCard';
import { fetchProducts, saveOrder, getOrderNumber, updateOrderNumber } from '../services/dbFunctions';
import { generateAndShareOrderPDF } from '../services/pdfService'; // تأكد من مسار ملف الخدمة
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useNavigation } from '@react-navigation/native';

const NewOrder = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [storeBnNumber, setStoreBnNumber] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [productData, setProductData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    const getOrderNumberFromDB = async () => {
      
      const currentOrderNumber = await getOrderNumber();
      console.log('numm:', currentOrderNumber);

      setOrderNumber(currentOrderNumber + 1);
    };

    getProducts();
    getOrderNumberFromDB();
  }, []);

  const handlePriceQuantityChange = (barcode, quantity, price, name) => {
    const updatedProductData = {
      ...productData,
      [barcode]: {
        ...productData[barcode],
        quantity,
        price,
        name,
      },
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShareOrder = async () => {
    if (!storeName.trim() || !address.trim() || !storeBnNumber.trim() || !storePhone.trim()) {
      Alert.alert(
        'שם לב!',
        'תכניס את כל הפרטים של העסק',
        [{ text: 'OK' }]
      )}
      const order = {
        storeName,
        address,
        storeBnNumber,
        storePhone,
        products: productData,
        totalPrice,
        orderNumber,
      };
      try {
        await generateAndShareOrderPDF(order);
        await updateOrderNumber(order.orderNumber + 1 );
        navigation.goBack()

        Alert.alert('Success', 'Order shared successfully.');
      } catch (error) {
        console.error('Error sharing order:', error);
        Alert.alert('Error', 'Failed to share order.');
      }
  };

  /*const handleSaveOrder = async () => {
    if (!storeName.trim() || !address.trim() || !storeBnNumber.trim() || !storePhone.trim()) {
      Alert.alert(
        'שם לב!',
        'תכניס את כל הפרטים של העסק',
        [{ text: 'OK' }]
      );
      return;
    }

    const order = {
      storeName,
      address,
      storeBnNumber,
      storePhone,
      totalPrice,
      products: productData,
      date: new Date(),
      orderNumber,
    };

    try {
      // محاولة مشاركة الطلب
      const filePath = await generateAndShareOrderPDF(order);
      if (filePath) {
        Alert.alert('Success', 'PDF generated and shared successfully.');
        console.log(orderNumber);
        
        await updateOrderNumber(orderNumber);
      } else {
        Alert.alert('Error', 'Failed to generate or share PDF.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while generating or sharing the PDF.');
    }
  };*/

  const handleAddNewProduct = () => {
    if (newProductName && newProductPrice && newProductQuantity) {
      const newBarcode = `custom_${Date.now()}`;
      const newProduct = {
        id: newBarcode,
        name: newProductName,
        price: parseFloat(newProductPrice),
        quantity: parseInt(newProductQuantity),
      };

      handlePriceQuantityChange(newBarcode, newProduct.quantity, newProduct.price, newProduct.name);
      setProducts([...products, newProduct]);
      setModalVisible(false);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductQuantity('');
    } else {
      Alert.alert('הכנס את כל פרטי המוצר בבקשה');
    }
  };

  return (
    <SafeAreaWrapper barStyle="dark-content" backgroundColor="#f1f1f1">
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.searchContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>חזרה</Text>
            </TouchableOpacity>
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
              placeholder="שם הלקוח"
              value={storeName}
              onChangeText={setStoreName}
            />
            <TextInput
              style={styles.storeInput}
              placeholder="כתובת"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.storeInput}
              placeholder="מספר ח.פ"
              value={storeBnNumber}
              keyboardType="numeric"

              onChangeText={setStoreBnNumber}
            />
            <TextInput
              style={styles.storeInput}
              placeholder="מספר טלפון"
              keyboardType="numeric"
              value={storePhone}
              onChangeText={setStorePhone}
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
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>+ הוספת מוצר</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Text style={styles.totalPrice}>מחיר סופי: ₪{totalPrice.toFixed(2)}</Text>
            <TouchableOpacity style={styles.button} onPress={handleShareOrder}>
              <Text style={styles.buttonText}>שליחת ההזמנה</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* مودال لإضافة المنتج الجديد */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>הוסף מוצר חדש</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="שם המוצר"
                value={newProductName}
                onChangeText={setNewProductName}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="מחיר המוצר"
                keyboardType="numeric"
                value={newProductPrice}
                onChangeText={setNewProductPrice}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="כמות המוצר"
                keyboardType="numeric"
                value={newProductQuantity}
                onChangeText={setNewProductQuantity}
              />
              <TouchableOpacity style={styles.button} onPress={handleAddNewProduct}>
                <Text style={styles.buttonText}>הוסף</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>ביטול</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    flexDirection: 'row', // جعل المحتوى أفقيًا
    alignItems: 'center', // محاذاة العناصر رأسيًا في المنتصف
    justifyContent: 'space-between', // توزيع المساحة بين العناصر
    marginVertical: 15,
  },
  backButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#100ea0',
    marginRight: 10, 
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontFamily: 'HeeboRegular', // تحديث نوع الخط
    fontSize: 16,
    color: '#333',
  },
  scrollViewContent: {
    paddingTop: 100, // المسافة العلوية للمحتوى لتجنب التداخل مع شريط البحث
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    fontSize: 22,
    fontFamily: 'HeeboBold', // تحديث نوع الخط
    color: '#100ea0',
    marginBottom: 20,
    textAlign: 'center',
  },
  storeInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontFamily: 'HeeboRegular',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  addButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#100ea0',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: 'HeeboBold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#100ea0',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'HeeboBold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'HeeboBold',
    color: '#100ea0',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontFamily: 'HeeboRegular',
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default NewOrder;
