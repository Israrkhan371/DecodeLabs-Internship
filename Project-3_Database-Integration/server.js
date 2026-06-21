const express = require('express');
const app = express();

// Initialize database connection & schema (runs once on startup)
require('./config/database');

// ─── Middleware ───────────────────────────────────────────
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────
const userRoutes    = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes   = require('./routes/orders');

app.use('/api/users',    userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);

// ─── Root endpoint ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 DecodeLabs Project 3 — Database Integration API is running!',
    version: '1.0.0',
    database: 'SQLite',
    endpoints: {
      users:    '/api/users',
      products: '/api/products',
      orders:   '/api/orders',
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
