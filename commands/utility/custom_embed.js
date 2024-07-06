//https://discordjs.guide/popular-topics/embeds
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom_embed')
        .setDescription('Use a predefined custom embed!'),
    async execute(interaction)
    {
        //await interaction.reply('Running custom command!');

        const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF) //accepts integer, HEX color string, an array of RGB values or specific color strings
    //colorss
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
    //To add a blank field to the embed, you can use .addFields({ name: '\u200b', value: '\u200b' }).
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        await interaction.channel.send({ embeds: [exampleEmbed] });
    }
}