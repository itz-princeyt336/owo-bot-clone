const User = require('../models/User');

module.exports = {
    name: 'give',
    description: 'Send money to another user.',
    args: true,
    usage: '<user> <amount>',
    async execute(message, args) {
        if (args.length < 2) {
            return message.channel.send('Please provide a user and an amount to give.');
        }

        const recipient = message.mentions.users.first();
        const amount = parseInt(args[1], 10);

        if (!recipient) {
            return message.channel.send('Please mention a valid user.');
        }

        if (isNaN(amount) || amount <= 0) {
            return message.channel.send('Please provide a valid amount.');
        }

        const senderId = message.author.id;
        const recipientId = recipient.id;

        // Find or create users
        const sender = await User.findOne({ userId: senderId });
        if (!sender) {
            return message.channel.send('You do not have an account. Please use the `!register` command to create one.');
        }

        const recipientUser = await User.findOne({ userId: recipientId }) || new User({ userId: recipientId, username: recipient.username });

        if (sender.balance < amount) {
            return message.channel.send('You don\'t have enough balance to send this amount.');
        }

        // Deduct amount from sender and add to recipient
        sender.balance -= amount;
        recipientUser.balance += amount;

        // Save updated user data
        await sender.save();
        await recipientUser.save();

        return message.channel.send(`Successfully sent 💰 ${amount} to ${recipient.username}.`);
    },
};
