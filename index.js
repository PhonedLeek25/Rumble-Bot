require("dotenv").config();
const DISCORD_TOKEN = process.env;
const fs = require("node:fs"); //NODE.JS's Native File System (choose directory/file navigation)
const path = require("node:path"); //Node.js's Native Pathing Utility Module. helps construct paths to files and directories & automatically detects OS.
const { UpvoteContainer, OnNewMessage } = require("./commands/upvoting/UpvoteContainer.js"); //Fetch UpvoteContainer
const { color } = require("./public_containers/color.js");

//import { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, Collection} from 'discord.js';
const { Client, GatewayIntentBits, Collection, Events, ActivityType, PresenceUpdateStatus, EmbedBuilder, managerToFetchingStrategyOptions, GuildDefaultMessageNotifications } = require("discord.js");
//DECLARE CLIENT ==> Includes: Intents.
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers
	],
});

//Load Slash Command List, documentation: https://discordjs.guide/creating-your-bot/command-handling.html#loading-command-files
client.commands = new Collection(); //attaching a new ".commands" property to our client to easily access commands in other files.

const foldersPath = path.join(__dirname, "commands"); //construct a path to our commands directory
const commandFolders = fs.readdirSync(foldersPath); //readdirSync reads files and directories in the given path

const filesToSkip = ["UpvoteContainer.js", "RefreshUsers.js", "authenticateReplytoModal.js"];
let skipfile = false;
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js")); //get all .js files
	for (const file of commandFiles) {
		//files to skip Omar protocole - START
		skipfile = false;
		for (const noread of filesToSkip) {
			if (noread == file) {
				skipfile = true;
				break;
			}
		}
		if (skipfile == true) {
			continue;
		}
		//files to skip Omar protocole - END
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		//For each file being loaded, check that it has at least the data and execute properties.
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command); //dynamically set each command into the client.commands Collection.
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a requicolor.RED "data" or "execute" property.`
			);
			//This helps to prevent errors resulting from loading empty, unfinished, or otherwise incorrect command files while you're still developing
		}
	}
}

//Load Event List
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

/* //Recieving slash commands interactions --> Migrated to ./events/interactionCreate.js
//You will receive an interaction for every slash command executed.
//To respond, you need to create a listener for the Client#interactionCreate event that will execute code when your application receives an interaction. 
client.on(Events.InteractionCreate, async interaction => { 
	//async before the method means that the function will either return (promise) a value or an error (why promise failed)
	if (!interaction.isChatInputCommand()) return; //return if interaction is not a Command (the "isChatInputCommand" boolean).
	console.log("Interaction received by " + interaction.user.displayName.toString() + ": " + interaction.commandName.toString());

	//COMMAND HANDLING STEP 3: Executing Commands
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching "${interaction.commandName}" was found.`);
		return;
	}

	try {
		await command.execute(interaction); //await is like async.
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.defercolor.RED) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
*/

//Say Fuck You in DMs when you send a message
//client.on("messageCreate", async (message) => {
//    console.log(message)
//    if (!message?.author.bot)
//        {
//            message.author.send("fuck you");
//        }
//})

//moved to ./events/ready.js
//client.once(Events.ClientReady, readyClient => {
//	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
//});

client.on("ready", async () => {
	console.log(color.GREEN + "Logged in!" + color.RESET); //Logged In! console message
	client.user.setStatus(PresenceUpdateStatus.Online); //Status Online
	//console.log("Status set to: " + color.GREEN + "Online" + color.RESET);
	client.user.setActivity("the stock market", { type: ActivityType.Watching }); //Watching the stock market
	//console.log("Activity set to: " + color.YELLOW + "Watching the stock market" + color.RESET);

	//const { RefreshUsers } = require('./commands/user-control/RefreshUsers.js');
	//await RefreshUsers(client);//Do it once.
	//setInterval(RefreshUsers, 21600000); //6 hours (21,600,000 milliseconds) = 21600000
	await client.channels.cache.get("1235756921521180722").send("Ready to Rumble!");
});

client.on("interactionCreate", async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);
		return;
	}
});

const MESSAGE_LOGGING = false;

client.on("messageCreate", async (msg) => {
	if (MESSAGE_LOGGING === true) {
		console.log(`message detected by ${color.YELLOW}${msg.author.tag.toString()}${color.RESET}` +
			` aka ${color.YELLOW}${msg.author.displayName}${color.RESET} in channel ${color.BLUE}${msg.channelId}${color.RESET}` +
			` aka ${color.BLUE}${client.channels.cache.get(msg.channelId).name}${color.RESET}`);
	}

	//Upvoting
	if (UpvoteContainer.active_channels.includes(msg.channelId)) {
		OnNewMessage(msg, client);
	}
});
client.on("messageReactionAdd", async (msgreactadd) => {
	//THIS ACTUALLY WORKS! JUST NEEDED THE INTENT
	//console.log(`messageReactionAdd Listener: reaction added: ${msgreactadd.emoji}`)
});

