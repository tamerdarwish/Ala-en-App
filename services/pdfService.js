import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

const generateOrderPDF = async (order) => {
  if (!order || !order.products || Object.keys(order.products).length === 0) {
    console.error('Order or products data is missing.');
    return;
  }

  // تنسيق المعلومات في HTML
  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
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
          .header h1 {
            margin: 0;
            color: #0056b3;
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
            <h1>طلبية جديدة</h1>
          </div>
          <div class="order-info">
            <h2>معلومات الطلبية</h2>
            <p><strong>اسم المحل:</strong> ${order.storeName || 'غير متوفر'}</p>
            <p><strong>عنوان المحل:</strong> ${order.storeAddress || 'غير متوفر'}</p>
            <p><strong>السعر الإجمالي:</strong> ₪${order.totalPrice.toFixed(2) || '0.00'}</p>
          </div>
          <div class="product-list">
            <h2>قائمة المنتجات</h2>
            <table>
              <thead>
                <tr>
                  <th>الرمز</th>
                  <th>اسم المنتج</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(order.products).map(([barcode, product]) => `
                  <tr>
                    <td>${barcode}</td>
                    <td>${product.name || 'غير متوفر'}</td>
                    <td>${parseInt(product.quantity, 10) || 0}</td>
                    <td>₪${parseFloat(product.price).toFixed(2) || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="footer">
            شكراً لتعاملكم معنا!
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