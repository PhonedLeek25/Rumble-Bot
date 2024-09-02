const { RoleID } = require("../../global_variables/RoleID.js");
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

        const FeedbackInputField = new TextInputBuilder()
            .setCustomId('actualfeedback')
            .setLabel("Feedback")
            .setStyle(TextInputStyle.Paragraph);

        const ActionRow1 = new ActionRowBuilder().addComponents(RumbleOrThndrInputField);
        const ActionRow2 = new ActionRowBuilder().addComponents(FeedbackInputField);
        mymodal.addComponents(ActionRow1, ActionRow2);
        await interaction.showModal(mymodal);
        const filter = (interaction) => interaction.customId == 'feedbackModalSubmission';
        //wait for modal submission 

        interaction
            .awaitModalSubmit({ filter, time: 120_000 }) //wait 2 minutes
            .then((modalInteraction) => {
                const RumbleOrThndrValue = modalInteraction.fields.getInputValue('rumbleorthndr');
                const FeedbackInputValue = modalInteraction.fields.getInputValue('actualfeedback');
                const message = `You're Feeback for ${RumbleOrThndrValue} is: \n${FeedbackInputValue}`;
                //modalInteraction.user.send(message);
                modalInteraction.reply(message);
            })
    },
};
