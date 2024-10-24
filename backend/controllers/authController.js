const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists." });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    res.status(201).json({
        message: "User registered successfully.",
        user: { id: user._id, email: user.email }
    });
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: { id: user._id, email: user.email }
        });
    } else {
        return res.status(401).json({ message: "Invalid email or password." });
    }
};

// Fetch All Users
exports.fetchAllUsers = async (req, res) => {
    const users = await User.find({}, 'username email'); // Fetch only username and email
    res.status(200).json({ users });
};

// Update User
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "No fields to update." });
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    if (email) user.email = email;

    await user.save();

    res.status(200).json({
        message: "User updated successfully.",
        user: { id: user._id, email: user.email }
    });
};