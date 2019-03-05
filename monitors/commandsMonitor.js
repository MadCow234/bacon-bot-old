exports.run = async(client, logger, message) => {
    const config = require("../config.json");
    const embedTemplates = require("../templates/embed.js");

    try {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        // Exit and notify the user if they did not provide a command
        if (command.length === 0)
            return message.channel.send(embedTemplates.newErrorEmbed(client, `Hi ${message.author.username}! I'm doing well, but I can't help you if you don't issue a command.`))

        // Read the /commands/ folder and create a list of available commands to verify user-issued commands against
        // This is very important because the required commandFile below relies on user input to call a file, which can be very dangerous
        // We need to ensure that ONLY commands already available in the /commands/ folder actually load a file
        const fs = require("fs");
        let files = fs.readdirSync("./commands/");

        // Notify the user and exit if there are no files in the directory
        if (files.length < 1) {
            logger.error("No commands have been defined in the /commands/ folder.");
            return message.channel.send(embedTemplates.newErrorEmbed(client, `I'm so confused...I can't remember any commands right now.`))
        }

        // Add each file name (after stripping the .js extension) to a list of available commands
        let availableCommands = new Array();
        files.forEach(file => {
            availableCommands.push(file.split(".")[0].toLowerCase());
        });

        // Exit if no commands have been defined
        if (availableCommands.length === 0) return;

        // Exit and notify the user if they attempted to issue a command that is not available in the /commands/ folder
        if (availableCommands.indexOf(command) === -1)
            return message.channel.send(embedTemplates.newErrorEmbed(client, `I'm sorry, '${command}' is not a valid command.`));

        // Execute the proper command file
        let commandFile = require(`../commands/${command}.js`);
        return commandFile.run(client, logger, message, args);

    } catch (err) {
        logger.error(`[/monitors/commandsMonitor.js] ${err.message}`);
        return message.channel.send(embedTemplates.newErrorEmbed(client, `I'm so confused...I can't remember any commands right now.`))
    }
}