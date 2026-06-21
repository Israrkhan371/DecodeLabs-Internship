const express = require('express');
const router  = express.Router();

const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { validateUser } = require('../middleware/validate');

// GET    /api/users        → get all users
// GET    /api/users/:id    → get one user
// POST   /api/users        → create a new user   (with validation)
// PUT    /api/users/:id    → update a user        (with validation)
// DELETE /api/users/:id    → delete a user

router.get('/',       getAllUsers);
router.get('/:id',    getUserById);
router.post('/',      validateUser, createUser);
router.put('/:id',    validateUser, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
