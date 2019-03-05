exports.run = async(client, logger, message) => {
    try {
        // TODO Make this work in DMs (problem is with mod roles below)
        if (message.channel.type !== 'text') return message.author.send("This command is currently only available in a text channel.");

        // Delete the command message
        message.delete();

        const config = require("../config.json");
        const modRole = message.guild.roles.find("name", config.modRoleName);
        if (!modRole) return console.log(`The '${config.modRoleName}' role does not exist`);

        if (!message.member.roles.has(modRole.id)) return message.channel.send(`I'm sorry ${message.author.username}, this command is only for ${config.modRoleName}.`);

        message.channel.send(`Ok fine, ${message.author.username}, I'LL LEAVE!`);

        client.destroy();

    } catch (err) {
        logger.error(`[/commands/leave.js] ${err.message}`);
    }
}