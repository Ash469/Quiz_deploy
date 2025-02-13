const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    user: { type: String, required: true },
    name: { type: String, required: true },
    score: { type: Number, required: true },
    rank: { type: Number, default: 0 },
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
module.exports = Leaderboard;
