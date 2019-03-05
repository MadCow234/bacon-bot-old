exports.run = async(client, logger, message, args) => {
    // TODO Make this work in DMs (problem is with mod roles below)
    if (message.channel.type !== 'text') return message.author.send("This command is currently only available in a text channel.");

    // Delete the command message
    await message.delete();

    const Discord = require("discord.js");

    const config = require("../config.json");
    const modRole = message.guild.roles.find("name", config.modRoleName);

    if (!modRole) return console.log(`The '${config.modRoleName}' role does not exist`);

    if (!message.member.roles.has(modRole.id))
        return message.channel.send(`I'm sorry ${message.author.username}, this command is only for ${config.modRoleName}.`);

    if (args.length != 1)
        return message.channel.send(`I'm glad to delete some messages for you ${message.author.username}, you just have to tell me how many.`);

    if (isNaN(parseInt(args)))
        return message.channel.send(`I'm glad to delete some messages for you ${message.author.username}, but '${args}' is not a number.`);

    var embed;
    var numDeleted;

    if (args < 2 || args > 100) {
        return message.channel.send(new Discord.MessageEmbed()
            .setColor(!config.delReportEmbed ? config.baseColor : !config.delReportEmbed.color ? config.baseColor : config.delReportEmbed.color)
            .setTimestamp()
            .setDescription(`I'm glad to delete some messages for you ${message.author.username}, but I can only delete between 2 and 100 messages.`));
    }


    message.channel.fetchMessages({
            limit: args
        })
        .then(messages => message.channel.bulkDelete(messages).then(deleted => numDeleted = deleted.size))
        .then(messages => embed = new Discord.MessageEmbed()
            .setTitle(`Message Deletion Report`)
            .setColor(!config.delReportEmbed ? config.baseColor : !config.delReportEmbed.color ? config.baseColor : config.delReportEmbed.color)
            .setTimestamp()
            .setDescription(`I deleted ${numDeleted} messages for you, ${message.author.username}.`)
            .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390386951557218315/dottedClose.gif")
            .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png"))
        .then(messages => message.channel.send(embed)
            .then(m => m.delete(3100)))
        .catch(err => console.error(err));
}















// Works for 12.0

// message.channel.bulkDelete(args.toString()).then(deleted => numDeleted = deleted.size)
//             .then(messages => embed = new Discord.MessageEmbed()
//                 .setTitle(`Message Deletion Report`)
//                 .setColor(!config.delReportEmbed ? config.baseColor : !config.delReportEmbed.color ? config.baseColor : config.delReportEmbed.color)
//                 .setTimestamp()
//                 .setDescription(`I deleted ${numDeleted} messages for you, ${message.author.username}.`)
//                 .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390386951557218315/dottedClose.gif")
//                 .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png"))
//             .then(messages => message.channel.send(embed)
//                 .then(m => m.delete({timeout: 3100})))
//             .catch(err => console.error(err));