import { Share, Platform } from 'react-native';
import { generateOrderPDF } from './pdfService'; // تأكد من مسار ملف الخدمة
import { Alert } from 'react-native';


export const shareOrder = async (order) => {
  console.log('shareOrder called'); // تتبع استدعاء الدالة

  try {
    // Check if order.products is an empty object
    if (Object.keys(order.products).length === 0) {
      Alert.alert(
        'שם לב!', 
        'אי אפשר לשלוח הזמנה ריקה', 
        [{ text: 'OK' }] 
      );      return false; 
    }

    const pdfUri = await generateOrderPDF(order);
    console.log('PDF generated:', pdfUri); // تتبع بعد إنشاء ملف PDF

    if (!pdfUri) {
      throw new Error('PDF generation failed');
    }

    const shareOptions = Platform.select({
      ios: {
        url: pdfUri,
        message: 'הזמנה חדשה התקבלה.',
      },
      android: {
        url: pdfUri,
      },
    });

    const result = await Share.share(shareOptions);
    console.log('Share result:', result); // تتبع نتيجة المشاركة

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
