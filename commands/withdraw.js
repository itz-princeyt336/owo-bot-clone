const User = require('../models/User');

module.exports = {
    name: 'withdraw',
    description: 'Withdraw money from your bank.',
    args: true,
    usage: '<amount>',
    async execute(message, args) {
        const amount = parseInt(args[0], 10);
        if (isNaN(amount) || amount <= 0) {
            return message.channel.send('Please provide a valid amount to withdraw.');
        }

        try {
            const user = await User.findOne({ userId: message.author.id });

            if (!user) {
                // Initialize user if not found
                await User.create({ userId: message.author.id, username: message.author.username });
                return message.channel.send('Your account has been created. Try withdrawing again.');
            }

            if (user.bankBalance < amount) {
                return message.channel.send('You do not have enough money in your bank.');
            }

            // Update balances
            user.bankBalance -= amount;
            user.balance += amount;
            await user.save();

            return message.channel.send(`Successfully withdrew 💰 ${amount} from your bank.`);
        } catch (error) {
            console.error('Error withdrawing money:', error);
            message.channel.send('An error occurred while withdrawing money.');
        }
    },
};
