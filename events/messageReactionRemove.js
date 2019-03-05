exports.run = async(client, logger, messageReaction, user) => {
    try {
        // Don't respond to bots...unless I'm the one adding the reaction
        if (user.bot && user.id != client.user.id) return;

        // Execute the reaction points monitor
        require("../monitors/reactionPointsMonitor.js").run(client, logger, messageReaction, user);

    } catch (err) {
        logger.error(`[/events/messageReactionRemove.js] ${err.message}`);
    }
}