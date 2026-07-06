const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка подключения к БД
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Проверка подключения к БД
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
  } else {
    console.log('✅ Successfully connected to PostgreSQL database');
    release();
  }
});

app.use(cors());
app.use(express.json());

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Apple Shop API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      product: '/api/product/:id',
      productOptions: '/api/product/:id/options',
      cart: '/api/cart',
      orders: '/api/orders/:userId',
      categories: '/api/categories'
    }
  });
});

// Здоровье сервера
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Apple Shop API is running' });
});

// 1. Получить все товары с категориями
app.get('/api/products', async (req, res) => {
  try {
    console.log('📦 Fetching products...');
    const result = await pool.query('SELECT * FROM view_product()');
    console.log(`✅ Found ${result.rows.length} products`);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching products:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Получить товар по ID
app.get('/api/product/:id', async (req, res) => {
  try {
    console.log(`📦 Fetching product ${req.params.id}...`);
    const result = await pool.query('SELECT * FROM get_product($1)', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching product:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. Получить варианты товара (опции)
app.get('/api/product/:id/options', async (req, res) => {
  try {
    console.log(`🎨 Fetching options for product ${req.params.id}...`);
    const result = await pool.query('SELECT * FROM view_options($1)', [req.params.id]);
    console.log(`✅ Found ${result.rows.length} options`);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching options:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 4. Получить все категории
app.get('/api/categories', async (req, res) => {
  try {
    console.log('📂 Fetching categories...');
    const result = await pool.query('SELECT * FROM get_categories()');
    console.log(`✅ Found ${result.rows.length} categories`);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching categories:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 5. Добавить товар в корзину
app.post('/api/cart/add', async (req, res) => {
  const { cartId, productOptionId, quantity } = req.body;
  
  if (!cartId || !productOptionId || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log(`🛒 Adding to cart: cartId=${cartId}, optionId=${productOptionId}, qty=${quantity}`);
    const result = await pool.query(
      'SELECT add_to_cart($1, $2, $3)',
      [cartId, productOptionId, quantity]
    );
    res.json({ message: result.rows[0].add_to_cart });
  } catch (err) {
    console.error('❌ Error adding to cart:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 6. Просмотр корзины
app.get('/api/cart/:cartId', async (req, res) => {
  try {
    console.log(`🛒 Viewing cart ${req.params.cartId}...`);
    const result = await pool.query('SELECT * FROM view_cart($1)', [req.params.cartId]);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error viewing cart:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 7. Удалить товар из корзины
app.delete('/api/cart/:cartId/:productOptionId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT remove_from_cart($1, $2)',
      [req.params.cartId, req.params.productOptionId]
    );
    res.json({ message: result.rows[0].remove_from_cart });
  } catch (err) {
    console.error('❌ Error removing from cart:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 8. Оформить заказ
app.post('/api/checkout', async (req, res) => {
  const { cartId, userId, orderStatusId = 1 } = req.body;
  
  if (!cartId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'SELECT checkout_cart($1, $2, $3)',
      [cartId, userId, orderStatusId]
    );
    res.json({ orderId: result.rows[0].checkout_cart });
  } catch (err) {
    console.error('❌ Error checkout:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 9. Получить заказы пользователя
app.get('/api/orders/:userId', async (req, res) => {
  try {
    console.log(`📋 Fetching orders for user ${req.params.userId}...`);
    const result = await pool.query('SELECT * FROM get_orders($1)', [req.params.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching orders:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 10. Получить фотографии товаров
app.get('/api/photos', async (req, res) => {
  try {
    console.log('📸 Fetching photos...');
    const result = await pool.query('SELECT * FROM get_photos()');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching photos:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Visit http://localhost:${PORT}/ to see API info`);
  console.log(`🗄️  DATABASE_URL: ${process.env.DATABASE_URL}`);
});
