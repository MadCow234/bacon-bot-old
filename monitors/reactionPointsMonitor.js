exports.run = async(client, logger, messageReaction, user) => {
    try {
        // Execute the reactionPointsMonitor if points are enabled    
        const config = require("../config.json");
        if (config.monitorPoints == false) return;

        // Only monitor reactions in text channels
        if (messageReaction.message.channel.type !== 'text') return;

        const sql = require("sqlite");

        // Flag to know if the reaction was removed
        let removed = messageReaction.users.array().indexOf(user) === -1;

        // Get the user from the 'user' table
        let userRow = await sql.get(`SELECT * FROM user WHERE discord_id = "${user.id}"`);

        // A user loses 5 points for removing a reaction and earns 5 points for adding one
        let pointsEarned = removed ? -5 : 5;

        if (!userRow) {
            // If a userRow was not returned, we need to create one
            const domain = require("../domain.js");
            let successMessage = await domain.initUser(client, user);
            logger.info(successMessage);

            // Get the newly created user from the 'user' table
            userRow = await sql.get(`SELECT * FROM user WHERE discord_id = "${user.id}"`);

            // A new user can earn their first point for removing a reaction and earns 5 points for adding one
            pointsEarned = removed ? 1 : 5;
        }

        // Adjust the user's score appropriately
        await sql.run(`UPDATE user SET points = ${userRow.points + pointsEarned} WHERE discord_id = "${user.id}"`);
        logger.info(`${user.username} has ${removed ? 'lost' : 'earned'} 5 points. Reason: 'reaction ${removed ? 'removed' : 'added'}', Name: '${messageReaction.emoji.name}', Channel: '${messageReaction.message.channel.name}'`);

    } catch (err) {
        logger.error(`[/monitors/reactionPointsMonitor.js] ${err.message}`);
    }
}