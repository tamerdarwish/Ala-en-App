// services/dbFunctions.js

import { collection, addDoc,getDocs,getDoc,doc,setDoc } from 'firebase/firestore';
import { db,auth } from './firebaseConfig';
import { generateOrderPDF } from './pdfService';


export const getOrderNumber = async () => {
  try {
    const orderNumberDocRef = doc(db, 'orderNumbers', 'currentNumber');
    const orderNumberDoc = await getDoc(orderNumberDocRef);
    console.log('orderNumberDoc:', orderNumberDoc.data().currentOrderNumber);

    if (orderNumberDoc.exists()) {
      return orderNumberDoc.data().currentOrderNumber;
    } else {
      console.log('No such document!');
      return 0; // إذا لم يكن هناك مستند بعد
    }
  } catch (error) {
    console.error('Error fetching order number:', error);
    return 0;
  }
};

export const updateOrderNumber = async (newOrderNumber) => {
  console.log('new Numver:'+ newOrderNumber);
  
  try {
    const orderNumberDocRef = doc(db, 'orderNumbers', 'currentNumber');
    await setDoc(orderNumberDocRef, {
      currentOrderNumber: newOrderNumber,
    });
    console.log('Order number updated successfully');
  } catch (error) {
    console.error('Error updating order number:', error);
  }
};

export const saveOrder = async (order) => {
  await firestore.collection('orders').add(order);
};



export const fetchProducts = async () => {
  try {
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productList;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchUserName = async () => {
  const user = auth.currentUser;
  if (user) {
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      return docSnap.data().fullName
    } else {
      console.log('No such document!');
    }
  }
};

export const fetchStores = async () => {
  try {
    const storesCollection = collection(db, 'stores');
    const storesSnapshot = await getDocs(storesCollection);
    const storesList = storesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return storesList;
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
};

/*export const saveOrder = async (order) => {
  try {
    // إنشاء PDF وحفظه
    await generateOrderPDF(order);

    // حفظ بيانات الطلبية في Firestore
    const ordersRef = collection(db, 'orders');
    await addDoc(ordersRef, {
      ...order,
    });
  } catch (error) {
    throw new Error('Error saving order: ' + error.message);
  }
};*/

export const addStore = async (store) => {
  try {
    const storesRef = collection(db, 'stores');
    await addDoc(storesRef, {
      ...store,
    });
  } catch (error) {
    throw new Error('Error adding store: ' + error.message);
  }
};