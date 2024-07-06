const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
async function authenticateReplytoModal(interaction) {
    //interaction.deferReply();
    const modal2 = new ModalBuilder()
        .setCustomId('OTPModal')
        .setTitle('Email Authentication');
    const OTPInputField = new TextInputBuilder()
        .setCustomId('OTPInput')
        .setLabel("You've been emailed an OTP, please input it:")
        .setStyle(TextInputStyle.Short);
    const ActionRow2 = new ActionRowBuilder().addComponents(OTPInputField);
    modal2.addComponents(ActionRow2)
    await interaction.showModal(modal2);
    //await interaction.reply(modal2);
}

module.exports = { authenticateReplytoModal };