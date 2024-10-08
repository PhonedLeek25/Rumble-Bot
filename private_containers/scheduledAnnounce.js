const { RoleID } = require("../global_variables/RoleID");

let current_events = [];
/*
    current_events.push({
        id: myevent.id,
        name: myevent.name,
        channelid: myevent.channelId,
        description: myevent.description,
        startAt: myevent.scheduledStartAt,
        url: myevent.url,
        status: myevent.status,
        expert_ping: expertRolePing,
        mode: "good"
    }); 
*/

function timeNowReadable() {
    const nowdatereadablestring = new Date();
    return nowdatereadablestring;
}

async function getTimeLeft(sched_date) {
    //const now_date = new Date();
    //return sched_date.getTime() - now_date.getTime();//milisecond difference
    return sched_date.getTime() - Date.now();//milisecond difference
}

async function scheduledAnnounce(client, sched_date, eventID) {
    const { channelID } = require("../global_variables/channelID");
    const wait = require('node:timers/promises').setTimeout; //to be able to wait.

    //collect message ID template: const start_message_id = (await interaction.channel.send("Marking Start ID...")).id
    const ms_1day = 86400000 //24 Hours = 86,400,000 Milliseconds
    const ms_6hr = 21600000 //6 Hours = 21,600,000 Miliseconds
    const ms_1hr = 3600000; //1 Hour = 3,600,000 Milliseconds

    let msleft = getTimeLeft(sched_date);

    //Check for updates
    while (msleft > (ms_1day + (ms_1hr / 2))) {
        //await wait(ms_1hr / 4); //15m
        await wait(5_000);
        const index = current_events.findIndex(x => x.id === eventID);
        const newStartAt = current_events[index].startAt;
        const mode = current_events[index].mode;
        if (mode == "chanaged") {
            console.log("guildScheduledEvent is not good!");
            //Get new times
            sched_date = newStartAt;
            msleft = await getTimeLeft(newStartAt);
            current_events[index].mode = "good";
        }
        else if (mode == "canceled") {
            client.channels.cache.get(channelID.staff_alerts).send(`<@&${RoleID.staff}> The event "${current_events[index]}" ` +
                `has been canceled. you might want to delete any relevant messages from <#${channelID.announcements}>.`);
            console.log("event " + current_events[index].name + "has been cancelled. scheduledAnnounce.js will now return.");
            return;
        }
    }
    console.log(`[${timeNowReadable()}]: event "${current_events[current_events.findIndex(x => x.id === eventID)].name}" has been promoted to 24hr left`);
    msleft = await getTimeLeft(sched_date)


    let messageID;
    //Notify 24hrs in advance
    if (msleft >= 86400000) {
        console.log(">=24hr tripped for " + current_events[current_events.findIndex(x => x.id === eventID)].name);
        await wait(msleft - 86400000); //wait till 24hrs before the event
        console.log("24hr over");
        const details = current_events[current_events.findIndex(x => x.id === eventID)];
        const mymessage = `${details.expert_ping} Tune in for [${details.name} ](${details.url})` +
            `happening on <t:${Math.floor(sched_date.getTime() / 1000)}:F> (<t:${Math.floor(sched_date.getTime() / 1000)}:R>)`;
        messageID = (await client.channels.cache.get(channelID.announcements).send(mymessage)).id;
        //Discord uses UNIX_TIMESTAMP() seconds! not ms.
        msleft -= 86400000;
    }
    else { console.log(`[${timeNowReadable()}]: event "${current_events[current_events.findIndex(x => x.id === eventID)].name}" has <24 left, promoting`) };

    //Check for updates
    while (msleft > ms_1hr + (ms_1hr)) {
        await wait(ms_1hr / 4); //15m
        const index = current_events.findIndex(x => x.id === eventID);
        console.log("\"" + current_events[index].name + "\" On hold for 1hr");
        const newStartAt = current_events[index].startAt;
        const mode = current_events[index].mode;
        if (mode == "chanaged") {
            console.log("event changed!");
            //Delete old message
            try { await client.channels.cache.get(channelID.announcements).messages.delete(messageID); }
            catch (err) { console.log("Error deleting message: " + err) };
            //Get new times
            sched_date = newStartAt;
            msleft = await getTimeLeft(newStartAt);

            current_events[index].mode = "good";
            //Send new message
            await client.channels.cache.get(channelID.announcements).send(ping + " Event Changed: [" + details.name + `](${details.url})`
                `will be starting on <t:${Math.floor(sched_date.getTime() / 1000)}> (<t:${Math.floor(sched_date.getTime() / 1000)}:R>)`)
        }
        else if (mode == "canceled") {
            //Delete old message
            try { await client.channels.cache.get(channelID.announcements).messages.delete(messageID); }
            catch (err) { console.log("Error deleting message: " + err) };
            client.channels.cache.get(channelID.staff_alerts).send(`<@&${RoleID.staff}> The event "${current_events[index]}" ` +
                `has been canceled. you might want to delete any relevant messages from <#${channelID.announcements}>.`);
            console.log("event " + current_events[index].name + "has been cancelled. scheduledAnnounce.js will now return.");
            return;
        }
    }
    console.log(`[${timeNowReadable()}]: event "${current_events[current_events.findIndex(x => x.id === eventID)].name} has been promoted to 1hr left`);
    msleft = await getTimeLeft(sched_date)


    //Announce before event starts by 1 Hour!
    const details = current_events[current_events.findIndex(x => x.id === eventID)];
    if (msleft >= ms_1hr) {
        console.log(">=1hr for " + details.name);
        await wait(msleft - ms_1hr);  //wait till 12hrs before the event
        console.log("1hr over for " + details.name);
        const mymessage = `${details.ping} + Reminder: __*${details.name}*__ **starting in 1 hour!**`;
        await client.channels.cache.get(channelID.announcements).send(mymessage);
    }
    else {
        const mymessage = "<@261216694901538816> error, tried to warn 1hr before but only <1hr left\nevent name: " + details.name;
        await client.channels.cache.get(channelID.commands_and_testing).send(mymessage);
    }

    //Clean up job
    const index = current_events.findIndex(x => x.id === eventID)
    current_events.splice(index, 1); //Syntax: splice(start, deleteCount) 
}

module.exports = { scheduledAnnounce, current_events };