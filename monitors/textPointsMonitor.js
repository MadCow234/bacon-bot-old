exports.run = async(client, logger, message) => {
    try {
        // Only monitor points in text channels
        if (message.channel.type !== 'text') return;

        // Do not increase points for using commands
        const config = require("../config.json");
        if (message.content.startsWith(config.prefix)) return;

        const sql = require("sqlite");

        // Get the user from the 'user' table
        let userRow = await sql.get(`SELECT * FROM user WHERE discord_id = "${message.author.id}"`);

        if (!userRow) {
            // If a userRow was not returned, we need to create one
            const domain = require("../domain.js");
            let successMessage = await domain.initUser(client, message.author);
            logger.info(successMessage);

            // Get the newly created user from the 'user' table
            userRow = await sql.get(`SELECT * FROM user WHERE discord_id = "${message.author.id}"`);
        }

        // Increase the user's score by 1 point
        await sql.run(`UPDATE user SET points = ${userRow.points + 1} WHERE discord_id = "${message.author.id}"`);
        logger.info(`${message.author.username} has earned 1 point. Reason: 'text', Channel: '${message.channel.name}'`);

    } catch (err) {
        logger.error(`[/monitors/textPointsMonitor.js] ${err.message}`);
    }
}