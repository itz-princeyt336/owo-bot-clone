// commands/level.js
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = {
    name: 'level',
    description: 'Show your chat level',
    async execute(message) {
        const userId = message.author.id;

        // Ensure user is in the database
        let user = await User.findOne({ userId });
        if (!user) {
            user = new User({ userId, username: message.author.username });
            await user.save();
        }

        message.channel.send({
            embeds: [
                {
                    title: `${message.author.username}'s Level`,
                    description: `You are currently at level **${user.level || 1}**.`,
                    color: 0x00FF00,
                    thumbnail: { url: message.author.displayAvatarURL() }
                }
            ]
        });
    }
};
