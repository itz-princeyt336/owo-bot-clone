const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'define',
    description: 'Get the definition of a word.',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply('Please provide a word to define.');
        }

        const word = args.join(' ');
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            if (data[0] && data[0].meanings && data[0].meanings[0].definitions[0]) {
                const definition = data[0].meanings[0].definitions[0].definition;

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`Definition of ${word}`)
                    .setDescription(definition)
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });
            } else {
                message.reply('No definition found for that word.');
            }
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while fetching the definition.');
        }
    },
};
