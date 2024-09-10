function crashCheck() {

    const crashObject = { "crashed": false };

    const fs = require("fs");
    try {
        let myObject;
        fs.readFile("./private_containers/crash-handling/crash-state.json", (error, data) => {
            if (error) { throw error; };
            console.log("umm");
            myObject = JSON.parse(data);
            console.log("data = " + data);
        });
        exit();
        console.log("myObject: " + myObject);
        if (myObject.crashed == true) {
            //start
            require("dotenv").config();
            const { Client, GatewayIntentBits } = require("discord.js");
            const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] });
            client.login(process.env.DISCORD_TOKEN);
            //notify of crash
            client.on("ready", () => {
                client.channels.cache.get("1235756921521180722").send("<@261216694901538816> The bot has crashed!");
            })
            //end crash event
            myObject = JSON.stringify(crashObject);
            fs.writeFile("crash-state.json", myObject, (error) => { if (error) { throw error } });
            //end this nightmare
            console.log("exiting...");
            exit();
        }
        else if (myObject.crashed == false) {
            console.log("crash-state: false");
        }
        else {
            throw new Error("detected something other than true/false for crash state!");
        }
    }
    catch (err) {
        console.log(err);
        console.log("error caught, continuing with program exection...");
    }
}

module.exports = { crashCheck };