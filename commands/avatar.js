// commands/avatar.js
module.exports = {
    name: 'avatar',
    description: 'Show the avatar of the mentioned user or your own avatar',
    async execute(message) {
        const user = message.mentions.users.first() || message.author;
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        message.channel.send({
            embeds: [
                {
                    title: `${user.username}'s Avatar`,
                    image: { url: avatarURL },
                    color: 0x00FF00
                }
            ]
        });
    }
};
