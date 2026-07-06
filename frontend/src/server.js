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
    const result = await pool.query('SELECT * FROM view_product()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Получить товар по ID
app.get('/api/product/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_product($1)', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. Получить варианты товара (опции)
app.get('/api/product/:id/options', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM view_options($1)', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. Получить все категории
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_categories()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 5. Добавить товар в корзину
app.post('/api/cart/add', async (req, res) => {
  const { cartId, productOptionId, quantity } = req.body;
  
  if (!cartId || !productOptionId || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'SELECT add_to_cart($1, $2, $3)',
      [cartId, productOptionId, quantity]
    );
    res.json({ message: result.rows[0].add_to_cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 6. Просмотр корзины
app.get('/api/cart/:cartId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM view_cart($1)', [req.params.cartId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
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
    console.error(err);
    res.status(500).json({ error: 'Database error' });
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
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 9. Получить заказы пользователя
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_orders($1)', [req.params.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 10. Получить фотографии товаров
app.get('/api/photos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_photos()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Visit http://localhost:${PORT}/ to see API info`);
  console.log(`🗄️  Connected to database: ${process.env.DATABASE_URL}`);
});
