const User = require('../models/User');
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    name: 'my',
    description: 'Show your position in the top rich list.',
    async execute(message) {
        try {
            const users = await User.find().sort({ balance: -1 });
            const userId = message.author.id;
            const userIndex = users.findIndex(user => user.userId === userId);

            if (userIndex === -1) {
                return message.channel.send('You are not in the top rich list.');
            }

            // Position is 1-based index, so add 1 to the 0-based index
            const userPosition = userIndex + 1;

            // Create embed for user position
            const positionEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle('Your Position in Top Rich List')
                .setDescription(`You are ranked #${userPosition} in the top rich list!`)
                .setTimestamp();

            message.channel.send({ embeds: [positionEmbed] });
        } catch (error) {
            console.error('Error fetching user position:', error);
            message.channel.send('An error occurred while fetching your position.');
        }
    },
};
