module.exports = {
    name: 'color',
    description: 'Get a color code. Usage: ?color [hex]',
    execute(message, args) {
        const color = args[0] || `#${Math.floor(Math.random()*16777215).toString(16)}`;
        message.channel.send(`Here is your color: ${color}`);
    }
};
