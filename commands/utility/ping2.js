//Example from: https://discordjs.guide/creating-your-bot/slash-commands
const { SlashCommandBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout; //to be able to wait.

//module.exports is how you export data in Node.js so that you can require() it in other files.
//If you need to access your client instance from inside a command file, you can access it via interaction.client.
//If you need to access external files, packages, etc., you should require() them at the top of the file.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping2')
		.setDescription('Replies with Pong!'),
	async execute(interaction) { //execute function is the "reaction" to the command being called.
		await interaction.deferReply({ ephemeral: true }); //await interaction.deferReply();
		await wait(4_000);
		await interaction.editReply('Pong!');
        await interaction.followUp('RePonged!')
        //Note that if you use followUp() after a deferReply(), the first follow-up will edit the "<app> is thinking message" rather than sending a new one.
	},
};
