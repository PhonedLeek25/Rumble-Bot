const { SlashCommandBuilder } = require('discord.js');
const { scheduledAnnounce, current_events } = require('../../private_containers/scheduledAnnounce.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scheduled_events')
        .setDescription('get current list of working/scheduled events recognized by Rumble bot'),
    async execute(interaction) {
        if (current_events.length == 0) {
            await interaction.reply("No current events in memory.");
            return;
        }
        for (let x = 0; x < current_events.length; x++) {
            const message = `${current_events[x]}`;
            await interaction.reply(message);
        }
        await interaction.reply(current_events.entries());
    },
};