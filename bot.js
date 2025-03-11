const { Telegraf } = require('telegraf');

const bot = new Telegraf('7528856660:AAGgc-XvAWyOMbfBfqgc4Ba1kvX5G8ADBO8');

bot.start((ctx) => {
    console.log(`New user: ${ctx.from.username || ctx.from.first_name}`);
    ctx.reply('Welcome to PipCore! \n\nTrack your trades with precision, gain insights, and level up your strategy. Let’s make every pip count!');
});

// Log all messages to check if the bot receives them
bot.on('message', (ctx) => {
    console.log(`Received message: ${ctx.message.text}`);
});

bot.launch();
console.log('PipCore Bot is running...');
