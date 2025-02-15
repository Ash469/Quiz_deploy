require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { LocalStorage } = require('node-localstorage');
const User = require('../models/User'); 

// Setup Local Storage
const localStorage = new LocalStorage('./scratch');

// Ensure the Users directory exists
const usersFilePath = './Users/users.json';
if (!fs.existsSync('./Users')) fs.mkdirSync('./Users');
if (!fs.existsSync(usersFilePath)) fs.writeFileSync(usersFilePath, JSON.stringify([]));

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  console.error("❌ JWT_SECRET is missing in .env file!");
  process.exit(1); // Stop server if JWT is missing
}

const loadUsers = () => JSON.parse(fs.readFileSync(usersFilePath, 'utf8') || "[]");
const saveUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

// Signup Route
router.post('/', async (req, res) => {
  console.log("Received signup request:", req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if user exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Create JWT
    const token = jwt.sign({ userId: newUser._id, email }, secretKey, { expiresIn: '1h' });

    // Save to JSON file
    const existingUsers = loadUsers();
    existingUsers.push({ name, email, password: hashedPassword });
    saveUsers(existingUsers);

    // Store token in localStorage
    localStorage.setItem('jwtToken', token);

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
