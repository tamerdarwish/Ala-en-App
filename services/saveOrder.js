import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // تأكد من مسار ملف إعدادات Firebase
import { generateOrderPDF } from './pdfService'; // تأكد من مسار ملف الخدمة

export const saveOrder = async (order, shouldSave) => {
  if (!shouldSave) return; // لا تحفظ إذا لم تتم المشاركة

  try {
    // حفظ بيانات الطلبية في Firestore
    const ordersRef = collection(db, 'orders');
    await addDoc(ordersRef, {
      ...order,
    });
  } catch (error) {
    throw new Error('Error saving order: ' + error.message);
  }
};
