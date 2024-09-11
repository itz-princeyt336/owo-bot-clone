const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User'); // Ensure the correct path

module.exports = {
    name: 'inv',
    description: 'Show your inventory!',
    async execute(message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ userId });

        if (!user) {
            return message.reply('You do not have an account.');
        }

        const zooAnimals = user.zoo && user.zoo.length > 0 ? user.zoo.join(', ') : 'No animals.';
        const weapons = user.inventory && user.inventory.common ? user.inventory.common.map(item => item.name).join(', ') : 'No weapons equipped';

        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username}'s Inventory`)
            .setDescription(`**Animals:**\n${zooAnimals}\n\n**Weapons:**\n${weapons}`)
            .setColor(Colors.Purple);

        message.channel.send({ embeds: [embed] });
    }
};