const SEND_CUSTOM_MESSAGE = true;
const CUSTOM_CHANNEL_ID = "1235756921521180722"; //Testing Channel ID: 1235756921521180722

/*//ExampleEmbed
	client.on("ready", async () => 
		{
			if(!SEND_CUSTOM_MESSAGE) return;
			const exampleEmbed = new EmbedBuilder()
		.setColor(0x0099FF) //accepts integer, HEX color string, an array of RGB values or specific color strings
		//colors: https://discord.js.org/docs/packages/discord.js/14.15.2/ColorResolvable:TypeAlias
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
			client.channels.cache.get(CUSTOM_CHANNEL_ID).send({ embeds: [exampleEmbed] });
			
		});*/
/*//Info Old
client.on("ready", async () => {
	const message =
`# Welcome to Rumble! 
## What is Rumble?
> Rumble is your new home and community for all stock related things!
> Gain the latest and greatest of insights about the market and what moves to make.
> Rumble serves you personalized information to help you make your best decisions to skyrocket your stock trading journey to `+
`new heights <a:fire_animated:1246811739677261824>🚀
## Rumble Community
> This server will allow you to both get the important info you need 🧠, but also involve you in a friendly & intellectual community :people_hugging:
## Assistance
> If you need help with Discord and the Community, please mention our Discord staff using <@&1238175989264285707> ✋
> If you would like support with using Rumble and want to ask question about Stocks and so forth, please use the <#1235771422563893298> channel 🤝
## Next Steps
> This guide will walk you through the Rumble Community, and how to use discord if you're new to it!
> Proceed below! ↘️`
	client.channels.cache.get(CUSTOM_CHANNEL_ID).send(message);
});*/
//Info New
client.on("ready", async () => {
	let message =
		`# Welcome to Rumble! 
## What is Rumble?
> Rumble is your go-to investment recommendations and insights platform. Designed to make professional investment advice ` +
		`accessible, Rumble delivers actionable expert insights, analysis & content directly to your pocket. Licensed by the Egyptian ` +
		`Financial Regulatory Authority (FRA), Rumble ensures that all advice is not only expert-driven but also regulated for your peace of mind. ☕
## Rumble Community
> The Rumble Community is where investors connect, share insights, and learn from experts. Engage with like-minded individuals ` +
		`and industry professionals, receive updates on the latest market trends & rumble releases. Join us and be part of a dynamic, supportive network that ` +
		`empowers you to make smarter investment decisions <a:fire_animated:1246811739677261824>🚀
## Assistance
> If you need help with Discord and the Community, please mention our Discord staff using <@&1238175989264285707> ✋
> If you would like support with using Rumble and want to ask question about Stocks and so forth, please use the <#1235771422563893298> channel 🤝
## Next Steps
> This guide will walk you through the Rumble Community! Proceed below! ↘️`
	client.channels.cache.get(CUSTOM_CHANNEL_ID).send(message);
	//message =
	//	"## أهلاً بيك في رمبل"
	//client.channels.cache.get(CUSTOM_CHANNEL_ID).send(message);
});
/*//Contact Us Old
client.on("ready", async () => 
	{
		if(!SEND_CUSTOM_MESSAGE) return;
		const exampleEmbed = new EmbedBuilder()
		.setAuthor({ name: 'Rumble', iconURL: 'https://i.imgur.com/29Q6QJd.jpg'}) //grab imagur link then put an i. before "imagur" and a .fileextention
		.setColor("color.GREEN") //accepts integer, HEX, RGB Array,string: https://discord.js.org/docs/packages/discord.js/14.15.2/ColorResolvable:TypeAlias
		.setTitle('Get in touch with us')
		.setDescription('If you have an questions, need support, or want to contact us, here are our contact options!')
		.addFields(
			//To add a blank field to the embed, you can use .addFields({ name: '\u200b', value: '\u200b' }).
			//{ name: '\u200b', value: '\u200b'}, // \u200b is a "zerio width space"
			{ name: 'Discord FAQ', value: '❓You can check out our frequently asked questions about discord here: <#1242432045565870100> '},
			{ name: 'Rumble FAQ', value: '❓If you have a question about The Rumble, check out the online ' + 
			'FAQ [here](https://thndrapp.notion.site/ec39a449b192472f99e7cbaf2bce8f46?v=ec72996c63f847c0ba6884004a0cf931)\n'},
			{ name: 'Support Ticket', value: '🎫 Need to open a support ticket?'
			+ ' You may do so at <#1235771422563893298> !\n'},
			{ name: 'Email', value: 'Need to Email us? You can reach us at [support@therumble.app](https://mailto:support@therumble.app)\n'},
			{ name: '\u200b', value: '\u200b'}, // \u200b is a "zerio width space"
			{ name: 'Socials', value: 'You can check out all our socials below:-' }
		)
		.addFields({ name: 'Facebook', value: '[therumblemena](https://www.facebook.com/therumblemena)', inline: true })
		.addFields({ name: 'Whatsapp', value: '[Rumble | رامبل](https://www.whatsapp.com/channel/0029Va9nn8e1NCrcKRwvmf02)', inline: true })
		.addFields({ name: 'Instagram', value: '[@rumblemena](https://www.instagram.com/rumblemena/)', inline: true })
		.addFields({ name: 'YouTube', value: '[Rumble](https://www.youtube.com/@RumbleMENA)', inline: true })
		//.addFields({ name: 'Facebook', value: '[Thndr Community ⚡ مجتمع ثاندر](https://www.facebook.com/groups/1925493331072542)', inline: true })
		//.addFields({ name: 'Whatsapp', value: '--', inline: true })
		//.addFields({ name: 'Instagram', value: '--', inline: true })
		//.setTimestamp()
			client.channels.cache.get(CUSTOM_CHANNEL_ID).send({ embeds: [exampleEmbed] });

	});*/
