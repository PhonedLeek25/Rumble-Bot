const { color } = require("../../public_containers/color.js");
const RUMBLE_GUILD_ID = "1222497591573614665";

async function RefreshUsers(client) {
    console.log(color.YELLOW + color.BOLD + "Started refreshing users..." + color.RESET);
    try {
        //Obtain ValidUsers list
        const ValidUsers = ["Rumble", "Rumble Bot"];
        //let response = null; //VALID USER LIST HERE
        //const validUsers = await response.json();
        //console.log(validUsers);

        //Fetch Discord Users
        const myguild = await client.guilds.fetch("1222497591573614665"); //https://discord.js.org/docs/packages/discord.js/14.15.3/GuildMemberManager:Class
        const guildMembers = await myguild.members.fetch(); //https://discord.js.org/docs/packages/discord.js/14.15.3/GuildMemberManager:Class#list
        //  .then(console.log)
        //  .catch(console.error);
        let InvalidCount = 0;
        guildMembers.forEach(async (member) => {
            //forEach user check if invalid
            const username = member.user.username;
            if (ValidUsers.includes(username)) {
                console.log(color.GREEN + username + color.RESET);
            }
            else {
                console.log(color.RED + username + color.RESET);
                //InvalidCount++;
            }
        })


        //Report Findings
        console.log(color.GREEN + color.BOLD + "User refresh successful!" + color.RESET +
            ` found ${color.YELLOW}${InvalidCount.toString()}${color.RESET} expired users.`);
    }
    catch (err) {
        console.log(color.RED + color.BOLD + "USER REFRESH FAILED: " + color.RESET + err);
    }
}

//async function RefreshUsersTimely() {
//    const TME_IN_MS = 21600000 //6 hours (21,600,000 milliseconds)
//    setInterval(DOSOMETHING, TME_IN_MS);
//}

module.exports = { RefreshUsers };