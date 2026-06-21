const db = require('../config/database');

// ─── CREATE = POST = SQL INSERT ───────────────────────────
const createUser = (req, res) => {
  const { name, email, role = 'user' } = req.body;

  // ✅ Parameterized query — prevents SQL Injection (Pillar 4: The Shield)
  const sql = `INSERT INTO users (name, email, role) VALUES (?, ?, ?)`;

  db.run(sql, [name, email, role], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
      return res.status(500).json({ success: false, error: err.message });
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: this.lastID, name, email, role },
    });
  });
};

// ─── READ = GET = SQL SELECT ──────────────────────────────
const getAllUsers = (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.status(200).json({ success: true, count: rows.length, data: rows });
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, error: `User with id ${id} not found` });

    res.status(200).json({ success: true, data: row });
  });
};

// ─── UPDATE = PUT = SQL UPDATE ────────────────────────────
const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const sql = `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`;

  db.run(sql, [name, email, role, id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: `User with id ${id} not found` });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { id: Number(id), name, email, role },
    });
  });
};

// ─── DELETE = DELETE = SQL DELETE ─────────────────────────
const deleteUser = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: `User with id ${id} not found` });
    }

    res.status(204).send();
  });
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