/*//Contact Us New that they want.
client.on("ready", async () => 
	{
		if(!SEND_CUSTOM_MESSAGE) return;
		const exampleEmbed = new EmbedBuilder()
		.setAuthor({ name: 'Rumble', iconURL: 'https://i.imgur.com/29Q6QJd.jpg'}) //grab imagur link then put an i. before "imagur" and a .fileextention
		.setColor("color.GREEN") //accepts integer, HEX, RGB Array,string: https://discord.js.org/docs/packages/discord.js/14.15.2/ColorResolvable:TypeAlias
		.setTitle('Need help or have any questions?')
		.setDescription('If you have any questions, need support, or want to contact us, here\'s everything you need!')
		.addFields(
			//To add a blank field to the embed, you can use .addFields({ name: '\u200b', value: '\u200b' }).
			//{ name: '\u200b', value: '\u200b'}, // \u200b is a "zerio width space"
			{ name: 'Discord FAQ', value: '❓You can check out frequently asked questions about discord [here](https://support.discord.com/hc/en-us) ' +
				'\n❓If you\'re new to discord, here is a quick video about what Discord is about and how to use it: ' +
				'[How Discord Works in 148,000 Miliseconds or Less](https://www.youtube.com/watch?v=TJ13BA3-NR4&pp=ygUTZGlzY29yZCBiYXNpYyB1c2FnZQ%3D%3D)'},
			{ name: 'Rumble FAQ', value: '❓If you have a question about Rumble, check out our FAQs ' + 
			'[here](https://thndrapp.notion.site/ec39a449b192472f99e7cbaf2bce8f46?v=ec72996c63f847c0ba6884004a0cf931)\n'},
			{ name: 'Support Ticket', value: '💬 Need to get in touch?'
			+ ' You can reach us at [support@therumble.app](https://mailto:support@therumble.app) ' +
			'or you can open a support ticket and chat directly with our team from <#1235771422563893298> !\n'},
			{ name: '\u200b', value: '\u200b'}, // \u200b is a "zerio width space"
			{ name: 'Socials', value: '<:facebook_icon:1247535729631035472> Facebook - [therumblemena](https://www.facebook.com/therumblemena)\n' + 
				'<:whatsapp_icon:1247535727001079858> Whatsapp - [Rumble | رامبل](https://www.whatsapp.com/channel/0029Va9nn8e1NCrcKRwvmf02)\n' + 
				'<:instagram_icon:1247536363864064041> Instagram - [@rumblemena](https://www.instagram.com/rumblemena/)\n' +
				'<:youtube_icon:1247563994789843080> YouTube - [Rumble](https://www.youtube.com/@RumbleMENA)'
			 }
		)
		//.addFields({ name: 'Facebook', value: '[therumblemena](https://www.facebook.com/therumblemena)', inline: true })
		//.addFields({ name: 'Whatsapp', value: '[Rumble | رامبل](https://www.whatsapp.com/channel/0029Va9nn8e1NCrcKRwvmf02)', inline: true })
		//.addFields({ name: 'Instagram', value: '[@rumblemena](https://www.instagram.com/rumblemena/)', inline: true })
		//.addFields({ name: 'YouTube', value: '[Rumble](https://www.youtube.com/@RumbleMENA)', inline: true })
		//.addFields({ name: 'Facebook', value: '[Thndr Community ⚡ مجتمع ثاندر](https://www.facebook.com/groups/1925493331072542)', inline: true })
		//.addFields({ name: 'Whatsapp', value: '--', inline: true })
		//.addFields({ name: 'Instagram', value: '--', inline: true })
		//.setTimestamp()
			client.channels.cache.get(CUSTOM_CHANNEL_ID).send({ embeds: [exampleEmbed] });

	});*/
