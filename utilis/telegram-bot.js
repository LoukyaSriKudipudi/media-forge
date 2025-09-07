require('dotenv').config();
const { Telegraf } = require('telegraf');
const chalk = require('chalk');

const token = process.env.BOT_TOKEN;

if (!token) {
  console.log(chalk.red.bold(' --- BOT_TOKEN is missing in .env ---'));
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  console.log(ctx.from);
  ctx.reply(`Welcome! ${ctx.from.first_name}`);
});

// bot.on('message', async (ctx) => {
//   await ctx.telegram.sendMessage(process.env.GROUP_ID, 'Hello', {
//     message_thread_id: process.env.TOPIC_ID,
//   });
// });

try {
  bot.launch();
  console.log(
    chalk.blueBright.bgWhiteBright.bold(
      `-----------------------------------\n--------- Bot is running ----------\n-----------------------------------`
    )
  );
} catch (err) {
  console.log(
    chalk.red.bgWhiteBright.bold(` --- Bot Error: ${err.message} ---`)
  );
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
