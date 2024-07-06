const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('authenticate')
        .setDescription('Registers your Rumble email to your discord account and gain access to the Rumble discord community'),
    async execute(interaction) { //execute function is the "reaction" to the command being called.
        // Create the modal
        await interaction.reply({ content: "This feature is not currently enabled", ephermal: true });
        return;
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
