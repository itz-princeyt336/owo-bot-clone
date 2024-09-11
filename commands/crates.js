const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User'); // Ensure the correct path

const weapons = ['Sword', 'Bow', 'Axe', 'Dagger'];
const weaponProbability = 0.4; // 40% chance to get a weapon
const coinAmount = [100, 200, 300]; // Possible coin rewards

module.exports = {
    name: 'crates',
    description: 'Open a crate to get a reward!',
    async execute(message) {
        const userId = message.author.id;
        const user = await User.findOne({ userId });

        if (!user || user.crates === 0) {
            return message.reply('You do not have any crates to open.');
        }

        user.crates -= 1;
        await user.save();

        const isWeapon = Math.random() < weaponProbability;
        const reward = isWeapon
            ? weapons[Math.floor(Math.random() * weapons.length)]
            : `${coinAmount[Math.floor(Math.random() * coinAmount.length)]} coins`;

        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username} opened a crate!`)
            .setDescription(`You received: ${reward}`)
            .setColor(isWeapon ? Colors.Gold : Colors.Green);

        message.channel.send({ embeds: [embed] });
    }
};
