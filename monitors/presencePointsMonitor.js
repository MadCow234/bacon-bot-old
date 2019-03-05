exports.run = async(client, logger, newMember) => {
    try {
        // Execute the reactionPointsMonitor if points are enabled    
        const config = require("../config.json");
        if (config.monitorPoints == false) return;

        const sql = require("sqlite");

        // Get the user from the 'user' table
        let userRow = await sql.get(`SELECT * FROM user WHERE discord_id = "${newMember.user.id}"`);

        if (!userRow) {
            // If a userRow was not returned, we need to create one
            const domain = require("../domain.js");
            let successMessage = await domain.initUser(client, newMember.user);
            logger.info(successMessage);

            // Get the newly created user from the 'user' table
            userRow = await sql.get(`SELECT * FROM user WHERE discord_id = "${newMember.user.id}"`);
        }

        // Increase the user's score by 10 points
        await sql.run(`UPDATE user SET points = ${userRow.points + 10} WHERE discord_id = "${newMember.user.id}"`);
        logger.info(`${newMember.user.username} has earned 10 points. Reason: 'playing', Name: '${newMember.presence.activity.name}'`);

    } catch (err) {
        logger.error(`[/monitors/presencePointsMonitor.js] ${err.message}`);
    }
}