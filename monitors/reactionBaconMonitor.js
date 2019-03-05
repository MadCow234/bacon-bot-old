exports.run = async(client, logger, messageReaction) => {
    try {
        var sendEmoji;

        // Either react with the bacon unicode emoji, or with the same bacon-themed custom emoji that was added by the user
        messageReaction.emoji.name === '🥓' ? sendEmoji = '🥓' : sendEmoji = messageReaction.emoji;
        setTimeout(() => {
            messageReaction.message.react(sendEmoji)
        }, 1800);

    } catch (err) {
        logger.error(`[/monitors/reactionBaconMonitor.js] ${err.message}`);
    }
}