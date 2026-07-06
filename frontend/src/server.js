const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Apple Shop API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products'
    }
  });
});

// Тестовый маршрут здоровья
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Apple Shop API is running' });
});

// Временный маршрут для продуктов
app.get('/api/products', (req, res) => {
  res.json({ 
    products: [
      { id: 1, name: 'iPhone 15', price: 999 },
      { id: 2, name: 'iPad Pro', price: 1099 },
      { id: 3, name: 'MacBook Pro', price: 1999 }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Visit http://localhost:${PORT}/ to see API info`);
});
