exports.run = async(client, logger, message) => {
    try {
        // Delete the command message
        if (message.channel.type === "text") await message.delete();

        const sql = require("sqlite");
        const embedTemplates = require("../templates/embed.js");

        // Get a user from the 'user' table, using the user's id
        let userRow = await sql.get(`SELECT * FROM user WHERE discord_id = "${message.author.id}"`);

        // Display the user's points to the channel
        // If a user has not earned any points, a message explaining how to earn points will be displayed
        await message.channel.send(embedTemplates.newPointsUserSummaryEmbed(client, message.author.username, userRow ? userRow.points : null));

    } catch (err) {
        // Log the error
        logger.error(`[/commands/points.js] ${err.message}`);
    }
}