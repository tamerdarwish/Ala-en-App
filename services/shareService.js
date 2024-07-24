import { Share } from 'react-native';
import { generateOrderPDF } from './pdfService'; // تأكد من مسار ملف الخدمة

export const shareOrder = async (order) => {
  try {
    // إنشاء PDF
    const pdfUri = await generateOrderPDF(order);

    // مشاركة الطلب
    const result = await Share.share({
      url: pdfUri,
      message: 'Here is your order details.',
    });

    if (result.action === Share.sharedAction) {
      return true; // تمت المشاركة بنجاح
    } else if (result.action === Share.dismissedAction) {
      return false; // لم تتم المشاركة
    }
  } catch (error) {
    console.error('Error sharing order: ' + error.message);
    return false; // خطأ في المشاركة
  }
};
