const { SlashCommandBuilder } = require('discord.js');
const { scheduledAnnounce, current_events } = require('../../private_containers/scheduledAnnounce.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scheduled_events')
        .setDescription('get current list of working/scheduled events recognized by Rumble bot'),
    async execute(interaction) {
        const message =
            `${current_events}`;
        await interaction.reply(message);
    },
};