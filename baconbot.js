// Create a Discord client
const Discord = require("discord.js");
var client = new Discord.Client();

// Create a logger
const winston = require("winston");
const logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: "BaconBot.log"
        })
    ]
})

// Initialize a connection to the database
const sql = require("sqlite");
sql.open("./data/baconbot.sqlite");

// Get the login token
const secrets = require("./resources/secrets.json");
const token = secrets.token;

// Read the /events/ directory and attach each event file to the appropriate event
// We are going to perform this read before allowing the bot to log in to Discord, otherwise events will not work
const fs = require("fs");
fs.readdir("./events/", (err, files) => {
    if (err) {
        console.error("BaconBot failed to log in! An error has been placed in the logs.");
        return logger.error(`Login failed! Reason: '${err.message}'`);
    }
    if (files.length < 1) {
        console.error("BaconBot failed to log in! An error has been placed in the logs.");
        return logger.error("Login failed! Reason: 'No events have been defined in the /events/ directory.'");
    }

    // Create a listener for each event in the /events/ directory
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunction.run(client, logger, ...args));
    });

    initiateLogin();
});

var initiateLogin = async() => {
    try {
        const domain = require("./domain.js");

        // Ensure that the data directory and table files exist before the client logs in
        let successMessage = await domain.initDatabase;

        // We can login now that the database has been initialized
        logger.info(successMessage);
        return client.login(token);

    } catch (err) {
        console.error(`${client.user.username} failed to log in! An error has been placed in the logs.`);
        return logger.error(`Login failed! Reason: '${err.message}'`);
    };
}