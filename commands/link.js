module.exports = {
    name: 'link',
    description: 'Get an invite link to add the bot to your server.',
    execute(message) {
        const inviteLink = 'https://discord.com/oauth2/authorize?client_id=1271759813487104080'; // Replace with your bot's invite link
        message.channel.send(`You can invite me to your server using this link: [Invite Here](${inviteLink})`);
    }
};
