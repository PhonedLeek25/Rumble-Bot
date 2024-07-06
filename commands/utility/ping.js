//Example from: https://discordjs.guide/creating-your-bot/slash-commands
const { SlashCommandBuilder } = require("discord.js");

//module.exports is how you export data in Node.js so that you can require() it in other files.
//If you need to access your client instance from inside a command file, you can access it via interaction.client.
//If you need to access external files, packages, etc., you should require() them at the top of the file.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) { //execute function is the "reaction" to the command being called.
		await interaction.reply('Pong!'); //Other methods of replying: https://discordjs.guide/slash-commands/response-methods

		//await interaction.deleteReply(); //unecessary
		const msg = await interaction.fetchReply();
		//console.log(msg);
		msg.react('🏓')
		msg.react('1245042556832845884') //react to a message, then copy link of emoji and extract emoji ID
		msg.react('1245042594057158756')
		//other worse methods that might be useful some time: https://discordjs.guide/popular-topics/reactions.html#custom-emojis

	},
};
