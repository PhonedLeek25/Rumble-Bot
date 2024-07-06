const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('customcommand')
        .setDescription('Use a predefined custom command'),
    async execute(interaction)
    {
        await interaction.reply('Running custom command!');
    }
}