exports.run = (client, logger, message, args) => {
    // TODO Make this work in DMs (problem is with mod roles below)
    if (message.channel.type !== 'text') return message.author.send("This command is currently only available in a text channel.");

    // Delete the command message
    if (message.channel.type === "text") message.delete();

    const Discord = require("discord.js");

    const config = require("../config.json");
    const modRole = message.guild.roles.find("name", config.modRoleName);

    if (!modRole)
        return console.log(`The '${config.modRoleName}' role does not exist`);

    if (!message.member.roles.has(modRole.id))
        return message.channel.send(`I'm sorry ${message.author.username}, this command is only for ${config.modRoleName}.`);

    const commands = require("../resources/commands.json");

    if (args.length == 0)
        return message.author.send(`\`\`\`json\n${JSON.stringify(commands, null, 2)}\n\`\`\``);

    if (args.length != 2)
        return message.channel.send(`I'm glad to update the commands file for you ${message.author.username}, but I need 2 arguments: <'enable' or 'disable'> <command>.`);


    let arg = args.shift().toLowerCase();
    let command = args.shift().toLowerCase();

    if (arg !== "enable" && arg !== "disable") return message.channel.send(`I'm glad to update the commands file for you ${message.author.username}, but I need your first argument to be either 'enable' or 'disable'.`);

    arg === "enable" ? arg = true : arg = false;

    if (!commands.hasOwnProperty(command)) return message.channel.send(`I'm sorry, '${command}' is not a valid command.`);

    commands[command] = JSON.parse(arg);

    const fs = require("fs");
    // Save the updated config object to the file
    fs.writeFile("./resources/commands.json", JSON.stringify(commands), (err) => console.error);

    message.channel.send(`The following command has been updated: '${command}' : '${arg}'`);

    logger.info(`${message.author.username} has updated the commands file: '${command}' : '${arg}'`);


}