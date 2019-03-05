exports.run = async(client, logger) => {
    try {
        // Set the client's initial presence
        client.user.setActivity("bacon sizzle.", {
            type: 2
        });

        // Go through each text channel in the server and fetch the last 100 messages to place them in the cache
        // This is due to the fact that the messageReactionAdd event only fires on cached messages
        // Every time the bot is restarted, the cache is cleared
        // That would mean that any reactions added to messages that were sent before the restart would not get points
        // This way, the user receives points for reacting to any of the last 100 messages before the restart
        // Note: There will eventually be an AUTOFETCH setting for ClientOptions in discord.js 12.0
        client.channels.forEach(channel => {
            if (channel.type !== 'text') return;

            channel.messages.fetch({
                    limit: 100
                })
                .catch(err => logger.warn(`Skipping channel (messages not fetched): ID - '${channel.id}', Name - '${channel.name}', Reason - '${err}'`));
        });

        // Log some general information about the client
        logger.info(`BaconBot has come online. Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);

        // Actions to skip if testing the bot (like sending a message to general chat upon login)
        const config = require("../config.json");
        if (config.testing === true) return;

        // Find the configured 'general' channel for the server
        let generalChannel = client.channels.find("id", config.generalChannelID);

        // Let the server know that I am online
        const embedTemplates = require("../templates/embed.js");
        generalChannel.send(embedTemplates.newClientReadyEmbed(client)).catch(err => logger.error(err.message));

    } catch (err) {
        logger.error(`[/events/ready.js] ${err.message}`);
    }
}