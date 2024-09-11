module.exports = {
    name: 'suggest',
    description: 'Send a suggestion for the bot.',
    execute(message, args) {
        const suggestion = args.join(' ');
        if (!suggestion) {
            return message.channel.send('Please provide a suggestion.');
        }

        // You can log this suggestion somewhere or send it to a specific channel
        const suggestionChannelId = '1279014093491277975'; // Replace with your suggestion channel ID
        const suggestionChannel = message.client.channels.cache.get(suggestionChannelId);
        if (suggestionChannel) {
            suggestionChannel.send(`New suggestion from ${message.author}: ${suggestion}`);
        }

        message.channel.send('Thank you for your suggestion!');
    }
};
