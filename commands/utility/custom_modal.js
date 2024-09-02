const { RoleID } = require("../../public_containers/RoleID.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom_modal')
        .setDescription('Assigns all non bot Server members with a predefined role ID'),
    async execute(interaction) {
        //Permission Check
        if (!interaction.member.roles.cache.has(RoleID.administrator)) {
            interaction.reply({ content: "This command can only be used by Administrators!", ephemeral: true });
            return;
        }
        const modal1 = new ModalBuilder()
            .setCustomId('EmailAuthenticationModal')
            .setTitle('Email Authentication');
        /*
        // Add components to modal

        // Create the text input components
        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('favoriteColorInput')
            // The label is the prompt the user sees for this input
            .setLabel("What's your favorite color?")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const hobbiesInput = new TextInputBuilder()
            .setCustomId('hobbiesInput')
            .setLabel("What's some of your favorite hobbies?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);
        // Show the modal to the user
        await interaction.showModal(modal);*/
        const emailInputField = new TextInputBuilder()
            .setCustomId('emailInput')
            .setLabel("Please enter your Rumble email")
            .setStyle(TextInputStyle.Short);
        const ActionRow1 = new ActionRowBuilder().addComponents(emailInputField);
        modal1.addComponents(ActionRow1);
        await interaction.showModal(modal1);
    },
};
