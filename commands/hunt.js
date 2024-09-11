const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User'); // Ensure the correct path

module.exports = {
    name: 'hunt',
    description: 'Hunt for animals using coins!',
    async execute(message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ userId });

        if (!user) {
            return message.reply('You do not have an account.');
        }

        const amount = parseInt(args[0], 10);
        if (isNaN(amount) || amount < 100) {
            return message.reply('You must spend at least 100 coins to hunt.');
        }

        if (user.balance < amount) {
            return message.reply('You do not have enough coins.');
        }

        user.balance -= amount;
        await user.save();

        const animals = ['Wolf', 'Lion', 'Tiger', 'Bear', 'Eagle', 'Shark'];
        const numberOfAnimals = Math.floor(Math.random() * 2) + 1; // 1 or 2 animals

        let caughtAnimals = [];
        for (let i = 0; i < numberOfAnimals; i++) {
            caughtAnimals.push(animals[Math.floor(Math.random() * animals.length)]);
        }

        user.zoo = user.zoo || [];
        user.zoo.push(...caughtAnimals);
        await user.save();

        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username} went hunting!`)
            .setDescription(`You spent ${amount} coins and caught: ${caughtAnimals.join(', ')}`)
            .setColor(Colors.Green);

        message.channel.send({ embeds: [embed] });
    }
};
