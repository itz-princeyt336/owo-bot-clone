// commands/uptime.js
module.exports = {
    name: 'uptime',
    description: 'Displays the bot\'s uptime',
    execute(message) {
        const totalSeconds = (message.client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

        const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        message.channel.send(`🕒 Uptime: ${uptime}`);
    },
};
