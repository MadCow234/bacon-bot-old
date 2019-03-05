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

        let reloadedCommands = new Array();

        // Update the cache for each command file
        require("fs").readdirSync("./commands/")
            .forEach(file => {
                let command = file.split(".")[0];
                // This seems to be the only way for this file to resolve itself in cache
                // Just setting this to resolve './${file}' works for all other files except itself
                delete require.cache[require.resolve(`./${command.toLowerCase()}.js`)];
                reloadedCommands.push(command);
            });

        let embedTemplates = require("../templates/embed.js");
        return message.channel.send(embedTemplates.newReloadCommandsEmbed(client, reloadedCommands));

    } catch (err) {
        logger.error(`[/commands/reloadCommands.js] ${err.message}`);
    }
}