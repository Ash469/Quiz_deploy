const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcrypt');
const users = require('../Users/users');
require('dotenv').config();
const usersFilePath = './Users/users.json';
const secretKey = process.env.JWT_SECRET;


const loadUsers = () => {
  if (fs.existsSync(usersFilePath)) {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  }
  return [];
};

router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Check input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Load users
  const existingUsers = loadUsers();
  
  // Check email
  const user = existingUsers.find((u) => u.email === email) || users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
 
  // Check password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate JWT
  const token = jwt.sign(
    { email: user.email,name:user.name },secretKey);

    return res.json({ token });
});

module.exports = router;

