import { Alert, Platform } from 'react-native';
import { printToFileAsync } from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const generateAndShareOrderPDF = async (order) => {
  if (Object.keys(order.products).length === 0) {
    Alert.alert(
      'שם לב!', 
      'אי אפשר לשלוח הזמנה ריקה', 
      [{ text: 'OK' }] 
    );      return 
  }
  try {
    console.log('Generating PDF for order:', order);

    const htmlContent = `
      <html lang="he">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Heebo', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            direction: rtl;
          }
         .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #f9f9f9;
          }
         .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
          }
         .header.right-section {
            text-align: right;
          }
         .header.right-section p {
            margin: 2px 0;
            font-size: 16px;
          }
         .header.left-section {
            text-align: left;
            font-size: 14px;
          }
         .header.left-section p {
            margin: 2px 0;
          }
         .logo {
            max-width: 100px;
            border-radius: 50%;
            margin-bottom: 10px;
          }
         .order-info {
            margin-bottom: 30px;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 10px;
          }
         .order-info h2 {
            margin: 0 0 10px;
            font-size: 22px;
            color: #0056b3;
          }
         .order-info p {
            margin: 5px 0;
            font-size: 16px;
          }
         .product-list {
            margin-top: 20px;
          }
         .product-list h2 {
            margin: 0 0 10px;
            font-size: 22px;
            color: #0056b3;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 5px;
          }
         .product-list table {
            width: 100%;
            border-collapse: collapse;
          }
         .product-list th,.product-list td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
         .product-list th {
            background-color: #0056b3;
            color: white;
            font-size: 16px;
          }
         .product-list td {
            font-size: 14px;
          }
         .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 16px;
            color: #555;
          }
         .total {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="right-section">
              <p><strong>מספר הזמנה:</strong> ${order.orderNumber || 'לא זמין'}</p>
              <p><strong>שם החנות:</strong> ${order.storeName || 'לא זמין'}</p>
              <p><strong>כתובת החנות:</strong> ${order.address || 'לא זמין'}</p>
              <p><strong>ח.פ:</strong> ${order.storeBnNumber || 'לא זמין'}</p>
              <p><strong>מספר טלפון:</strong> ${order.storePhone || 'לא זמין'}</p>
            </div>
            <div class="left-section">
              <img src="https://firebasestorage.googleapis.com/v0/b/aleen-app-35474.appspot.com/o/300952581_591159899469881_5143205118010272337_n%20copy.jpg?alt=media&token=38438863-9c9a-4630-ad00-82c191290813" class="logo" />
              <p>מעיין הציפור בע"מ</p>
                       <p>חברה לייצור ושיווק משקאות</p>
          <p>עילוט - נצרת </p>
          <p>מיקוד : 16970</p>
          <p>טלפון: 04-6011689</p>
          <p>ח.פ: 513184754</p>
            </div>
          </div>
          <div class="product-list">
            <h2>רשימת מוצרים</h2>
            <table>
              <thead>
                <tr>
                  <th>ברקוד</th>
                  <th>שם המוצר</th>
                  <th>כמות</th>
                  <th>מחיר ליחידה</th>
                  <th>מחיר כללי</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(order.products).map(([barcode, product]) => `
                  <tr>
                    <td>${barcode}</td>
                    <td>${product.name || 'לא זמין'}</td>
                    <td>${parseInt(product.quantity, 10) || 0}</td>
                    <td>₪${parseFloat(product.price).toFixed(2) || 0}</td>
                    <td>₪${(parseFloat(product.quantity) * parseFloat(product.price)).toFixed(2) || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              סך הכל: ₪${order.totalPrice.toFixed(2) || '0.00'}
            </div>
          </div>
          <div class="footer">
            תודה על ההזמנה!
          </div>
        </div>
      </body>
    </html>
    `;

    // Generate PDF
    const { uri } = await printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (!uri) {
      console.error('Failed to generate PDF file.');
      Alert.alert('Error', 'Failed to generate PDF file.');
      return false;
    }

    console.log('PDF generated at:', uri);

    // Define the new file name
    const newFileName = `הזמנה_${order.orderNumber}.pdf`;
    const newUri = FileSystem.documentDirectory + newFileName;

    // Rename the file
    await FileSystem.moveAsync({
      from: uri,
      to: newUri,
    }).catch((error) => {
      console.error('Error renaming file:', error);
      Alert.alert('Error', 'Failed to rename PDF file.');
      return false;
    });

    console.log('PDF created:', newUri);

    // Share the PDF
    const result = await Sharing.shareAsync(newUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Order',
    }).catch((error) => {
      console.error('Error sharing file:', error);
      Alert.alert('Error', 'Failed to share PDF file.');
      return false;
    });

    console.log('S.hare result:', result);

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error creating or sharing PDF:', error);
    return false;
  }
};

// دالة لإنشاء ملف PDF من بيانات الطلب
export const generateOrderPDF = async (order) => {
  console.log('Generating PDF for order:', order);

  if (!order || !order.products || Object.keys(order.products).length === 0) {
    console.error('Order or products data is missing.');
    return null;
  }

  const html = `
    <html lang="he">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Heebo', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            direction: rtl;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #f9f9f9;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
          }
          .header .right-section {
            text-align: right;
          }
          .header .right-section p {
            margin: 2px 0;
            font-size: 16px;
          }
          .header .left-section {
            text-align: left;
            font-size: 14px;
          }
          .header .left-section p {
            margin: 2px 0;
          }
          .logo {
            max-width: 100px;
            border-radius: 50%;
            margin-bottom: 10px;
          }
          .order-info {
            margin-bottom: 30px;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 10px;
          }
          .order-info h2 {
            margin: 0 0 10px;
            font-size: 22px;
            color: #0056b3;
          }
          .order-info p {
            margin: 5px 0;
            font-size: 16px;
          }
          .product-list {
            margin-top: 20px;
          }
          .product-list h2 {
            margin: 0 0 10px;
            font-size: 22px;
            color: #0056b3;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 5px;
          }
          .product-list table {
            width: 100%;
            border-collapse: collapse;
          }
          .product-list th, .product-list td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          .product-list th {
            background-color: #0056b3;
            color: white;
            font-size: 16px;
          }
          .product-list td {
            font-size: 14px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 16px;
            color: #555;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="right-section">
              <p><strong>מספר הזמנה:</strong> ${order.orderNumber || 'לא זמין'}</p>
              <p><strong>שם החנות:</strong> ${order.storeName || 'לא זמין'}</p>
              <p><strong>כתובת החנות:</strong> ${order.address || 'לא זמין'}</p>
              <p><strong>ח.פ:</strong> ${order.storeBnNumber || 'לא זמין'}</p>
              <p><strong>מספר טלפון:</strong> ${order.storePhone || 'לא זמין'}</p>
            </div>
            <div class="left-section">
              <img src="https://firebasestorage.googleapis.com/v0/b/aleen-app-35474.appspot.com/o/300952581_591159899469881_5143205118010272337_n%20copy.jpg?alt=media&token=38438863-9c9a-4630-ad00-82c191290813" class="logo" />
              <p>מעיין הציפור בע"מ</p>
              <p>חברה לייצור ושיווק משקאות</p>
              <p>עילוט - נצרת </p>
              <p>מיקוד : 16970</p>
              <p>טלפון: 04-6011689</p>
              <p>ח.פ: 513184754</p>
            </div>
          </div>
          <div class="product-list">
            <h2>רשימת מוצרים</h2>
            <table>
              <thead>
                <tr>
                  <th>ברקוד</th>
                  <th>שם המוצר</th>
                  <th>כמות</th>
                  <th>מחיר ליחידה</th>
                  <th>מחיר כללי</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(order.products).map(([barcode, product]) => `
                  <tr>
                    <td>${barcode}</td>
                    <td>${product.name || 'לא זמין'}</td>
                    <td>${parseInt(product.quantity, 10) || 0}</td>
                    <td>₪${parseFloat(product.price).toFixed(2) || 0}</td>
                    <td>₪${(parseFloat(product.quantity) * parseFloat(product.price)).toFixed(2) || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              סך הכל: ₪${order.totalPrice.toFixed(2) || '0.00'}
            </div>
          </div>
          <div class="footer">
            תודה על ההזמנה!
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const orderNumber = order.orderNumber || 'unknown';
    const { uri } = await printToFileAsync({
      html: html,
      base64: false,
      fileName: `Order_${orderNumber}.pdf` // Specify the file name here
    });

    if (!uri) {
      throw new Error('Failed to generate PDF file.');
    }

    console.log('PDF generated:', uri);
    return uri;
  } catch (error) {
    console.error('Error creating PDF:', error);
    return null;
  }
};

// دالة لمشاركة طلب عبر PDF
export const shareOrder = async (order) => {
  console.log('shareOrder called');

  try {
    if (Object.keys(order.products).length === 0) {
      Alert.alert('Notice!', 'Cannot share an empty order', [{ text: 'OK' }]);
      return false;
    }

    const pdfUri = await generateOrderPDF(order);
    console.log('PDF generated:', pdfUri);

    if (!pdfUri) {
      throw new Error('PDF generation failed');
    }

    const fileInfo = await FileSystem.getInfoAsync(pdfUri);
    console.log('File info:', fileInfo);

    if (!fileInfo.exists) {
      throw new Error('PDF file does not exist at path: ' + pdfUri);
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // تأخير لمدة ثانية

    const result = await Sharing.shareAsync(pdfUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Order',
    });

    console.log('Share result:', result);

    if (result) {
      if (result.action === Sharing.sharedAction) {
        return true; // Successfully shared
      } else if (result.action === Sharing.dismissedAction) {
        return false; // Sharing dismissed
      }
    } else {
      throw new Error('Result from Sharing.shareAsync is null or undefined');
    }
  } catch (error) {
    console.error('Error sharing order: ' + error.message);
    return false;
  }
};

// دالة لإنشاء ملف PDF يحتوي على المحلات التي تمت زيارتها اليوم
export const generateVisitedStoresPDF = async (stores) => {
  // فلترة المحلات التي تمت زيارتها اليوم
  const today = new Date().toDateString();
  const todayStores = stores.filter(store => new Date(store.visitTime).toDateString() === today);
  const currentDate = new Date().toLocaleDateString('he-EG', { year: 'numeric', month: 'long', day: 'numeric' });
try{
  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            direction: rtl;
            text-align: right;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #f9f9f9;
          }
          h1 {
            text-align: center;
            color: #0056b3;
            font-size: 32px;
          }
          h2 {
            text-align: center;
            color: #333;
            font-size: 24px;
            margin-bottom: 40px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
          }
          th {
            background-color: #0056b3;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>דוח יומי לחנויות שבוקרו</h1>
          <h2>${currentDate}</h2>
          <table>
            <thead>
              <tr>
                <th>שם העסק</th>
                <th>כתובת</th>
                <th>זמן ביקור</th>
              </tr>
            </thead>
            <tbody>
              ${todayStores.map(store => `
                <tr>
                  <td>${store.name}</td>
                  <td>${store.address}</td>
                  <td>${new Date(store.visitTime).toLocaleTimeString('he-IL')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;

  const { uri } = await printToFileAsync({
    html: html,
    base64: false,
  });

  if (!uri) {
    console.error('Failed to generate PDF file.');
    Alert.alert('Error', 'Failed to generate PDF file.');
    return false;
  }

  console.log('PDF generated at:', uri);

  // Define the new file name
  const date = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = new Intl.DateTimeFormat('he-IL', options).format(date);
  const newFileName = `דוח יומי : ${formattedDate}.pdf`;
  const newUri = FileSystem.documentDirectory + newFileName;

  // Rename the file
  await FileSystem.moveAsync({
    from: uri,
    to: newUri,
  }).catch((error) => {
    console.error('Error renaming file:', error);
    Alert.alert('Error', 'Failed to rename PDF file.');
    return false;
  });

  console.log('PDF created:', newUri);

  // Share the PDF
  const result = await Sharing.shareAsync(newUri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Share Order',
  }).catch((error) => {
    console.error('Error sharing file:', error);
    Alert.alert('Error', 'Failed to share PDF file.');
    return false;
  });

  console.log('S.hare result:', result);

  if (result) {
    return true;
  } else {
    return false;
  }
} catch (error) {
  console.error('Error creating or sharing PDF:', error);
  return false;
}
};