// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    balance: { type: Number, default: 0 },
    bankBalance: { type: Number, default: 0 },
    stones: { type: [String], default: [] },
    inventory: {
        common: [{ name: String }],
        rare: [{ name: String }],
    },
    level: { type: Number, default: 1 },
    marriedTo: { type: String, default: null },
    lootboxes: { type: Number, default: 0 },
    crates: { type: Number, default: 0 },
    zoo: { type: [String], default: [] },
    equippedWeapon: { type: String, default: null },
    weapons: { type: [String], default: [] }, // Add this line
    lastBattle: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);
