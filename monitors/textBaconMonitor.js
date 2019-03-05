exports.run = async(client, logger, message) => {
    try {
        // Add a bacon reaction if the message contains the word 'bacon'
        if (message.content.toLowerCase().includes("bacon"))
            setTimeout(() => {
                message.react('🥓')
            }, 1800);

        // Go crazy if the message contains the phrase 'i love bacon'
        if (message.content.toLowerCase().includes("i love bacon")) {
            setTimeout(() => {
                message.channel.send(`***OMFG ${message.author.username.toUpperCase()}, BACON IS THE SHIT!***`)
            }, 2100);
            setTimeout(() => {
                message.author.send(`No, seriously...bacon. Am I right?`)
            }, 16000);
            setTimeout(() => {
                message.author.send(`I don't think you understand.`)
            }, 76000);
            setTimeout(() => {
                message.author.send(`I have killed a man for bacon.`);
            }, 106000);
            setTimeout(() => {
                message.author.send(`Have you?`);
            }, 126000);
            setTimeout(() => {
                message.author.send(`Would you like to?`);
            }, 136000);
        }

    } catch (err) {
        logger.error(`[/monitors/textBaconMonitor.js] ${err.message}`);
    }
}