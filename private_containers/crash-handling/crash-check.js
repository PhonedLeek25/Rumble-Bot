const { exit } = require("process");
const { color } = require("../../global_variables/color.js");
const fs = require("fs");

async function runClient() {
    require("dotenv").config();
    const { Client, GatewayIntentBits } = require("discord.js");
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] });
    await client.login(process.env.DISCORD_TOKEN);
    console.log("logged in");

    //notify of crash
    console.log(color.YELLOW + "crash-check.js: waiting for Ready!" + color.RESET);
    await new Promise(r => setTimeout(r, 3000));
    console.log(color.YELLOW + "crash-check.js: done waiting for Ready!" + color.RESET);

    const channel = client.channels.cache.get("1235756921521180722");
    await channel.send("<@261216694901538816> The bot has crashed!");
    return;
}

function crashCheck() {
    const filePath = "./private_containers/crash-handling/crash-state.json";
    let myObject = { crashed: "N/A" };
    try {
        const data = fs.readFileSync(filePath);
        console.log("data = " + data);
        myObject = JSON.parse(data);
        console.log("myObject:"); console.log(myObject);

        if (myObject.crashed === true) {
            //start
            console.log("crash-state: " + color.RED + myObject.crashed + color.RESET);
            runClient().then(() => {
                //end crash event
                console.log("changing crash state..");
                myObject = { crashed: false };
                fs.writeFileSync(filePath, JSON.stringify(myObject), (error) => { if (error) { throw error } });
                //end this nightmare
                console.log("exiting...");
                exit();
            });
        }
        else if (myObject.crashed === false) { console.log("crash-state: " + color.GREEN + myObject.crashed + color.RESET); }
        else {
            console.log(color.RED + "detected something other than true/false for crash state!\nchanging crash state.." + color.RESET);
            myObject = { crashed: false };
            fs.writeFileSync(filePath, JSON.stringify(myObject), (error) => { if (error) { throw error } });
            throw new Error("detected something other than true/false for crash state!");

        }
    }
    catch (err) {
        console.log(err);
        console.log("crash-state: " + color.RED + "UNDEFINED" + color.RESET);
        myObject = { crashed: false };
        fs.writeFileSync(filePath, JSON.stringify(myObject), (error) => { if (error) { throw error } });
    }
}

module.exports = { crashCheck };