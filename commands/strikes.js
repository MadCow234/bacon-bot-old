exports.run = async(client, logger, message, [arg, mention, ...reason]) => {
    try {
        // TODO Make this work in DMs (problem is with mod roles below)
        if (message.channel.type !== 'text') return message.author.send("This command is currently only available in a text channel.");

        // Delete the command message
        await message.delete();

        const commands = require("../resources/commands.json");

        if (commands.strikes === false)
            return message.channel.send(`I'm sorry ${message.author.username}, this command has been disabled.`);

        const strikeUser = message.mentions.members.first().user;

        const sql = require("sqlite");
        // Get the user from the 'user' table
        let userRow = await sql.get(`SELECT * FROM user WHERE discord_id = "${strikeUser.id}"`);

        if (!userRow) {
            // If a userRow was not returned, we need to create one
            const domain = require("../domain.js");
            let successMessage = await domain.initUser(client, message.author);
            logger.info(successMessage);

            // Get the newly created user from the 'user' table
            userRow = await sql.get(`SELECT * FROM user WHERE discord_id = "${strikeUser.id}"`);
        }

        let strikeRows = await sql.all(`SELECT * FROM strikes WHERE user_id = ${userRow.id} ORDER BY date_added DESC`);

        if (arg.toString() === "show") {
            let description = "";
            strikeRows.forEach(row => {
                description += `\n     ${row.date_added}: ${row.reason}`;
            });
            return message.channel.send(`${strikeUser.username} currently has ${strikeRows.length} strikes:${description}`);
        }

        if (arg.toString() === "add") {
            if (reason.length === 0) return message.channel.send(`Please include a reason for the strike. Ex: bb-strikes add <@mention> <reason here>`);
            await sql.run(`INSERT INTO strikes (user_id, reason) VALUES (?, ?)`, [userRow.id, reason.join(" ")]);
            let strikeRows = await sql.all(`SELECT * FROM strikes WHERE user_id = ${userRow.id}`);

            console.log(strikeRows);
            message.channel.send(`${strikeUser.username} currently has ${strikeRows.length} strikes.`);
        }


        // if (arg.toString() === "remove") {
        //     userData.strikes--;
        //     return client.data.set(kickMember.id, userData)
        //         .then(message.channel.send(`${kickMember.username} currently has ${userData.strikes} strikes.`));
        // }

    } catch (err) {
        logger.error(`[/commands/strikes.js] ${err.message}`);
    };
}