exports.newClientReadyEmbed = (client) => {    
    const Discord = require("discord.js");
    const config = require("../config.json");

    let clientReadyEmbed = new Discord.MessageEmbed()
    .setTitle(`It's bacon time`)
        .setColor((!config.clientReadyEmbed || !config.clientReadyEmbed.color) ? config.baseColor : config.clientReadyEmbed.color)
        .setTimestamp()
        .setDescription(`Never fear...**${client.user.username}** is here!`)
        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390427446266167296/baconkid.gif")
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return clientReadyEmbed;
}

exports.newErrorEmbed = (client, errorDescription) => {    
    const Discord = require("discord.js");
    const config = require("../config.json");

    let errorEmbed = new Discord.MessageEmbed()
        .setTitle(`Error Report`)
        .setColor((!config.errorEmbed || !config.errorEmbed.color) ? config.baseColor : config.errorEmbed.color)
        .setTimestamp()
        .setDescription(errorDescription)
        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390386949631901706/flickerError.gif")
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return errorEmbed;
}

exports.newUnauthorizedEmbed = (client, username) => {    
    const Discord = require("discord.js");
    const config = require("../config.json");

    let unauthorizedEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`Unauthorized`)
        .setColor((!config.unauthorizedEmbed || !config.unauthorizedEmbed.color) ? config.baseColor : config.unauthorizedEmbed.color)
        .setDescription(`I'm sorry **${username}**, this command is only for **${config.modRoleName}**.`)
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return unauthorizedEmbed;
}

exports.newPointsUserSummaryEmbed = (client, username, points) => {
    const Discord = require("discord.js");
    const config = require("../config.json");

    let pointsSummaryEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`Points Summary Report`)
        .setColor((!config.pointsSummaryEmbed || !config.pointsSummaryEmbed.color) ? config.baseColor : config.pointsSummaryEmbed.color)
        .setDescription(points ? `Hi **${username}**, you currently have **${points}** ${points === 1 ? 'point' : 'points'}.`: `Sadly **${username}**, you do not have points yet. Earn points by being active in chat channels.`)
        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390019695958425610/coin.gif")
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return pointsSummaryEmbed;
}

exports.newPointsLeaderboardEmbed = (client, leaderboardRows) => {
    const Discord = require("discord.js");
    const config = require("../config.json");

    let description = "";

    leaderboardRows.forEach(row => {
        description += `${row.username}: ${row.points}\n`;
    })

    let pointsLeaderboardEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`Points Leaderboard Report`)
        .setColor((!config.pointsLeaderboardEmbed || !config.pointsLeaderboardEmbed.color) ? config.baseColor : config.pointsLeaderboardEmbed.color)
        .setDescription(description)
        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390019695958425610/coin.gif")
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return pointsLeaderboardEmbed;
}

exports.newFirstPointsEmbed = (client, username) => {
    const Discord = require("discord.js");
    const config = require("../config.json");

    let firstPointsEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor((!config.firstPointsEmbed || !config.firstPointsEmbed.color) ? config.baseColor : config.firstPointsEmbed.color)
        .setDescription(`Congratulations ${username}, you have just earned your first point! Type 'bb-points' to see your total or 'bb-leaderboard' to see the Top 10. More information coming soon.`)
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return firstPointsEmbed;
}

exports.newReloadTemplatesEmbed = (client, reloadedTemplates) => {
    const Discord = require("discord.js");
    const config = require("../config.json");

    let reloadedTemplatesEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`Reloaded Templates Report`)
        .setColor((!config.reloadedTemplatesEmbed || !config.reloadedTemplatesEmbed.color) ? config.baseColor : config.reloadedTemplatesEmbed.color)
        .setDescription(`**Reloaded**: ${reloadedTemplates.join(", ")}`)
        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390384032828882944/reload2.gif")
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return reloadedTemplatesEmbed;
}

exports.newReloadEventsEmbed = (client, reloadedEvents) => {
    const Discord = require("discord.js");
    const config = require("../config.json");

    let reloadedEventsEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`Reloaded Events Report`)
        .setColor((!config.reloadedEventsEmbed || !config.reloadedEventsEmbed.color) ? config.baseColor : config.reloadedEventsEmbed.color)
        .setDescription(`**Reloaded**: ${reloadedEvents.join(", ")}`)
        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390384032828882944/reload2.gif")
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return reloadedEventsEmbed;
}

exports.newReloadCommandsEmbed = (client, reloadedCommands) => {
    const Discord = require("discord.js");
    const config = require("../config.json");

    let reloadedCommandsEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`Reloaded Commands Report`)
        .setColor((!config.reloadedCommandsEmbed || !config.reloadedCommandsEmbed.color) ? config.baseColor : config.reloadedCommandsEmbed.color)
        .setDescription(`**Reloaded**: ${reloadedCommands.join(", ")}`)
        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390384032828882944/reload2.gif")
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return reloadedCommandsEmbed;
}

exports.newReloadMonitorsEmbed = (client, reloadedMonitors) => {
    const Discord = require("discord.js");
    const config = require("../config.json");

    let reloadedMonitorsEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`Reloaded Monitors Report`)
        .setColor((!config.reloadedMonitorsEmbed || !config.reloadedMonitorsEmbed.color) ? config.baseColor : config.reloadedMonitorsEmbed.color)
        .setDescription(`**Reloaded**: ${reloadedMonitors.join(", ")}`)
        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390384032828882944/reload2.gif")
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return reloadedMonitorsEmbed;
}

exports.newReloadAllEmbed = (client, reloadedTemplates, reloadedCommands, reloadedMonitors) => {
    const Discord = require("discord.js");
    const config = require("../config.json");

    let reloadAllEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`Reload All Report`)
        .setColor((!config.reloadAllEmbed || !config.reloadAllEmbed.color) ? config.baseColor : config.reloadAllEmbed.color)
        .setDescription(`**Reloaded Templates:** ${reloadedTemplates.join(", ")}\n**Reloaded Commands:** ${reloadedCommands.join(", ")}\n**Reloaded Monitors:** ${reloadedMonitors.join(", ")}`)
        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390384032828882944/reload2.gif")
        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

    return reloadAllEmbed;
}