async function scheduledAnnounce(client, sched_date, msg) {
    console.log("scheduledAnnounce started");
    const wait = require('node:timers/promises').setTimeout; //to be able to wait.
    const announcmenet_channel = "1235757310631088201"; //ANNOUNCMENTS: 1235757310631088201 //COMMANDS AND TESTING: 1235756921521180722
    const now_date = new Date();
    let msdiff = sched_date.getTime() - now_date.getTime();//milisecond difference
    console.log("msdiff: " + msdiff);
    //Notify 24hrs in advance
    if (msdiff >= 86400000) { //24 Hours = 86,400,000 Milliseconds
        console.log(">=24hr");
        await wait(msdiff - 86400000); //wait till 24hrs before the event
        console.log("24hr over");
        await client.channels.cache.get(announcmenet_channel).send(msg + //Discord uses UNIX_TIMESTAMP() seconds! not ms.
            `happening on <t:${Math.floor(sched_date.getTime() / 1000)}> (<t:${Math.floor(sched_date.getTime() / 1000)}:R>)`);
        msdiff -= 86400000;
    }
    else if (msdiff >= 43200000) { //12 Hours = 43,200,000 Milliseconds
        console.log(">=12hr");
        await wait(msdiff - 43200000);  //wait till 12hrs before the event
        console.log("12hr over");
        await client.channels.cache.get(announcmenet_channel).send(msg + //Discord uses UNIX_TIMESTAMP() seconds! not ms.
            `happening on <t:${Math.floor(sched_date.getTime() / 1000)}> (<t:${Math.floor(sched_date.getTime() / 1000)}:R>)`);
        msdiff -= 43200000;
    }

    if (msdiff >= 3600000) { //1 Hour = 3,600,000 Milliseconds
        console.log(">=1hr");
        await wait(msdiff - 3600000);  //wait till 12hrs before the event
        console.log("1hr over.");
        await client.channels.cache.get(announcmenet_channel).send("Reminder! " + msg + //Discord uses UNIX_TIMESTAMP() seconds! not ms.
            `starting in <t:${Math.floor(sched_date.getTime() / 1000)}:R>`);
    }
    else {
        await client.channels.cache.get(1235756921521180722).send("<@261216694901538816> critical error, in if (msdiff >= 3600000)");
    }
}

module.exports = { scheduledAnnounce }