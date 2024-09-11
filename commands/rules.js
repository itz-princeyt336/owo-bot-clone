const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rules',
    description: 'Displays the server rules.',
    execute(message, args) {
        const rulesEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Failure to follow these rules will result in a ban and/or account reset!')
            .setDescription(
                `• Any actions performed to gain an unfair advantage over other users are explicitly against the rules. This includes but is not limited to:\n` +
                `├> Using macros/scripts for any commands\n` +
                `└> Using multiple accounts for any reason\n\n` +
                `• Do not use any exploits and report any found in the bot.\n\n` +
                `• You cannot sell/trade money or any bot goods for anything outside of the bot.\n\n` +
                `• If you have any questions, come ask us in our server!\n\n` +
                `[Privacy Policy](https://discord.com/privacy) - [Terms of Service](https://discord.com/terms)\n\n` +
                `Infinity what's this? You already agreed to these rules! <3`
            )
            .setFooter({ text: '10,000 Users agreed' });

        message.channel.send({ embeds: [rulesEmbed] });
    },
};
