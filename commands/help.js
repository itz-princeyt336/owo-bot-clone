// commands/help.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands',
    execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Command List')
            .setDescription('Here is the list of commands!\nUse my commands like `?{commandName}`')
            .addFields(
                { name: '📊 Rankings', value: '`top` `my`', inline: false },
                { name: '💰 Economy', value: '`daily` `work` `beg` `balance` `give` `bank` `withdraw` `deposit`', inline: false },
                { name: '🌱 Animals', value: '`zoo` `hunt` `sell` `sacrifice` `battle` `inv` `autohunt` `dex` `addweapon` `equip` `loobox` `crates`', inline: false },
                { name: '🎲 Gambling', value: '`coinflip` `lottery` `blackjack` `slots`', inline: false },
                { name: '🎱 Fun', value: '`8b` `define` `roll` `choose` `translate` `bell`', inline: false },
                { name: '✨ Social', value: '`curse` `pray` `ship` `cookie` `marry` `emoji` `profile` `level` `avatar`', inline: false },
                { name: '🙂 Emotes', value: '`blush` `cry` `dance` `lewd` `pout` `shrug` `sleepy` `smile` `smug` `thumbsup` `wag` `thinking` `triggered` `teehee` `deredere` `thonking` `scoff` `happy` `thumbs` `grin`', inline: false },
                { name: '🤗 Actions', value: '`cuddle` `hug` `kiss` `lick` `nom` `pat` `poke` `slap` `stare` `highfive` `bite` `greet` `punch` `handholding` `tickle` `kill` `hold` `pats` `wave` `boop` `snuggle` `bully`', inline: false },
                { name: '🔧 Utility', value: '`ping` `stats` `help` `uptime` `rules` `color` `math` `link` `guildlink` `suggest` `prefix`', inline: false },
            )
            .setTimestamp()
            .setFooter({ text: 'Infinity', iconURL: message.client.user.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    },
};
