exports.run = async(client, logger, message) => {
    try {
        // Delete the command message
        if (message.channel.type === "text") message.delete();

        let embedTemplates = require("../templates/embed.js");

        // Initialize a connection to the database
        const sql = require("sqlite");

        // Get the top 10 users with the most points
        let rows = await sql.all(`SELECT * FROM user WHERE discord_id != "${client.user.id}" ORDER BY points DESC LIMIT 10`);

        // Display the user's points to the channel
        await message.channel.send(embedTemplates.newPointsLeaderboardEmbed(client, rows));

    } catch (err) {
        logger.error(`[/commands/leaderboard.js] ${err.message}`);
    }
}