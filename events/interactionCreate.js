const { Events } = require('discord.js');
const { initHeapProfiler } = require('next/dist/build/swc');

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const UNDERLINE = "\x1b[4m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const WHITE = "\x1b[37m";

module.exports = {
	name: Events.InteractionCreate, //sets what event this file is for.
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			console.log(`Command Name: ${interaction.commandName.toString()}`)
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
		else if (interaction.isButton()) {
			console.log(`Button Interaction Recieved`)

		}
		else if (interaction.isStringSelectMenu()) {
			console.log(`String Select Menu Interaction Recieved`)

		}
		else if (interaction.isModalSubmit()) {
			console.log("Modal submission recieved, Custom ID: " + interaction.customId);
			if (interaction.customId == "EmailAuthenticationModal") {
				try {
					const { authenticateReplytoModal } = require('../commands/user-control/authenticateReplytoModal.js');
					authenticateReplytoModal(interaction);
				}
				catch (error) {
					console.error(error);
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
					} else {
						await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
					}
				}
			}
		}
		else {
			console.log("interaction isn't a ChatInputCommand :(")
			return;
		}
	},
};