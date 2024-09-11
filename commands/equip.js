const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User'); // Ensure the correct path

const weapons = ['Sword', 'Bow', 'Axe', 'Dagger']; // List of possible weapons

module.exports = {
    name: 'equip',
    description: 'Equip a weapon to your animal!',
    async execute(message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ userId });

        if (!user) {
            return message.reply('You do not have an account.');
        }

        const weaponName = args.join(' ');
        if (!weapons.includes(weaponName)) {
            return message.reply('Invalid weapon. Please provide a valid weapon from the list: ' + weapons.join(', '));
        }

        if (!user.inventory || !user.inventory.common || !user.inventory.common.some(item => item.name === weaponName)) {
            return message.reply('You do not have this weapon in your inventory.');
        }

        user.equippedWeapon = weaponName;
        await user.save();

        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username} equipped a weapon!`)
            .setDescription(`You have equipped a ${weaponName} to your animal.`)
            .setColor(Colors.Blue);

        message.channel.send({ embeds: [embed] });
    }
};
