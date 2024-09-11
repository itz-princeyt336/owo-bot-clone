// commands/blackjack.js
const User = require('../models/User');
const { EmbedBuilder } = require('discord.js');

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck() {
    let deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }
    return deck;
}

function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;

    for (const card of hand) {
        if (['J', 'Q', 'K'].includes(card.rank)) {
            score += 10;
        } else if (card.rank === 'A') {
            aceCount++;
            score += 11;
        } else {
            score += parseInt(card.rank, 10);
        }
    }

    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    return score;
}

module.exports = {
    name: 'blackjack',
    description: 'Play a game of blackjack',
    args: true,
    usage: '<bet-amount>',
    async execute(message, args) {
        const userId = message.author.id;
        const betAmount = parseInt(args[0], 10);

        // Validate bet amount
        if (isNaN(betAmount) || betAmount <= 0) {
            return message.channel.send('Invalid bet amount. Use `?blackjack <bet-amount>`');
        }

        // Load user data
        let user = await User.findOne({ userId });
        if (!user) {
            return message.channel.send('User data not found.');
        }

        if (user.balance < betAmount) {
            return message.channel.send('Insufficient balance for this bet.');
        }

        // Initialize deck and hands
        let deck = createDeck();
        deck = deck.sort(() => Math.random() - 0.5); // Shuffle deck

        const playerHand = [deck.pop(), deck.pop()];
        const dealerHand = [deck.pop(), deck.pop()];

        // Calculate scores
        const playerScore = calculateScore(playerHand);
        const dealerScore = calculateScore(dealerHand);

        // Check for blackjack
        const isBlackjack = playerScore === 21;
        if (isBlackjack) {
            user.balance += betAmount * 1.5; // 1.5x payout for blackjack
            await user.save();

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Blackjack!')
                .setDescription(`You won 💰 ${betAmount * 1.5} with a Blackjack!`)
                .addFields(
                    { name: 'Your Hand', value: `${playerHand.map(card => `${card.rank} of ${card.suit}`).join(', ')}`, inline: true },
                    { name: 'Dealer\'s Hand', value: `${dealerHand.map(card => `${card.rank} of ${card.suit}`).join(', ')}`, inline: true }
                )
                .setTimestamp();

            return message.channel.send({ embeds: [embed] });
        }

        // Show initial hands
        const embed = new EmbedBuilder()
            .setColor('#FFFF00')
            .setTitle('Blackjack')
            .setDescription(`Your Hand: ${playerHand.map(card => `${card.rank} of ${card.suit}`).join(', ')}\nDealer's Hand: ${dealerHand[0].rank} of ${dealerHand[0].suit} and [Hidden]`)
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });

        // Handle user's turn
        const filter = response => response.author.id === userId && ['hit', 'stand'].includes(response.content.toLowerCase());
        const collector = message.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', async (response) => {
            if (response.content.toLowerCase() === 'hit') {
                playerHand.push(deck.pop());
                const newPlayerScore = calculateScore(playerHand);

                if (newPlayerScore > 21) {
                    user.balance -= betAmount;
                    await user.save();

                    const bustEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Busted!')
                        .setDescription(`You busted with a score of ${newPlayerScore}. You lost 💰 ${betAmount}.`)
                        .addFields(
                            { name: 'Your Hand', value: `${playerHand.map(card => `${card.rank} of ${card.suit}`).join(', ')}`, inline: true }
                        )
                        .setTimestamp();

                    collector.stop();
                    return message.channel.send({ embeds: [bustEmbed] });
                }

                // Update hand
                const updateEmbed = new EmbedBuilder()
                    .setColor('#FFFF00')
                    .setTitle('Blackjack - Hit')
                    .setDescription(`Your Hand: ${playerHand.map(card => `${card.rank} of ${card.suit}`).join(', ')}`)
                    .setTimestamp();

                await message.channel.send({ embeds: [updateEmbed] });
            } else if (response.content.toLowerCase() === 'stand') {
                collector.stop();
            }
        });

        collector.on('end', async () => {
            // Dealer's turn
            let dealerHandFinal = [...dealerHand];
            let dealerScoreFinal = calculateScore(dealerHandFinal);

            while (dealerScoreFinal < 17) {
                dealerHandFinal.push(deck.pop());
                dealerScoreFinal = calculateScore(dealerHandFinal);
            }

            // Determine outcome
            let result;
            if (dealerScoreFinal > 21 || playerScore > dealerScoreFinal) {
                user.balance += betAmount;
                result = `You won 💰 ${betAmount}!`;
            } else if (playerScore < dealerScoreFinal) {
                user.balance -= betAmount;
                result = `You lost 💰 ${betAmount}.`;
            } else {
                result = `It's a tie!`;
            }

            await user.save();

            const resultEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Blackjack Result')
                .setDescription(`${result}`)
                .addFields(
                    { name: 'Your Hand', value: `${playerHand.map(card => `${card.rank} of ${card.suit}`).join(', ')}`, inline: true },
                    { name: 'Dealer\'s Hand', value: `${dealerHandFinal.map(card => `${card.rank} of ${card.suit}`).join(', ')}`, inline: true }
                )
                .setTimestamp();

            message.channel.send({ embeds: [resultEmbed] });
        });
    },
};
