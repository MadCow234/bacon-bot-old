exports.run = async(client, logger, oldUser, newUser) => {
    try {
        // Don't respond to bots...unless I'm the one adding the reaction
        if ((newUser.bot || newUser.bot) && newUser.id != client.user.id) return;

        const sql = require("sqlite");

        if (newUser.username != oldUser.username) {
            // Get the user from the 'users' table
            let row = await sql.get(`SELECT * FROM users WHERE user_id = "${newUser.id}"`);

            // Exit if the user has not yet been registered in the database
            if (!row) return;

            // Update the user's username
            await sql.run(`UPDATE users SET username = "${newUser.username}" WHERE user_id = "${newUser.id}"`);
            logger.info(`${newUser.id} has changed their username. Old: '${oldUser.username}', New: '${newUser.username}'`);
        }

    } catch (err) {
        logger.error(`[/events/userUpdate.js] ${err.message}`);
    }
}