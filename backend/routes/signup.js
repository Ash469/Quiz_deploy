const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const usersFilePath = './Users/users.json';
const secretKey = process.env.JWT_SECRET;

const loadUsers = () => {
  if (fs.existsSync(usersFilePath)) {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  }
  return [];
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Signup route
router.post('/', async (req, res) => {
    console.log(req.body);
  const { name, email, password } = req.body;

  // Check Input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // MongoDB
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

       // Create a JWT
       const token = jwt.sign({ userId: newUser._id, email: newUser.email }, secretKey); 

    // Save to JSON file and LocalStorage
    let existingUsers = loadUsers();
    existingUsers.push({ name, email, password: hashedPassword }); 
    saveUsers(existingUsers);

    //set jwt Token in LocalStorage
    localStorage.setItem('jwtToken', token);
    

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
