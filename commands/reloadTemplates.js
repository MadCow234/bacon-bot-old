exports.run = async(client, logger, message) => {
    try {
        // TODO Make this work in DMs (problem is with mod roles below)
        if (message.channel.type !== 'text') return message.author.send("This command is currently only available in a text channel.");

        // Delete the command message
        await message.delete();

        let embedTemplates = require("../templates/embed.js");

        // Get the guild role for the configured mod name
        const config = require("../config.json");
        const modRole = message.guild.roles.find("name", config.modRoleName);

        // Display an error message and exit if the mod role does not exist in the guild
        if (!modRole) return message.channel.send(embedTemplates.newErrorEmbed(client, `The '${config.modRoleName}' role does not exist`));

        // Display an unauthorized message and exit if the user does not have mod role permissions
        if (!message.member.roles.has(modRole.id)) {
            return message.channel.send(embedTemplates.newUnauthorizedEmbed(client, message.author.username));
        }

        let reloadedTemplates = new Array();

        // Update the cache for each template file
        require("fs").readdirSync("./templates/")
            .forEach(file => {
                delete require.cache[require.resolve(`../templates/${file}`)];
                reloadedTemplates.push(file.split(".")[0]);
            });

        return message.channel.send(embedTemplates.newReloadTemplatesEmbed(client, reloadedTemplates));

    } catch (err) {
        logger.error(`[/commands/reloadTemplates.js] ${err.message}`);
    }
}