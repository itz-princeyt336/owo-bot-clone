const User = require('../models/User');

module.exports = {
    name: 'deposit',
    description: 'Deposit money into your bank.',
    args: true,
    usage: '<amount>',
    async execute(message, args) {
        const amount = parseInt(args[0], 10);
        if (isNaN(amount) || amount <= 0) {
            return message.channel.send('Please provide a valid amount to deposit.');
        }

        const userId = message.author.id;

        // Find or create the user
        let user = await User.findOne({ userId });
        if (!user) {
            user = new User({
                userId,
                username: message.author.username,
            });
        }

        if (user.balance < amount) {
            return message.channel.send('You do not have enough money in your wallet.');
        }

        // Update balances
        user.balance -= amount;
        user.bankBalance += amount;

        // Save user data
        await user.save();

        return message.channel.send(`Successfully deposited 💰 ${amount} into your bank.`);
    },
};
