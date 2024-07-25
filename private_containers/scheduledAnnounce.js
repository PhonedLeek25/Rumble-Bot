const { RoleID } = require("../public_containers/RoleID");

let current_events = [];

/*
    current_events.push({
        id: myevent.id,
        name: myevent.name,
        description: myevent.description,
        startAt: myevent.scheduledStartAt,
        url: myevent.url,
        expert_ping: expertRolePing,
        mode: "good"
    }); 
*/

async function getTimeLeft(sched_date) {
    //const now_date = new Date();
    //return sched_date.getTime() - now_date.getTime();//milisecond difference
    return sched_date.getTime() - Date.now();//milisecond difference
}

async function scheduledAnnounce(client, sched_date, eventID) {
    const { channelID } = require("../public_containers/channelID");
    console.log("scheduledAnnounce started");
    const wait = require('node:timers/promises').setTimeout; //to be able to wait.

    //collect message ID template: const start_message_id = (await interaction.channel.send("Marking Start ID...")).id
    const ms_1day = 86400000 //24 Hours = 86,400,000 Milliseconds
    const ms_6hr = 21600000 //6 Hours = 21,600,000 Miliseconds
    const ms_1hr = 3600000; //1 Hour = 3,600,000 Milliseconds

    let msleft = getTimeLeft(sched_date);

    //Check for updates
    do {
        await wait(ms_1hr / 4); //15m
        const index = current_events.findIndex(x => x.id === eventID);
        console.log("index: " + current_events[index]);
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
    } while (msleft > (ms_1day + (ms_1hr / 2)));
    console.log(`event "${current_events[current_events.findIndex(x => x.id === eventID)].name} has been promoted to 24h left`);
    msleft = await getTimeLeft(sched_date)


    let messageID;
    //Notify 24hrs in advance
    if (msleft >= 86400000) {
        console.log(">=24hr tripped for " + current_events[current_events.findIndex(x => x.id === eventID)].name);
        await wait(msleft - 86400000); //wait till 24hrs before the event
        console.log("24hr over");
        const details = current_events[current_events.findIndex(x => x.id === eventID)];
        messageID = (await client.channels.cache.get(channelID.announcements).send(ping + " Tune in for [" + details.name + `](${details.url})`
            `happening on <t:${Math.floor(sched_date.getTime() / 1000)}> (<t:${Math.floor(sched_date.getTime() / 1000)}:R>)`)).id;
        //Discord uses UNIX_TIMESTAMP() seconds! not ms.
        msleft -= 86400000;
    }

    //Check for updates
    do {
        await wait(ms_1hr / 4); //15m
        const index = current_events.findIndex(x => x.id === eventID);
        console.log("index: " + current_events[index]);
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
    } while (msleft > ms_1hr + (ms_1hr / 2));
    console.log(`event "${current_events[current_events.findIndex(x => x.id === eventID)].name} has been promoted to 24h left`);
    msleft = await getTimeLeft(sched_date)


    //Announce before event starts by 1 Hour!
    const details = current_events[current_events.findIndex(x => x.id === eventID)];
    if (msleft >= ms_1hr) {
        console.log(">=1hr");
        await wait(msleft - ms_1hr);  //wait till 12hrs before the event
        console.log("1hr over.");
        await client.channels.cache.get(channelID.announcements).send(`${details.ping} + Reminder: *${details.name}* **starting in 1 hour!**`);
    }
    else {
        await client.channels.cache.get(channelID.commands_and_testing).send("<@261216694901538816> error, tried to warn 1hr before but <1hr left\n" +
            "event name: " + details.name);
    }

    //Clean up job
    const index = current_events.findIndex(x => x.id === eventID)
    current_events.splice(index, 1); //Syntax: splice(start, deleteCount) 
}

module.exports = { scheduledAnnounce, current_events };