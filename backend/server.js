const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const leaderboardRoutes = require('./routes/leaderboard');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json()); 
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/Quiz';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));


// Routes
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/leaderboard', leaderboardRoutes); 


app.listen(5000, () => {
    console.log('Server is running on port 5000');
})