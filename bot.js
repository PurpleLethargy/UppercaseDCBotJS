const { Client, GatewayIntentBits, REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [
        {
          name: 'up',
          description: 'Converts your text to uppercase.',
          type: 1,
          options: [
            {
              name: 'text',
              type: ApplicationCommandOptionType.String,
              description: 'The text you want to convert to uppercase.',
              required: true,
            },
          ],
        },
      ],
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

client.once('ready', () => {
  console.log(`${client.user.tag} has connected to Discord!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'up') {
    const text = interaction.options.getString('text');
    if (text) {
      await interaction.reply(text.toUpperCase());
    } else {
      await interaction.reply('Please provide some text to convert.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
