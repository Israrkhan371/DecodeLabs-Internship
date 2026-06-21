# 🚀 DecodeLabs – Project 3: Database Integration

## 📁 Project Structure

```
Project-3_Database-Integration/
│
├── server.js                  ← Entry point (start here)
├── package.json               ← Dependencies
├── .gitignore                  ← Ignores node_modules & database file
│
├── config/
│   └── database.js            ← DB connection + schema + seed data
│
├── middleware/
│   └── validate.js            ← Input validation (The Shield)
│
├── controllers/
│   ├── userController.js      ← User CRUD logic
│   ├── productController.js   ← Product CRUD logic
│   └── orderController.js     ← Order CRUD logic (with JOIN queries)
│
└── routes/
    ├── users.js                ← /api/users routes
    ├── products.js             ← /api/products routes
    └── orders.js                ← /api/orders routes
```

---

## ⚙️ Setup & Installation

### Step 1 – Make sure Node.js is installed
```bash
node -v
npm -v
```
If not installed → download from https://nodejs.org

---

### Step 2 – Go into the project folder
```bash
cd Project-3_Database-Integration
```

---

### Step 3 – Install dependencies
```bash
npm install
```
This installs **Express** (server) and **sqlite3** (database driver).

---

### Step 4 – Run the server

**Normal mode:**
```bash
npm start
```

**Dev mode (auto-restart on file change):**
```bash
npm run dev
```

You should see:
```
✅ Connected to SQLite database
✅ Server running at http://localhost:3000
```

A file called **`database.sqlite`** will automatically appear in your project folder — that's your real, persistent database!

---

## 🧪 Testing the API (Using Postman)

---

### 🔵 ROOT
| Method | URL | What it does |
|--------|-----|---------------|
| GET | `http://localhost:3000/` | Check server status |

---

### 👤 USERS — `/api/users`

| Method | URL | What it does |
|--------|-----|---------------|
| GET | `http://localhost:3000/api/users` | Get all users |
| GET | `http://localhost:3000/api/users/1` | Get user by ID |
| POST | `http://localhost:3000/api/users` | Create a new user |
| PUT | `http://localhost:3000/api/users/1` | Update a user |
| DELETE | `http://localhost:3000/api/users/1` | Delete a user |

#### POST /api/users — Body (JSON):
```json
{
  "name": "Hamza Ali",
  "email": "hamza@example.com",
  "role": "user"
}
```

#### ❌ Test Validation – Duplicate email:
Send this **twice**:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "role": "user"
}
```
→ 1st request: `201 Created` · 2nd request: `400 Bad Request` — `"Email already exists"` (enforced by the `UNIQUE` constraint at the database level)

---

### 📦 PRODUCTS — `/api/products`

| Method | URL | What it does |
|--------|-----|---------------|
| GET | `http://localhost:3000/api/products` | Get all products |
| GET | `http://localhost:3000/api/products?category=electronics` | Filter by category |
| GET | `http://localhost:3000/api/products/1` | Get product by ID |
| POST | `http://localhost:3000/api/products` | Create a new product |
| PUT | `http://localhost:3000/api/products/1` | Update a product |
| DELETE | `http://localhost:3000/api/products/1` | Delete a product |

#### POST /api/products — Body (JSON):
```json
{
  "name": "Mouse",
  "price": 1500,
  "category": "electronics",
  "stock": 50
}
```

---

### 🧾 ORDERS — `/api/orders`  *(The Bridge: One-to-Many relationship)*

| Method | URL | What it does |
|--------|-----|---------------|
| GET | `http://localhost:3000/api/orders` | Get all orders (joined with user + product info) |
| GET | `http://localhost:3000/api/orders/1` | Get one order |
| POST | `http://localhost:3000/api/orders` | Create a new order |
| DELETE | `http://localhost:3000/api/orders/1` | Delete an order |

#### POST /api/orders — Body (JSON):
```json
{
  "user_id": 1,
  "product_id": 2,
  "quantity": 2
}
```
→ Automatically calculates the total price and **reduces product stock**

#### ❌ Test Validation – Not enough stock:
```json
{
  "user_id": 1,
  "product_id": 2,
  "quantity": 9999
}
```
→ `400 Bad Request` — `"Not enough stock. Only X left."`
*(check current stock first with `GET /api/products/2` — default seed stock is 25)*

#### ❌ Test Validation – Invalid user ID:
```json
{
  "user_id": 999,
  "product_id": 1,
  "quantity": 1
}
```
→ `404 Not Found` — `"User with id 999 not found"`

#### ❌ Test Validation – Invalid product ID:
```json
{
  "user_id": 1,
  "product_id": 999,
  "quantity": 1
}
```
→ `404 Not Found` — `"Product with id 999 not found"`

---

## 🔄 Persistence Test (Proves It's a Real Database)

1. Create a user or two via POST
2. Stop the server — `Ctrl + C`
3. Run `npm start` again
4. Run `GET http://localhost:3000/api/users`

✅ Your created data is **still there** — unlike Project 2's in-memory store, which reset on every restart.

---

## 📊 HTTP Status Codes Used

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET / PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation failed / duplicate / insufficient stock |
| 404 | Not Found | ID doesn't exist |
| 500 | Internal Server Error | Unexpected crash |

---

## 💡 Key Concepts Demonstrated

- ✅ **Schema Design** — Users, Products, and Orders tables with proper data types
- ✅ **Relational Geometry** — One-to-Many relationship (User → Orders) using FOREIGN KEY
- ✅ **Primary Keys & Foreign Keys** — binding tables together with referential integrity
- ✅ **Full CRUD Operations** — Create, Read, Update, Delete mapped to real SQL queries
- ✅ **Parameterized Queries** — every query uses `?` placeholders to prevent **SQL Injection**
- ✅ **Schema-level constraints** — `UNIQUE`, `NOT NULL`, `CHECK` enforced at the database layer
- ✅ **JOIN Queries** — combining data across multiple tables (orders + users + products)
- ✅ **Persistent Storage** — data survives server restarts (stored in `database.sqlite`)

---

## 🛡️ Security Note: SQL Injection Prevention

This project uses **parameterized queries** everywhere, e.g.:

```js
// ✅ SAFE — input is treated as data, never as executable code
db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email]);
```

Instead of unsafe string concatenation like:

```js
// ❌ DANGEROUS — vulnerable to SQL Injection
db.run(`INSERT INTO users (name, email) VALUES ('${name}', '${email}')`);
```

---

## 🔙 Back to Main Repo
[← DecodeLabs-Internship](https://github.com/Israrkhan371/DecodeLabs-Internship/blob/main/README.md)