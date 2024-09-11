const { EmbedBuilder, Colors } = require('discord.js');

const animals = ['Wolf', 'Lion', 'Tiger', 'Bear', 'Eagle', 'Shark'];

module.exports = {
    name: 'dex',
    description: 'Show all animals in the dex!',
    execute(message, args) {
        const embed = new EmbedBuilder()
            .setTitle('Dex - Animal Collection')
            .setDescription(animals.join(', '))
            .setColor(Colors.Blue);

        message.channel.send({ embeds: [embed] });
    }
};
