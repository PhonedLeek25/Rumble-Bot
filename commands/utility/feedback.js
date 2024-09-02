const { RoleID } = require("../../public_containers/RoleID.js");
const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Submits feedback via Slack integration'),
    async execute(interaction) {
        //Permission Check
        if (!interaction.member.roles.cache.has(RoleID.staff || RoleID.moderator)) {
            interaction.reply({ content: "This command can only be used by Administrators!", ephemeral: true });
            return;
        }
        //await interaction.deferReply({ ephemeral: true });
        const mymodal = new ModalBuilder()
            .setCustomId('feedbackModalSubmission')
            .setTitle('Submit Feedback to Slack');
        const RumbleOrThndrInputField = new TextInputBuilder()
            .setCustomId('rumbleorthndr')
            .setLabel("Rumble or Thndr feedback?")
            .setStyle(TextInputStyle.Short);
        const ActionRow1 = new ActionRowBuilder().addComponents(RumbleOrThndrInputField);
        mymodal.addComponents(ActionRow1);

        const FeedbackInputField = new TextInputBuilder()
            .setCustomId('feedback')
            .setLabel("Feedback")
            .setStyle(TextInputStyle.Paragraph);
        const ActionRow2 = new ActionRowBuilder().addComponents(FeedbackInputField);
        mymodal.addComponents(ActionRow2);

        await interaction.showModal(mymodal);
    },
};
