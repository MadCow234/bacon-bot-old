exports.run = async(client, logger, message) => {
    try {
        const Discord = require("discord.js");
        const config = require("../config.json");
        let embed = new Discord.MessageEmbed()
            .setTitle(`Ping pong`)
            .setColor(!config.readyEmbed ? config.baseColor : !config.readyEmbed.color ? config.baseColor : config.readyEmbed.color)
            .setDescription(`Fine ${message.author.username}...pong.`)
            .setThumbnail("https://cdn.discordapp.com/attachments/387026235458584597/390386949631901706/flickerError.gif")

        message.channel.send(embed).catch(console.error);

    } catch (err) {
        logger.error(`[/commands/ping.js] ${err.message}`);
    }
}