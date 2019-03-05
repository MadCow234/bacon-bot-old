exports.run = (client, logger, message, args) => {
    // TODO Make this work in DMs (problem is with mod roles below)
    if (message.channel.type !== 'text') return message.author.send("This command is currently only available in a text channel.");

    // Delete the command message
    message.delete();

    const Discord = require("discord.js");
    const config = require("../config.json");
    const modRole = message.guild.roles.find("name", config.modRoleName);

    if (!modRole)
        return console.log(`The '${config.modRoleName}' role does not exist`);

    if (!message.member.roles.has(modRole.id))
        return message.channel.send(`I'm sorry ${message.author.username}, this command is only for ${config.modRoleName}.`);

    if (args.length == 0)
        return message.author.send(`\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``);

    if (args.length != 2)
        return message.channel.send(`I'm glad to update the config file for you ${message.author.username}, but I need 2 arguments: <key> <value>.`);

    const key = args.shift();
    const value = args.shift();

    if (key.includes(".")) {

        var keys = key.split(".");
        var i = 1;
        var prop = keys[0];
        var foundKey = false;

        const updateProperty = (prop, value, config) =>
            config.constructor === Object && Object.keys(config).forEach(key => {
                if (key === prop) {
                    if (i == keys.length) {
                        config[key] = JSON.parse(value);
                        foundKey = true;
                    } else {
                        prop = keys[i];
                    }
                    i++;
                }
                updateProperty(prop, value, config[key]);
            })

        updateProperty(prop, value, config);

        if (foundKey === false) return message.channel.send(`I'm sorry, '${key}' is not a valid config.`);

        const fs = require("fs");
        // Save the updated config object to the file
        fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);

    } else {

        if (!config.hasOwnProperty(key)) return message.channel.send(`I'm sorry, '${key}' is not a valid config.`);

        config[key] = JSON.parse(value);

        const fs = require("fs");
        // Save the updated config object to the file
        fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
    }

    message.channel.send(`The following config has been updated: '${key}' : '${value}'`);

    logger.info(`${message.author.username} has updated the config file: '${key}' : '${value}'`);
}