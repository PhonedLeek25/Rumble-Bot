const { RoleID } = require("../../global_variables/RoleID.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('assign_all')
		.setDescription('Assigns all non bot Server members with a predefined role ID'),
	async execute(interaction) {
		//Permission Check
		if (!interaction.member.roles.cache.has(RoleID.administrator)) {
			interaction.reply({ content: "This command can only be used by Administrators!", ephemeral: true });
			return;
		}
		await interaction.deferReply({ ephemeral: false });
		const members = await interaction.guild.members.fetch(); // Fetch all members
		const nonBotMembers = members.filter(member => !member.user.bot);

		let counter = 1;
		for (const member of nonBotMembers.values()) {
			await member.roles.add(RoleID.member).catch(console.error);
			await interaction.editReply({ content: `applied to ${counter} members`, ephemeral: false });
			counter++;
		}

		await interaction.followUp({ content: "Done!", ephemeral: true });
	},
};
