// commands/ping.js
module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    execute(message) {
        const latency = Date.now() - message.createdTimestamp;
        message.channel.send(`🏓 Pong! Latency is ${latency}ms.`);
    },
};
