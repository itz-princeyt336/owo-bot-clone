// commands/translate.js
const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: 'translate',
    description: 'Translate text to a specified language',
    async execute(message, args) {
        const language = args[0];
        const text = args.slice(1).join(' ');

        if (!language || !text) {
            return message.reply('Please provide a language code and text to translate.');
        }

        try {
            const res = await translate(text, { to: language });
            message.channel.send({
                embeds: [
                    {
                        title: 'Translation',
                        fields: [
                            { name: 'Original', value: text },
                            { name: 'Translated', value: res.text }
                        ],
                        color: 0x00FF00
                    }
                ]
            });
        } catch (error) {
            message.reply('There was an error translating the text.');
            console.error(error);
        }
    }
};
