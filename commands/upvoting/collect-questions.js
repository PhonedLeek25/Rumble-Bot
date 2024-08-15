const { SlashCommandBuilder } = require("discord.js");
const { UpvoteContainer } = require("./UpvoteContainer.js"); //NEEDS TO BE THE SAME NAME AS THE CLASS'S NAME
const wait = require('node:timers/promises').setTimeout; //to be able to wait.
const { color } = require("../../public_containers/color.js");
const { RoleID } = require('../../public_containers/RoleID.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("collect-questions")
    .setDescription("Listen to messages in order to rank upvotes!"),
  async execute(interaction) {
    //Permission Check
    if (!interaction.member.roles.cache.has(RoleID.expert) && !interaction.member.roles.cache.has(RoleID.staff)) {
      interaction.reply({ content: "This command can only be used by Experts and Staff!", ephemeral: true });
      return;
    }
    //Check if in a valid channel
    const CHECK_FOR_VALID_CHANNEL = false
    if (!UpvoteContainer.valid_channel_IDs.includes(await interaction.channelId) && CHECK_FOR_VALID_CHANNEL) {
      interaction.reply({ content: "This channel is not valid for collecting questions.", ephemeral: true });
      return;
    }

    //MAIN START // MAIN START //MAIN START //MAIN START //MAIN START //MAIN START //MAIN START //MAIN START
    if (!UpvoteContainer.active_channels.includes(await interaction.channelId)) {
      await interaction.deferReply(); console.log(color.GREEN + "================================================" + color.RESET);
      //interaction.followUp({ content: "Please Wait...", ephemeral: true });

      //Mark Start
      const start_message_id = (await interaction.channel.send("Marking Start ID...")).id
      console.log("Marked with: " + start_message_id + " (" + typeof (start_message_id) + ")");
      UpvoteContainer.active_channels.push(await interaction.channelId);
      UpvoteContainer.active_channels_start.push(start_message_id);
      UpvoteContainer.msgs = []; //Reset

      await interaction.followUp({
        content: "Upvoting is now **__ON__** for channel " +
          interaction.client.channels.cache.get(interaction.channelId).name, ephemeral: true
      });
      console.log("done, waiting on deletion");
      await wait(5_000);
      await interaction.deleteReply();
    }
    //Collect
    else {
      await interaction.deferReply({ ephemeral: true }); console.log(color.RED + "================================================" + color.RESET);
      //Don't overdo it
      while (UpvoteContainer.PROCESSING === true) {
        console.log(color.YELLOW + "collect-questions:" + color.RESET + "waiting on UpvoteContainer.PROCESSING to turn false..");
        await wait(2_000);
      }
      UpvoteContainer.PROCESSING = true;

      const index = UpvoteContainer.active_channels.indexOf(interaction.channelId);
      const start_message_id = UpvoteContainer.active_channels_start[index];
      console.log(color.YELLOW + "start_message_ID obtained: " + start_message_id + color.RESET + " (" + typeof (start_message_id) + ")");
      //const active_channel_index = UpvoteContainer.active_channels.findIndex((upvoteContainer) => (upvoteContainer.channel_id == interaction.channelId));

      //Remove from active list
      try {
        // if (index > -1) = only splice array when item is found, 2nd parameter means remove one item only
        if (index > -1) {
          UpvoteContainer.active_channels.splice(index, 1);
          UpvoteContainer.active_channels_start.splice(index, 1);
        }
        else { throw ("tried splicing a NULL length array in collect-question.js where you Remove from active list"); }
      }
      catch (err) {
        console.log(color.RED + "error: " + color.RESET + err);
        interaction.followUp("An error occured, please notify an administrator");
        return;
      }

      //Collection
      let OMAK = {
        msgID: [],
        author: [],
        votes: []
        /*while you could as well while you're at it obtiain the message contents, and might be slightly faster, it'll be:
        1. more time consuming to implement a feature that already exists but implemented slightly differnelty
        2. more RAM intensive to hoard all message contents*/
      }
      console.log(color.RED + "start_message_ID: " + start_message_id + color.RESET + " (" + typeof (start_message_id) + ")");
      await interaction.channel.messages.fetch({/* limit: Infinity, */cache: false, after: start_message_id })
        .then(async (msgs) => {
          console.log(`Received ${msgs.size} messages`);
          const BOT_TAG = interaction.client.user.tag;
          msgs.forEach(async (msg) => {
            if (msg.author.tag != BOT_TAG) {
              OMAK.msgID.push(msg.id);
              OMAK.author.push(msg.author.displayName);

              //Collect Reactions ==> This must be done this way because messages.fetch() does not obtain cache and therefore doesn't collect reactions
              let x = 0;
              const messageReacted = await interaction.client.channels.cache.get(interaction.channelId).messages.fetch(msg.id);
              messageReacted.reactions.cache.forEach(async (reaction) => {
                //https://discord.js.org/docs/packages/discord.js/14.15.3/MessageReaction:Class
                //const emojiName = reaction.emoji.name;
                //const emojiCount = reaction.count
                //const reactionUsers = await reaction.users.fetch();
                if (reaction.emoji.id == UpvoteContainer.emojiUpvoteID) { x = x + reaction.count; }
                else if (reaction.emoji.id == UpvoteContainer.emojiDownvoteID) { x = x - reaction.count; }
              });
              OMAK.votes.push(x);

            }
          });
        });

      //Check if nothing collected
      if (OMAK.msgID.length === 0) { await interaction.followUp({ content: "No questions collected!", ephemeral: true, }); return; }

      await interaction.followUp({
        content: "Upvoting is now **__OFF__** for channel " + interaction.client.channels.cache.get(interaction.channelId).name,
        ephemeral: true
      });

      /* //Collect Emojis/Reactions OLD
      let x = 0;
      let messageReacted;
      for (let msgID of UpvoteContainer.msgs) {
        x = 0;
        //fetch message(s) of ID UpvoteContainer.msgs.id
        messageReacted = await interaction.client.channels.cache.get(interaction.channelId).messages.fetch(msgID);
        //For Each Reaction on the message(s)
        messageReacted.reactions.cache.forEach(async (reaction) => {
          //https://discord.js.org/docs/packages/discord.js/14.15.3/MessageReaction:Class
   
          //console.log("===================================");
          //console.log(`emojiName = ${reaction.emoji.name}`);
          //console.log(`emojiCount = ${reaction.count}`);
   
          //const emojiName = reaction.emoji.name;
          //const emojiCount = reaction.count
          //const reactionUsers = await reaction.users.fetch();
          if (reaction.emoji.id == UpvoteContainer.emojiUpvoteID) {
            //console.log( color.GREEN + "Upvotes by " + reaction.count.toString() + color.RESET );
            x = x + reaction.count;
            //console.log("x: " + x);
          } else if (reaction.emoji.id == UpvoteContainer.emojiDownvoteID) {
            //console.log(color.GREEN + "Downvotes by " + reaction.count.toString() + color.RESET);
            x = x - reaction.count;
            //console.log("x: " + x);
          }
        });
        //console.log(color.GREEN + "UpvoteContainer.msgUpvoteCount.push(x): " + x.toString() + color.RESET);
        UpvoteContainer.msgs.forEach((msg) => {
          if (msg.id === msgID) {
            msg.votes = x;
          }
        });
        UpvoteContainer.msgUpvoteCount.push(x);
      }
      */


      // Bubble sort algorithm, sponsored by ChatGPT that's gonna take my job
      let n = OMAK.votes.length;

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (OMAK.votes[j] < OMAK.votes[j + 1]) {
            // Swap votes
            [OMAK.votes[j], OMAK.votes[j + 1]] = [OMAK.votes[j + 1], OMAK.votes[j]];
            // Swap msgID
            [OMAK.msgID[j], OMAK.msgID[j + 1]] = [OMAK.msgID[j + 1], OMAK.msgID[j]];
            // Swap author
            [OMAK.author[j], OMAK.author[j + 1]] = [OMAK.author[j + 1], OMAK.author[j]];
          }
        }
      }

      /* //Sort - 3ammar old
      MSGS.sort((a, b) => { //UpvoteContainer.msgs.sort((a, b) => {
        if (a.votes < b.votes) { return 1; }
        else if (a.votes > b.votes) { return -1; }
        else { return 0; }
      });*/

      //Regurgitate
      await interaction.followUp({ content: "## Vote Ranking:", ephemeral: false });
      for (let x = 0; x < OMAK.msgID.length; x++) {
        if (x > 10) { break; } //Don't exceed!
        const message = await interaction.client.channels.cache.get(interaction.channelId).messages.fetch(OMAK.msgID[x]);
        const message_content = message.content;
        interaction.channel.send(`### Rank #${x + 1} - By *${OMAK.author[x]}* (${OMAK.votes[x]} Upvotes)` +
          "\n" + message_content);
      }
      UpvoteContainer.PROCESSING = false; //Free up resources
      console.log("done!");
    }
  },
};
