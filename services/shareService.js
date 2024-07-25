import { Share, Platform } from 'react-native';
import { generateOrderPDF } from './pdfService'; // تأكد من مسار ملف الخدمة

export const shareOrder = async (order) => {
  try {
    const pdfUri = await generateOrderPDF(order);

    const result = await Share.share({
      url: pdfUri,
      message: 'Here is your order details.',
    });

    if (Platform.OS === 'ios') {
      if (result.action === Share.sharedAction) {
        return true; // تمت المشاركة بنجاح
      } else if (result.action === Share.dismissedAction) {
        return false; // لم تتم المشاركة
      }
    } else if (Platform.OS === 'android') {
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          return true;
        } else {
          return false;
        }
      }
    }
  } catch (error) {
    console.error('Error sharing order: ' + error.message);
    return false; // خطأ في المشاركة
  }
};
