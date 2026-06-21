const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ─── Connect to SQLite Database ───────────────────────────
// This creates a file called database.sqlite if it doesn't exist
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// ─── Define Schema (The Blueprint) ────────────────────────
// Pillar 1: Schema design with constraints (UNIQUE, NOT NULL, CHECK)
db.serialize(() => {
  // Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      email     TEXT NOT NULL UNIQUE,
      role      TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Products Table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      price     REAL NOT NULL CHECK(price > 0),
      category  TEXT NOT NULL,
      stock     INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Orders Table — demonstrates One-to-Many relationship (Pillar 2: The Bridge)
  // A single User can have multiple Orders (via FOREIGN KEY)
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity   INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
      total      REAL NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Seed initial data only if tables are empty
  db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
    if (!err && row.count === 0) {
      db.run(`INSERT INTO users (name, email, role) VALUES
        ('Alice Khan', 'alice@example.com', 'admin'),
        ('Bob Ahmed', 'bob@example.com', 'user'),
        ('Sara Malik', 'sara@example.com', 'user')
      `);
    }
  });

  db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (!err && row.count === 0) {
      db.run(`INSERT INTO products (name, price, category, stock) VALUES
        ('Laptop', 75000, 'electronics', 10),
        ('Headphones', 3500, 'electronics', 25),
        ('Notebook', 150, 'stationery', 100)
      `);
    }
  });
});

module.exports = db;
