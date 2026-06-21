const db = require('../config/database');

// ─── CREATE = POST = SQL INSERT ───────────────────────────
// Demonstrates a One-to-Many relationship: a User can place many Orders
const createOrder = (req, res) => {
  const { user_id, product_id, quantity = 1 } = req.body;

  // Step 1 — Verify user exists (referential integrity check)
  db.get(`SELECT * FROM users WHERE id = ?`, [user_id], (err, user) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!user) return res.status(404).json({ success: false, error: `User with id ${user_id} not found` });

    // Step 2 — Verify product exists & calculate total
    db.get(`SELECT * FROM products WHERE id = ?`, [product_id], (err, product) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (!product) return res.status(404).json({ success: false, error: `Product with id ${product_id} not found` });

      if (product.stock < quantity) {
        return res.status(400).json({ success: false, error: `Not enough stock. Only ${product.stock} left.` });
      }

      const total = product.price * quantity;

      // Step 3 — Insert order
      const sql = `INSERT INTO orders (user_id, product_id, quantity, total) VALUES (?, ?, ?, ?)`;
      db.run(sql, [user_id, product_id, quantity, total], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });

        // Step 4 — Reduce stock accordingly
        db.run(`UPDATE products SET stock = stock - ? WHERE id = ?`, [quantity, product_id]);

        res.status(201).json({
          success: true,
          message: 'Order created successfully',
          data: { id: this.lastID, user_id, product_id, quantity, total },
        });
      });
    });
  });
};

// ─── READ = GET = SQL SELECT (with JOIN) ──────────────────
// Shows the relational power: combining orders + users + products
const getAllOrders = (req, res) => {
  const sql = `
    SELECT 
      orders.id, 
      orders.quantity, 
      orders.total, 
      orders.created_at,
      users.name  AS customer_name,
      users.email AS customer_email,
      products.name AS product_name
    FROM orders
    JOIN users    ON orders.user_id = users.id
    JOIN products ON orders.product_id = products.id
    ORDER BY orders.created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.status(200).json({ success: true, count: rows.length, data: rows });
  });
};

const getOrderById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      orders.id, 
      orders.quantity, 
      orders.total, 
      orders.created_at,
      users.name  AS customer_name,
      users.email AS customer_email,
      products.name AS product_name
    FROM orders
    JOIN users    ON orders.user_id = users.id
    JOIN products ON orders.product_id = products.id
    WHERE orders.id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, error: `Order with id ${id} not found` });

    res.status(200).json({ success: true, data: row });
  });
};

// ─── DELETE = DELETE = SQL DELETE ─────────────────────────
const deleteOrder = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM orders WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: `Order with id ${id} not found` });
    }

    res.status(204).send();
  });
};

module.exports = { createOrder, getAllOrders, getOrderById, deleteOrder };
