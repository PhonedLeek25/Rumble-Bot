const UpvoteContainer = {
    valid_channel_IDs: ["1235756921521180722"/*testingchannel*/, "1239155476957237298"/*Abdelkhalek's room*/,
        "1239155126288252978"/*Alfy's Room*/, "1239155275689230336"/*Hefnawi's Room*/, "1249284020437782640"/*Sergio's Room*/,
        "1239155376235089942"/*Shams's Room*/],
    active_channels: [],
    active_channels_start: [],
    PROCESSING: false,
    emojiUpvoteID: 1245042556832845884,
    emojiDownvoteID: 1245042555285012664
};

//module.exports = { UpvoteContainer }; //you MUST say const UpvoteContainer = require(.../upvote_container.js)


async function OnNewMessage(msg, client) {
    if (msg.author.tag != client.user.tag) {
        await msg.react("1245042556832845884"); //React with Upvote
        await msg.react("1245042555285012664"); //React with Downvote
    }
    //UpvoteContainer.msgs.push({
    //    id: msg.id,
    //    author: msg.author.displayName,
    //});
}

module.exports = { UpvoteContainer, OnNewMessage };