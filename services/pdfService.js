import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

const generateOrderPDF = async (order) => {
  if (!order || !order.products || Object.keys(order.products).length === 0) {
    console.error('Order or products data is missing.');
    return;
  }

  const html = `
    <html lang="he">
      <head>
       <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100..900&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            direction: rtl; /* للتنسيق من اليمين إلى اليسار */
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
            text-align: center;
            margin-bottom: 30px;
          }
          .header img {
            max-width: 100px; /* حجم الشعار */
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #0056b3;
            font-size: 24px;
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="assets\logo.jpg" alt="Logo" />
            <h1>הזמנה חדשה</h1>
          </div>
          <div class="order-info">
            <h2>פרטי הזמנה</h2>
            <p><strong>שם החנות:</strong> ${order.storeName || 'לא זמין'}</p>
            <p><strong>כתובת החנות:</strong> ${order.storeAddress || 'לא זמין'}</p>
            <p><strong>סך הכל:</strong> ₪${order.totalPrice.toFixed(2) || '0.00'}</p>
          </div>
          <div class="product-list">
            <h2>רשימת מוצרים</h2>
            <table>
              <thead>
                <tr>
                  <th>ברקוד</th>
                  <th>שם המוצר</th>
                  <th>כמות</th>
                  <th>מחיר</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(order.products).map(([barcode, product]) => `
                  <tr>
                    <td>${barcode}</td>
                    <td>${product.name || 'לא זמין'}</td>
                    <td>${parseInt(product.quantity, 10) || 0}</td>
                    <td>₪${parseFloat(product.price).toFixed(2) || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="footer">
            תודה על ההזמנה!
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const file = await printToFileAsync({
      html: html,
      base64: false
    });
    await shareAsync(file.uri);
  } catch (error) {
    console.error('Error creating PDF:', error);
  }
};

export { generateOrderPDF };
