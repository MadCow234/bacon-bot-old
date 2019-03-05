exports.run = async(client, logger, member) => {
    try {
        const config = require("../config.json");

        let generalChannel = client.channels.find("id", config.generalChannelID);

        generalChannel.send(`Welcome to Bacon Palace, ${member.user}!`);

    } catch (err) {
        logger.error(`[/events/guildMemberAdd.js] ${err.message}`);
    }
}