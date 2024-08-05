import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { generateOrderPDF } from './pdfService'; // تأكد من مسار ملف الخدمة

export const shareOrder = async (order) => {
  console.log('shareOrder called');

  try {
    if (Object.keys(order.products).length === 0) {
      Alert.alert(
        'اسمح لي!',
        'لا يمكن إرسال طلب فارغ',
        [{ text: 'OK' }]
      );
      return false;
    }

    const pdfUri = await generateOrderPDF(order);
    console.log('PDF generated:', pdfUri);

    if (!pdfUri) {
      throw new Error('PDF generation failed');
    }

    const fileInfo = await FileSystem.getInfoAsync(pdfUri);
    if (!fileInfo.exists) {
      throw new Error('PDF file does not exist at path: ' + pdfUri);
    }

    await Sharing.shareAsync(pdfUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Order',
    });

    // بعد محاولة المشاركة، لا يمكن التأكد من النجاح أو الإلغاء بشكل مباشر
    Alert.alert('مشاركة طلبك', 'تم فتح نافذة المشاركة. إذا كنت قد أكدت المشاركة، يجب أن تكون قد تمت بنجاح.');

    return true; // افترض نجاح العملية بعد فتح نافذة المشاركة
  } catch (error) {
    console.error('Error sharing order: ' + error.message);
    Alert.alert('خطأ', `حدث خطأ أثناء محاولة مشاركة الملف: ${error.message}`);
    return false;
  }
};
