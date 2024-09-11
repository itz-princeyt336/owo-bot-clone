const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'emoji',
    description: 'Show a list of all custom emojis with their names and IDs.',
    async execute(message) {
        // Fetch all emojis from the guild
        const emojis = message.guild.emojis.cache;

        if (emojis.size === 0) {
            return message.channel.send('This server has no custom emojis.');
        }

        // Create an embed to list all emojis
        const embed = new EmbedBuilder()
            .setTitle('Custom Emojis')
            .setColor(0x00AE86);

        let description = '';
        emojis.forEach(emoji => {
            description += `${emoji} : \`<:${emoji.name}:${emoji.id}>\`\n`;
        });

        embed.setDescription(description);

        // Send the embed message
        message.channel.send({ embeds: [embed] });
    }
};
