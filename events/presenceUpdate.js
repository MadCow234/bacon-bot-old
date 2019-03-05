exports.run = async(client, logger, oldMember, newMember) => {
    try {
        // Don't respond to bots...unless I'm the one adding the reaction
        if ((oldMember.user.bot || newMember.user.bot) && newMember.user.id != client.user.id) return;

        // If the user starts playing a game, run the presencePointsMonitor
        if (newMember.presence.activity && newMember.presence.activity.type === "PLAYING") {
            let presencePointsMonitor = require("../monitors/presencePointsMonitor.js");
            presencePointsMonitor.run(client, logger, newMember);
        }

    } catch (err) {
        logger.error(`[/events/presenceUpdate.js] ${err.message}`);
    }
}