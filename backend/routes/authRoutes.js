const express = require('express');
const { registerUser, loginUser, fetchAllUsers, updateUser } = require('../controllers/authController');

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Fetch all users
router.get('/users', fetchAllUsers);

// Update user
router.put('/user/:id', updateUser);

module.exports = router;
