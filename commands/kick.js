exports.run = async(client, logger, message, [mention, ...reason]) => {
    try {
        // TODO Make this work in DMs (problem is with mod roles below)
        if (message.channel.type !== 'text') return message.author.send("This command is currently only available in a text channel.");

        // Delete the command message
        message.delete();

        const config = require("../config.json");
        const modRole = message.guild.roles.find("name", config.modRoleName);
        if (!modRole) return console.log(`The '${config.modRoleName}' role does not exist`);

        if (!message.member.roles.has(modRole.id)) return message.channel.send(`I'm sorry ${message.author.username}, this command is only for ${config.modRoleName}.`);

        if (message.mentions.members.size === 0) return message.channel.send(`I'm glad to kick someone for you ${message.author.username}, you just have to tell me who.`);

        const kickMember = message.mentions.members.first();
        const kickUsername = kickMember.user.username;

        kickMember.kick(reason.join(" ")).then(member => {
            message.channel.send(`${message.author.username} has kicked ${kickUsername} from the server. Reason: ${reason.join(" ")}.`);
        });

        logger.info(`${message.author.username} has kicked ${kickUsername} from the server. Reason: ${reason.join(" ")}`);

    } catch (err) {
        logger.error(`[/commands/kick.js] ${err.message}`);
    }
}