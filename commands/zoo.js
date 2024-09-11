const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User');

module.exports = {
    name: 'zoo',
    description: 'Show your collection of animals!',
    async execute(message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ userId });

        if (!user) {
            return message.reply('You do not have an account.');
        }

        const zooAnimals = user.zoo.length > 0 ? user.zoo.join(', ') : 'No animals in your zoo.';
        
        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username}'s Zoo`)
            .setDescription(zooAnimals)
            .setColor(Colors.Blue);

        message.channel.send({ embeds: [embed] });
    }
};
