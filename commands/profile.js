const User = require('../models/User');
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'Show your profile',
    async execute(message) {
        try {
            const user = await User.findOne({ userId: message.author.id });

            if (!user) {
                return message.channel.send('Your profile does not exist.');
            }

            const spouse = user.marriedTo ? `<@${user.marriedTo}>` : 'None';

            const embed = new EmbedBuilder()
                .setTitle(`${message.author.username}'s Profile`)
                .addFields(
                    { name: 'Balance', value: `💰 ${user.balance}`, inline: true },
                    { name: 'Married To', value: spouse, inline: true },
                    { name: 'Level', value: `${user.level}`, inline: true }
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setColor(Colors.Green);

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            message.channel.send('An error occurred while fetching your profile.');
        }
    }
};
