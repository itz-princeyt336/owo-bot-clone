module.exports = {
    name: 'guildlink',
    description: 'Get a link to join the bot\'s support or community server.',
    execute(message) {
        const guildLink = 'https://discord.gg/zPjH55uCYt'; // Replace with your server's invite link
        message.channel.send(`Join our community server using this link: [Join Here](${guildLink})`);
    }
};
