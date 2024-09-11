// commands/marry.js
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'marry',
    description: 'Marry another user',
    async execute(message, args) {
        if (!args[0]) return message.reply('Please mention a user to marry.');
        
        const userToMarry = message.mentions.users.first();
        if (!userToMarry) return message.reply('Invalid user.');

        const usersPath = path.join(__dirname, '../database/users.json');
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

        const userId = message.author.id;
        const marryId = userToMarry.id;

        if (!users[userId]) users[userId] = {};
        if (!users[marryId]) users[marryId] = {};

        if (users[userId].marriedTo) return message.reply('You are already married.');
        if (users[marryId].marriedTo) return message.reply('This user is already married.');

        users[userId].marriedTo = marryId;
        users[marryId].marriedTo = userId;

        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

        message.channel.send(`${message.author} has married ${userToMarry}! 💍`);
    }
};
