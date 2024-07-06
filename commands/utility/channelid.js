const { SlashCommandBuilder } = require("discord.js");

//module.exports is how you export data in Node.js so that you can require() it in other files.
//If you need to access your client instance from inside a command file, you can access it via interaction.client.
//If you need to access external files, packages, etc., you should require() them at the top of the file.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('channelid')
		.setDescription('Retrieves the current channel\'s ID'),
	async execute(interaction) { //execute function is the "reaction" to the command being called.
		await interaction.reply({ content: `The current channel's ID is ${interaction.channelId}`, ephemeral: true });
	},
};
