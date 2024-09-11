const User = require('../models/User');
const { EmbedBuilder, Colors } = require('discord.js');
const fs = require('fs');
const path = require('path');

const lotteryPath = path.join(__dirname, '../database/lottery.json');

module.exports = {
    name: 'lottery',
    description: 'Buy a lottery ticket or draw a winner',
    args: false,
    async execute(message, args) {
        const userId = message.author.id;
        const draw = args[0] === 'draw';

        try {
            let lottery = {};
            if (fs.existsSync(lotteryPath)) {
                lottery = JSON.parse(fs.readFileSync(lotteryPath, 'utf-8'));
            }

            if (draw) {
                if (!lottery.tickets || lottery.tickets.length === 0) {
                    return message.channel.send('No tickets have been sold yet.');
                }

                // Draw a winner
                const winnerId = lottery.tickets[Math.floor(Math.random() * lottery.tickets.length)];
                const winner = await User.findOne({ userId: winnerId });
                const prize = 1000; // Set the prize amount

                if (winner) {
                    winner.balance += prize;
                    await winner.save();
                }

                // Reset lottery
                lottery.tickets = [];
                fs.writeFileSync(lotteryPath, JSON.stringify(lottery, null, 2), 'utf8');

                // Create and send embed
                const embed = new EmbedBuilder()
                    .setColor('#FFD700')
                    .setTitle('Lottery Draw!')
                    .setDescription(`Congratulations <@${winnerId}>! You have won 💰 ${prize}.`)
                    .setTimestamp();

                return message.channel.send({ embeds: [embed] });
            } else {
                const user = await User.findOne({ userId });
                if (!user || user.balance < 100) {
                    return message.channel.send('You need at least 💰 100 to buy a ticket.');
                }

                // Deduct cost and add ticket
                user.balance -= 100;
                await user.save();

                lottery.tickets = lottery.tickets || [];
                if (!lottery.tickets.includes(userId)) {
                    lottery.tickets.push(userId);
                }

                fs.writeFileSync(lotteryPath, JSON.stringify(lottery, null, 2), 'utf8');

                // Create and send embed
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('Lottery Ticket Purchased!')
                    .setDescription('You have successfully bought a lottery ticket for 💰 100.')
                    .setTimestamp();

                return message.channel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error processing lottery:', error);
            message.channel.send('An error occurred while processing the lottery.');
        }
    },
};
