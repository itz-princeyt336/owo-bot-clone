const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User'); // Ensure the correct path

module.exports = {
    name: 'addweapon',
    description: 'Add a weapon to your inventory!',
    async execute(message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ userId });

        if (!user) {
            return message.reply('You do not have an account.');
        }

        const weapon = args[0]; // Assume weapon is passed as the first argument

        if (!weapon) {
            return message.reply('Please specify a weapon to add.');
        }

        // Add the weapon to the user's inventory
        if (!user.weapons.includes(weapon)) {
            user.weapons.push(weapon);
            await user.save();
            
            const embed = new EmbedBuilder()
                .setTitle('Weapon Added!')
                .setDescription(`You have successfully added **${weapon}** to your inventory.`)
                .setColor(Colors.Green);

            message.channel.send({ embeds: [embed] });
        } else {
            message.reply('You already have this weapon in your inventory.');
        }
    }
};
