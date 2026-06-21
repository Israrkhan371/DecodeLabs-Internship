const db = require('../config/database');

// ─── CREATE = POST = SQL INSERT ───────────────────────────
const createProduct = (req, res) => {
  const { name, price, category, stock = 0 } = req.body;

  const sql = `INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)`;

  db.run(sql, [name, price, category, stock], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: this.lastID, name, price, category, stock },
    });
  });
};

// ─── READ = GET = SQL SELECT ──────────────────────────────
const getAllProducts = (req, res) => {
  let sql = `SELECT * FROM products`;
  const params = [];

  // Optional filter: GET /api/products?category=electronics
  if (req.query.category) {
    sql += ` WHERE category = ?`;
    params.push(req.query.category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.status(200).json({ success: true, count: rows.length, data: rows });
  });
};

const getProductById = (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, error: `Product with id ${id} not found` });

    res.status(200).json({ success: true, data: row });
  });
};

// ─── UPDATE = PUT = SQL UPDATE ────────────────────────────
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, category, stock } = req.body;

  const sql = `UPDATE products SET name = ?, price = ?, category = ?, stock = ? WHERE id = ?`;

  db.run(sql, [name, price, category, stock, id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: `Product with id ${id} not found` });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { id: Number(id), name, price, category, stock },
    });
  });
};

// ─── DELETE = DELETE = SQL DELETE ─────────────────────────
const deleteProduct = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: `Product with id ${id} not found` });
    }

    res.status(204).send();
  });
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