/*//House Rules
client.on("ready", async () => {
	const message =
`## House Rules
### 1.Be respectful
This means no mean, rude, or harassing comments. Treat others the way you want to be treated.
### 2.No inappropriate language
Keep use of profanity to a reasonable minimum. Any derogatory language towards any user is prohibited. You can swear in casual channels only, while the other channels should be kept free of any profane language.
### 3.No spamming
Do not send a lot of small messages right after each other. These disrupt the chat and make it hard to scroll through the server. Please keep your messages at least 
### 4.No advertisements
Don’t send invasive advertising, whether it be for other communities or streams. You can post your content in the media channel if it’s relevant and provides actual value for the community.
## 5.No offensive names and profile pictures
Keep your names and profile picture appropriate.`
	client.channels.cache.get(CUSTOM_CHANNEL_ID).send(message);
});*/
/*//Discord FAQ
client.on("ready", async () => {
	const message =
"# Frequently Asked Questions\n" + 
"These are some of our personally compiled frequently asked questions on discord. ***__If you would like to get a general overview about " +
"how to use discord please use this video__***: https://www.youtube.com/watch?v=TJ13BA3-NR4&pp=ygUTZGlzY29yZCBiYXNpYyB1c2FnZQ%3D%3D" +
"\n" + 
"## Navigation:\n" + 
"Discord Servers are split into **Categories ** that house **Channels**\n" +
"for example, the category \"👇Getting Started\" contains the channel <#1222499341563072666>\n" +
"Simply click on your desicolor.RED channel in a category to check it out!\n" +
"\n" +
"## Getting help\n" +
"To get help please follow one of the following sources:\n" +
"> For reporting any breach of rules please ping/mention <@&1238175989264285707>\n" +
"> If none of these answers your question, you make open a ticket from <#1235771422563893298>.\n" +
"\n" +
"## Mentioning & Channel referencing\n" +
"you can mention someone by using @ followed by their username. You can also reference/mention a channel by using # followed by the channel name.\n" +
"\n" +
"\n" +
"## Notifications\n" +
"If you're ticolor.RED of getting notifications and alerts from certain channels, you can always right click a channel (or long press on phone) to bring up " +
"options. From there you can click mute/unmute. This will however still alert you of **@mentions** so you still get notified when you're " +
"favorite role gets mentioned or someone tries to get a hold of you. To further edit mentions, right click (or long press on phone) the" +
" channel, then click on \"notification settings\" and set it to your desicolor.RED settings.\n" +
"\n" +
"## Formating/markdown\n" +
"Discord offers serveral fun text formating options. Here is a quick overview of some of the common ones: " +
"https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-color.BOLD-Italic-color.UNDERLINE#h_01GY0EQVRRRB2F19HXC2BA30FG";
//"Discord offers serveral fun text formating options. some of the fun ones are:\n" +
//"\\**italic\\** \\__italic\\__\n" +
//"**\\*\\*color.BOLD\\*\\***\n" +
//"\\_\\___color.UNDERLINE__\\_\\_\n" +
//"\\~\\~~~strikethrough~~\\~\\~\n" +
//"> \\> to make paragraphs (you must include a space after the > )\n" +
//"\\``code`\\` \n" +
//"\\`\\`\\` ``` code\n" +
//"block ```\\`\\`\\` (note with code blocks, right after the first \\`\\`\\` you can include the name of the language to have formating" +
//" colors such as C++ and html.\n" +
//"You can also use headers by having \\# then a spacebar afterwards. # makes H1, ## H2, and ### H3.\n";
	client.channels.cache.get(CUSTOM_CHANNEL_ID).send(message);
});*/

//-----------------------------------------LOGIN-----------------------------------------//
client.login(process.env.DISCORD_TOKEN);
