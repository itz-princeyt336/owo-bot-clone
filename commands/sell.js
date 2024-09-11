const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User'); // Ensure the correct path

const animalPrices = {
    'Wolf': 200,
    'Lion': 400,
    'Tiger': 300,
    'Bear': 350,
    'Eagle': 250,
    'Shark': 500
};

module.exports = {
    name: 'sell',
    description: 'Sell an animal from your zoo!',
    async execute(message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ userId });

        if (!user) {
            return message.reply('You do not have an account.');
        }

        if (!user.zoo || user.zoo.length === 0) {
            return message.reply('You do not have any animals to sell.');
        }

        const animalToSell = args[0];
        if (!animalToSell || !user.zoo.includes(animalToSell)) {
            return message.reply(`You do not have a ${animalToSell} in your zoo.`);
        }

        user.zoo = user.zoo.filter(animal => animal !== animalToSell); // Remove the animal
        const sellPrice = animalPrices[animalToSell] / 2; // Half of the animal’s price
        user.balance += sellPrice;
        await user.save();

        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username} sold a ${animalToSell}`)
            .setDescription(`You earned ${sellPrice} coins!`)
            .setColor(Colors.Yellow);

        message.channel.send({ embeds: [embed] });
    }
};
