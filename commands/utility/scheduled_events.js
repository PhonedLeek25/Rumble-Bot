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

        await interaction.reply("# Current Scheduled Events:");
        for (let x = 0; x < current_events.length; x++) {
            await interaction.followUp(JSON.stringify(current_events[x]));
        }
    },
};