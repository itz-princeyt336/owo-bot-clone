// commands/stats.js
const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'stats',
    description: 'Displays the bot\'s statistics',
    execute(message) {
        const totalSeconds = (message.client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

        const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        const cpuUsage = os.loadavg();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot Statistics')
            .addFields(
                { name: '🕒 Uptime', value: uptime, inline: true },
                { name: '💾 Memory Usage', value: `${memoryUsage.toFixed(2)} MB`, inline: true },
                { name: '🖥️ CPU Load', value: cpuUsage.map(load => load.toFixed(2)).join(', '), inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Bot Stats', iconURL: message.client.user.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    },
};
