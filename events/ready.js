const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady, //name states which event this file is for
	once: true, //once property holds a boolean value that specifies if the event should run only once.
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};