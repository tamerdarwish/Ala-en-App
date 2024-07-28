import { Share, Platform } from 'react-native';
import { generateOrderPDF } from './pdfService'; // تأكد من مسار ملف الخدمة

export const shareOrder = async (order) => {
  console.log('shareOrder called'); // تتبع استدعاء الدالة
  try {
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
