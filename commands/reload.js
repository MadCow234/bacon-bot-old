exports.run = async(client, logger, message, args) => {
    try {
        // TODO Make this work in DMs (problem is with mod roles below)
        if (message.channel.type !== 'text') return message.author.send("This command is currently only available in a text channel.");

        // Delete the command message
        message.delete();

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

        if (args.length < 1) {
            let embed = new Discord.MessageEmbed()
                .setColor(config.standardEmbed.color)
                .setTimestamp()
                .setDescription(`I'm glad to reload a command file for you ${message.author.username}, but which one(s)?`)

            return message.channel.send(embed);
        }

        const fs = require("fs");
        // Read the /commands/ folder and create a list of available commands to verify user-issued commands against
        // This is very important because the require() command below relies on user input to call a file, which can be very dangerous
        // We need to ensure that ONLY commands already available in the /commands/ folder actually load a file
        fs.readdir("./commands/", (err, files) => {
            if (err) {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Error Report`)
                    .setColor(!config.errorEmbed ? config.baseColor : !config.errorEmbed.color ? config.baseColor : config.errorEmbed.color)
                    .setTimestamp()
                    .setDescription(`I'm so confused...I can't remember any commands right now.`)
                    .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390386949631901706/flickerError.gif")
                    .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

                message.channel.send(embed);
                console.error("BaconBot failed to load commands! An error has been placed in the logs.");
                return logger.error(err.message);
            }

            let availableCommands = new Array();

            files.forEach(file => {
                let command = file.split(".")[0].toLowerCase();
                availableCommands.push(command);
            });

            reloadCommand(availableCommands);
        });

        function reloadCommand(availableCommands) {

            let reloadedCommands = new Array();
            let unavailableCommands = new Array();

            args.forEach(arg => {
                if (availableCommands.indexOf(arg) === -1) {
                    unavailableCommands.push(arg);
                    return;
                };
                // the path is relative to the *current folder*, so just ./filename.js
                delete require.cache[require.resolve(`./${arg}.js`)];
                reloadedCommands.push(arg);
            });

            if (unavailableCommands.length === 0) {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Command Reload Report`)
                    .setColor((!config.reloadReportEmbed || !config.reloadReportEmbed.color) ? config.baseColor : config.reloadReportEmbed.color)
                    .setTimestamp()
                    .setDescription(`Reloaded: ${reloadedCommands.join(", ")}`)
                    .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390384032828882944/reload2.gif")
                    .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

                message.channel.send(embed);
            } else {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Command Reload Report`)
                    .setColor((!config.reloadReportEmbed || !config.reloadReportEmbed.color) ? config.baseColor : config.reloadReportEmbed.color)
                    .setTimestamp()
                    .setDescription(`Reloaded: ${reloadedCommands.join(", ")}\nInvalid: ${unavailableCommands.join(", ")}`)
                    .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390384032828882944/reload2.gif")
                    .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

                message.channel.send(embed);
            };

            logger.info(`${message.author.username} has reloaded the following command files: ${reloadedCommands.join(", ")}.`);
        }
    } catch (err) {
        logger.error(`[/commands/reload.js] ${err.message}`);
    }
}