const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User');

module.exports = {
    name: 'sacrifice',
    description: 'Sacrifice an animal for special rewards!',
    async execute(message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ userId });

        if (!user || user.zoo.length === 0) {
            return message.reply('You do not have any animals to sacrifice.');
        }

        const animalToSacrifice = args[0];
        const animalIndex = user.zoo.indexOf(animalToSacrifice);

        if (animalIndex === -1) {
            return message.reply(`You do not have a ${animalToSacrifice} in your zoo.`);
        }

        user.zoo.splice(animalIndex, 1); // Remove the animal
        user.specialPoints = (user.specialPoints || 0) + 10; // Gain special points for sacrifices
        await user.save();

        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username} sacrificed a ${animalToSacrifice}`)
            .setDescription(`You gained 10 special points!`)
            .setColor(Colors.Red);

        message.channel.send({ embeds: [embed] });
    }
};
