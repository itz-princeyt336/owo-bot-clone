module.exports = {
    name: 'math',
    description: 'Perform a basic math operation. Usage: ?math 2 + 2',
    execute(message, args) {
        try {
            const result = eval(args.join(' '));
            message.channel.send(`Result: ${result}`);
        } catch (error) {
            message.channel.send('Invalid math operation.');
        }
    }
};
