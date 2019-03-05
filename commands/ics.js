exports.run = async(client, logger, message, args) => {
    // Delete the command message
    await message.delete();

    const Discord = require("discord.js");
    const config = require("../config.json");
    const messageConstants = require("../resources/message-constants.json");

    // If no arguments are passed, just execute the countdown now
    if (args.length == 0)
        return displayCountdown("instant");

    try {
        var readyCheckUsersMap = new Map();
        var mentionsOutputArray = [];
        var readyUsers = [];
        var unreadyUsers = [];
        var alertMessages = [];

        // If one of the arguments is 'crew', add the list of crew IDs (from secrets.json) to the readyCheckUsersMap
        if (args.toString().includes("crew")) {
            const secrets = require("../resources/secrets.json");
            let crewIDs = secrets.crewIDs;
            for (var user in crewIDs) {
                if (crewIDs.hasOwnProperty(user)) {
                    let crewUser = await client.users.fetch(crewIDs[user]);
                    readyCheckUsersMap.set(crewUser, false);
                }
            }
        }

        // If the message contains any mentions, add them to the readyCheckUsersMap
        let mentionsArray = message.mentions.users.array();
        if (mentionsArray.length > 0) {
            mentionsArray.forEach(user => {
                readyCheckUsersMap.set(user, false);
            });
        }

        // Build a mentionsOutputArray by creating mentions for each user in the readyCheckUsersMap
        for (var [key, value] of readyCheckUsersMap.entries()) {
            mentionsOutputArray.push(`<@!${key.id}>`);
            value === true ? readyUsers.push(`<@!${key.id}>`) : unreadyUsers.push(`<@!${key.id}>`)
        }

        // Send the READY_UP alert, wait for the server to receive and return it, then save it
        let readyUpMessage = await message.channel.send(messageConstants.ALERT.READY_UP + mentionsOutputArray.join(", ")).catch(err => console.log(err));

        // Initialize the readyCheckLobby, wait for the server to receive and return it, then save it
        let readyCheckLobby = null;
        readyCheckLobby = await setReadyCheckLobby(readyCheckLobby);

        // Add menu reactions to the readyUpMessage
        await readyCheckLobby.react('🆗');
        await readyCheckLobby.react('🔄');
        await readyCheckLobby.react('🛑');
        await readyCheckLobby.react('🔔');

        // Create a reaction collector to handle menu actions
        let reactionCollector = readyCheckLobby.createReactionCollector(
            (reaction, user) => user != client.user
        );
        reactionCollector.on('collect', async(r) => {

            // Fetch the users that have added this reaction to the message
            let users = await r.users.fetch();

            // Remove the reaction and exit if it is not a menu item
            if (!['🆗', '🔄', '🛑', '🔔'].includes(r.emoji.name)) {
                return users.forEach(async(user) => {
                    if (user == client.user) return;
                    // Remove the reaction because it isn't part of the menu
                    await r.remove(user.id);
                });
            }

            // Handle the menu actions
            switch (r.emoji.name) {

                // User is ready
                case '🆗':
                    users.forEach(async(user) => {
                        if (user == client.user) return;
                        // Remove reaction if the user is not in the readyCheckUsersMap
                        if (!readyCheckUsersMap.has(user)) return await r.remove(user.id);

                        readyCheckUsersMap.set(user, true);
                    });

                    readyUsers = [];
                    unreadyUsers = [];

                    for (var [key, value] of readyCheckUsersMap.entries())
                        value === true ? readyUsers.push(`<@!${key.id}>`) : unreadyUsers.push(`<@!${key.id}>`)

                    readyCheckLobby = await setReadyCheckLobby(readyCheckLobby);

                    if (readyUsers.length == readyCheckUsersMap.size) {
                        reactionCollector.stop();
                        let messagesToDelete = alertMessages;
                        messagesToDelete.push(readyUpMessage);
                        messagesToDelete.push(readyCheckLobby);
                        message.channel.bulkDelete(messagesToDelete).catch(err => console.log(err));
                        return displayCountdown("readyCheck")
                    }
                    break;

                    // User restarts the countdown
                case '🔄':
                    users.forEach(async(user) => {
                        if (user == client.user) return;

                        // This reaction gets removed regardless of the user
                        r.remove(user.id);

                        // Remove reaction if the user is not in the readyCheckUsersMap
                        if (!readyCheckUsersMap.has(user)) return await r.remove(user.id);

                    });

                    readyCheckLobby.reactions.forEach(reaction => {
                        if (reaction.emoji.name === '🆗') {
                            reaction.users.fetch().then(users => {
                                users.forEach(user => {
                                    if (user != client.user) {
                                        reaction.remove(user.id);
                                    }
                                });
                            });
                        }
                    });

                    // Delete any alert messages that were sent                    
                    if (alertMessages.length === 1) {
                        alertMessages[0].delete();
                    } else if (alertMessages.length > 1) {
                        message.channel.bulkDelete(alertMessages).catch(err => console.log(err));
                    }

                    readyUsers = [];
                    unreadyUsers = [];

                    for (var [key, value] of readyCheckUsersMap.entries()) {
                        key[value] = false;
                        unreadyUsers.push(`<@!${key.id}>`);
                    }

                    readyCheckLobby = await setReadyCheckLobby(readyCheckLobby);

                    break;


                    // User cancels the countdown
                case '🛑':
                    users.forEach(async(user) => {
                        if (user == client.user) return;
                        // Remove reaction if the user is not in the readyCheckUsersMap
                        if (!readyCheckUsersMap.has(user)) return await r.remove(user.id);

                    });

                    reactionCollector.stop();

                    let messagesToDelete = alertMessages;
                    messagesToDelete.push(readyUpMessage);
                    messagesToDelete.push(readyCheckLobby);
                    message.channel.bulkDelete(messagesToDelete).catch(err => console.log(err));

                    let cancelEmbed = new Discord.MessageEmbed()
                        .setTitle(`ICS History Report`)
                        .setColor(!config.cancelEmbed ? config.baseColor : !config.cancelEmbed.color ? config.baseColor : config.cancelEmbed.color)
                        .setTimestamp()
                        .setDescription(`${users.first().username} has cancelled the countdown.`)
                        .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390386951557218315/dottedClose.gif")
                        .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

                    await message.channel.send(cancelEmbed);

                    break;


                    // User alerts any unready users
                case '🔔':
                    return await alertUnreadyUsers(r, users)
                    break;

            }
        });

        // If a user removes their "ok" reaction, we need to remove them from the readyUsers list and add them to the unreadyUsers list
        client.on("messageReactionRemove", async(messageReaction, user) => {
            if (messageReaction.emoji.name === '🆗' && readyCheckUsersMap.has(user)) {
                readyUsers = [];
                unreadyUsers = [];

                readyCheckUsersMap.set(user, false);

                for (var [key, value] of readyCheckUsersMap.entries()) {
                    value === true ? readyUsers.push(`<@!${key.id}>`) : unreadyUsers.push(`<@!${key.id}>`)
                }

                readyCheckLobby = await setReadyCheckLobby(readyCheckLobby);
            }
        });

    } catch (e) {
        console.error(e);
    }

    // Send then readyCheckLobby to the server and return the message
    async function setReadyCheckLobby(readyCheckLobby) {
        const Discord = require("discord.js");
        const config = require("../config.json");
        const messageConstants = require("../resources/message-constants.json");

        let readyCheckLobbyEmbed = new Discord.MessageEmbed()
            .setTitle(`Ready Check Lobby`)
            .setColor(!config.readyCheckLobbyEmbed ? config.baseColor : !config.readyCheckLobbyEmbed.color ? config.baseColor : config.readyCheckLobbyEmbed.color)
            .setTimestamp()
            .setDescription(messageConstants.ALERT.ICS)
            .addField("**Ready:**", `${readyUsers.length > 0 ? readyUsers.join(", ") : "Waiting..."}`)
            .addField("**Waiting For:**", `${unreadyUsers.length > 0 ? unreadyUsers.join(", "): "Everyone is ready!"}`)
            .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

        if (readyCheckLobby == null) {
            return await message.channel.send(readyCheckLobbyEmbed).catch(err => console.log(err));
        } else {
            return await readyCheckLobby.edit(readyCheckLobbyEmbed).catch(err => console.log(err));
        }
    }

    // Send a message that includes mentions of all the unready users
    async function alertUnreadyUsers(r, users) {
        let stop = false;
        users.forEach(async(user) => {
            if (user == client.user) return stop = true;

            // This reaction gets removed regardless of the user
            r.remove(user.id);

            // If the user is in the readyCheckUsersMap, alert the unready users
            if (!readyCheckUsersMap.has(user)) return stop = true;
        });

        if (stop) return;

        let alertMessage = await message.channel.send(messageConstants.ALERT.READY_UP + unreadyUsers.join(", ")).catch(err => console.log(err));
        return alertMessages.push(alertMessage);
    }

    // Displays the countdown
    async function displayCountdown(type) {
        const Discord = require("discord.js");
        const messageConstants = require("../resources/message-constants.json");

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        var historyDescription;
        var messagesToDelete = [];

        switch (type) {
            case "instant":
                historyDescription = `An instant countdown successfully completed.`;
                break;

            case "readyCheck":
                let hereWeGoMessage = await message.channel.send(messageConstants.ALERT.HERE_WE_GO + mentionsOutputArray.join(", "));
                messagesToDelete.push(hereWeGoMessage);
                historyDescription = `A countdown successfully completed for:\n${mentionsOutputArray.join(", ")}`;
                break;

            default:
                historyDescription = `A countdown successfully completed.`;
                break;
        }

        let countdownEmbed = new Discord.MessageEmbed()
            .setTitle(`Countdown Initiated`)
            .setColor(!config.countdownEmbed ? config.baseColor : !config.countdownEmbed.color ? config.baseColor : config.countdownEmbed.color)
            .setTimestamp()
            .setDescription(messageConstants.ALERT.ICS)
            .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

        let countdownEmbedMessage = await message.channel.send(countdownEmbed).catch(err => console.log(err));

        let countdown = messageConstants.COUNTDOWN;
        let description = messageConstants.ALERT.ICS;
        for (var line in countdown) {
            description += `\n\n${countdown[line]}`;
            countdownEmbed = new Discord.MessageEmbed()
                .setTitle(`Countdown Initiated`)
                .setColor(!config.countdownEmbed ? config.baseColor : !config.countdownEmbed.color ? config.baseColor : config.countdownEmbed.color)
                .setTimestamp()
                .setDescription(description)
                .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

            await delay(1100);
            countdownEmbedMessage = await countdownEmbedMessage.edit(countdownEmbed).catch(err => console.log(err));
        }

        let historyEmbed = new Discord.MessageEmbed()
            .setTitle(`ICS History Report`)
            .setColor(!config.icsHistoryReportEmbed ? config.baseColor : !config.icsHistoryReportEmbed.color ? config.baseColor : config.icsHistoryReportEmbed.color)
            .setTimestamp()
            .setDescription(historyDescription)
            .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/392302716782641162/simplerocketshipanimation.gif")
            .setAuthor(client.user.username, "https://cdn.discordapp.com/emojis/390007085326139393.png");

        await delay(5100);
        messagesToDelete.push(countdownEmbedMessage);
        messagesToDelete.length < 2 ? messagesToDelete[0].delete() : message.channel.bulkDelete(messagesToDelete).catch(err => console.log(err));
        message.channel.send(historyEmbed).catch(err => console.log(err));
    }
}