exports.run = async(client, logger, message) => {
    try {
        const config = require("../config.json");
        const messageConstants = require("../resources/message-constants.json");

        // Don't respond to bots...unless I'm the one talking
        if (message.author.bot && message.author.id != client.user.id)
            return;

        // Execute the textPointsMonitor if points are enabled
        if (config.monitorPoints == true)
            require("../monitors/textPointsMonitor.js").run(client, logger, message);

        // We love bacon
        if (message.content.includes("bacon"))
            require("../monitors/textBaconMonitor.js").run(client, logger, message);

        // Execute the commandsMonitor if the configured prefix is heard
        if (message.content.startsWith(config.prefix))
            require("../monitors/commandsMonitor.js").run(client, logger, message);

    } catch (err) {
        logger.error(`[/events/message.js] ${err.message}`);
    }
}