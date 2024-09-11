// commands/bell.js
module.exports = {
    name: 'bell',
    description: 'Ring a bell sound',
    async execute(message) {
        const bellSoundURL = 'https://www.soundjay.com/button/sounds/button-3.mp3'; // Replace with your desired sound URL

        message.channel.send({
            embeds: [
                {
                    title: '🔔 Bell Sound',
                    description: '[Click to ring the bell!](https://www.soundjay.com/button/sounds/button-3.mp3)',
                    color: 0x00FF00
                }
            ]
        });

        // Optionally, if you want to attach the sound directly:
        // message.channel.send({ files: [bellSoundURL] });
    }
};
