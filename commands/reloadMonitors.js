exports.run = async(client, logger, message) => {
    try {
        // TODO Make this work in DMs (problem is with mod roles below)
        if (message.channel.type !== 'text') return message.author.send("This command is currently only available in a text channel.");

        // Delete the command message
        await message.delete();

        const Discord = require("discord.js");
        const config = require("../config.json");
        const modRole = message.guild.roles.find("name", config.modRoleName);
        if (!modRole) return console.log(`The '${config.modRoleName}' role does not exist`);

        if (!message.member.roles.has(modRole.id)) {
            let embed = new Discord.MessageEmbed()
                .setColor(config.standardEmbed.color)
                .setTimestamp()
                .setDescription(`I'm sorry ${message.author.username}, this command is only for ${config.modRoleName}.`)

            return message.channel.send(embed);
        }

        let reloadedMonitors = new Array();

        // Update the cache for each monitor file
        require("fs").readdirSync("./monitors/")
            .forEach(file => {
                delete require.cache[require.resolve(`../monitors/${file}`)];
                reloadedMonitors.push(file.split(".")[0]);
            });

        let embedTemplates = require("../templates/embed.js");
        return message.channel.send(embedTemplates.newReloadMonitorsEmbed(client, reloadedMonitors));

    } catch (err) {
        logger.error(`[/commands/reloadMonitors.js] ${err.message}`);
    }
}