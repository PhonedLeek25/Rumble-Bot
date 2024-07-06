const { SlashCommandBuilder } = require("discord.js");
const { RefreshUsers } = require('./RefreshUsers.js');

//module.exports is how you export data in Node.js so that you can require() it in other files.
//If you need to access your client instance from inside a command file, you can access it via interaction.client.
//If you need to access external files, packages, etc., you should require() them at the top of the file.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('refresh-users')
        .setDescription('Rechecks all users to make sure they are subscribed to Rumble.'),
    async execute(interaction) { //execute function is the "reaction" to the command being called.
        await interaction.deferReply();
        RefreshUsers();
        await interaction.followUp({ content: "Successfully refreshed subscribed users.", ephermal: true });
    },
};
