exports.run = async (client, logger, message) => {
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

    let reloadedEvents = new Array();

    
    // Initialize a connection to the database
    const sql = await require("sqlite");
    await sql.open("./data/baconbot.sqlite");

    const fs = require("fs");
    fs.readdir("./events/", (err, files) => {
        files.forEach(file => {
            // Update the cache for each event file
            delete require.cache[require.resolve(`../events/${file}`)];            
            let eventFunction = require(`../events/${file}`);
            let eventName = file.split(".")[0];
            console.log(eventFunction);
            client.on(eventName, (...args) => eventFunction.run(client, logger, ...args));
            
            reloadedEvents.push(file.split(".")[0]);
        });
    
        let embedTemplates = require("../templates/embed.js");

        return message.channel.send(embedTemplates.newReloadEventsEmbed(client, reloadedEvents));
    });
}