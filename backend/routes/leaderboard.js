const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const { decode } = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');
const { update } = require('../models/Leaderboard');
const fs = require('fs');
const secretKey = process.env.JWT_SECRET;


const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });


  try {
     const decodedPayload = jwt.decode(token);
    // console.log("Decoded payload (without verification):", decodedPayload);

    const decoded = jwt.verify(token, secretKey);
    // console.log("Decoded:", decoded); 

    const users = JSON.parse(fs.readFileSync('./Users/users.json', 'utf8'));
    const user = users.find(u => u.email === decoded.email); 

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = { email: user.email, name: user.name }; 
    // console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

router.post('/', authenticate, async (req, res) => {
  try {
    const { score } = req.body;

    if (!req.user || !req.user.name || score === undefined) {
      return res.status(400).json({ message: 'Name and score are required' });
    }

    const newEntry = new Leaderboard({
      user: req.user.email,
      name: req.user.name,
      score,
      rank: 0,
    });

    await newEntry.save();
    await updateRanks();

    saveScoreToFile(req.user.email, score);

    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error adding score to leaderboard:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
      const entries = await Leaderboard.find().sort({ score: -1 });
      res.json(entries);
  } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: 'Server error' });
  }
});

const updateRanks = async () => {
  const entries = await Leaderboard.find().sort({ score: -1 });
  entries.forEach(async (entry, index) => {
    entry.rank = index + 1;
    await entry.save();
  });
};

//this is just to store in a floder but later i removed it
const saveScoreToFile = (email, score) => {
  const filePath = './Users/score.json'; 

  const scoreEntry = {
    email: email,
    score: score,
    date: new Date().toISOString(),
  };

  let scores = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    scores = JSON.parse(data);
  }

  scores.push(scoreEntry);

  //No need to store in file it is just for checking
  //fs.writeFileSync(filePath, JSON.stringify(scores, null, 2), 'utf8');
};

module.exports = router;
