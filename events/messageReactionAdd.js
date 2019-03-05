exports.run = async(client, logger, messageReaction, user) => {
    try {
        // Don't respond to bots...unless I'm the one adding the reaction
        if (user.bot && user.id != client.user.id) return;

        // Execute the reaction points monitor
        require("../monitors/reactionPointsMonitor.js").run(client, logger, messageReaction, user);

        // We love bacon
        if (messageReaction.emoji.name.includes("bacon") || messageReaction.emoji.name === '🥓')
            require("../monitors/reactionBaconMonitor.js").run(client, logger, messageReaction);

    } catch (err) {
        logger.error(`[/events/messageReactionAdd.js] ${err.message}`);
    }
}