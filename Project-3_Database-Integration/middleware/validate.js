// ─── Validation Middleware — Pillar 4: The Shield ─────────
// "Databases must never trust application logic blindly."

const validateUser = (req, res, next) => {
  const { name, email, role } = req.body;
  const errors = [];

  if (!name)  errors.push('name is required');
  if (!email) errors.push('email is required');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('email format is invalid');
  }

  const allowedRoles = ['admin', 'user'];
  if (role && !allowedRoles.includes(role)) {
    errors.push(`role must be one of: ${allowedRoles.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, category, stock } = req.body;
  const errors = [];

  if (!name)     errors.push('name is required');
  if (!price)    errors.push('price is required');
  if (!category) errors.push('category is required');

  if (price !== undefined && (isNaN(price) || price <= 0)) {
    errors.push('price must be a positive number');
  }

  if (stock !== undefined && (isNaN(stock) || stock < 0)) {
    errors.push('stock must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { user_id, product_id, quantity } = req.body;
  const errors = [];

  if (!user_id)    errors.push('user_id is required');
  if (!product_id) errors.push('product_id is required');
  if (quantity !== undefined && (isNaN(quantity) || quantity <= 0)) {
    errors.push('quantity must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

module.exports = { validateUser, validateProduct, validateOrder };
