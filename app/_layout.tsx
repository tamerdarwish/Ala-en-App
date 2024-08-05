import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Slot } from 'expo-router';
import { db } from '../firebase'; // تأكد من تعديل المسار
import { doc, onSnapshot } from 'firebase/firestore';

export default function Layout() {
  const [isAppActive, setIsAppActive] = useState(true);

  useEffect(() => {
    // إنشاء مرجع المستند في Firestore
    const docRef = doc(db, 'appConfig', 'I2KGnDUJ7IN55SY5n2JL');

    // تعيين مستمع للتغييرات في المستند
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      console.log('Doc snapshot:', docSnapshot.exists()); // طباعة إذا كان المستند موجود

      if (docSnapshot.exists()) {
        const appStatus = docSnapshot.data().isAppActive;
        setIsAppActive(appStatus); // تعيين حالة التطبيق بناءً على البيانات الجديدة
      } else {
        console.log('No such document!'); // طباعة إذا لم يكن هناك مستند
      }
    }, (error) => {
      console.error('Error checking app status:', error);
    });

    // تنظيف المستمع عند تفكيك المكون
    return () => unsubscribe();
  }, []);

  if (!isAppActive) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>האפליקציה לא עובדת כרגע.</Text>
      </View>
    ); // يمكنك هنا إضافة شاشة توقف أو رسالة مخصصة
  }

  return <Slot />;
}
