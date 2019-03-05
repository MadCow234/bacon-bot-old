exports.initDatabase = new Promise(async function (resolve, reject) {
    try {
        const sql = require("sqlite");

        // Create the /data/ directory if it does not already exist
        const fs = require("fs");
        if (!fs.existsSync("./data/")) {
            fs.mkdirSync("./data/");
        }

        // Create the 'user' table
        await sql.run(`CREATE TABLE IF NOT EXISTS user (
                            id INTEGER PRIMARY KEY AUTOINCREMENT, 
                            discord_id TEXT UNIQUE, 
                            username TEXT, 
                            points INTEGER DEFAULT 0
                        )`);

        // Create the 'strikes' table
        await sql.run(`CREATE TABLE IF NOT EXISTS strikes (
                            id INTEGER PRIMARY KEY AUTOINCREMENT, 
                            user_id INTEGER, 
                            reason TEXT, 
                            date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
                            FOREIGN KEY(user_id) REFERENCES user(id)
                        )`);

        resolve("Database exists. Tables: user, strikes");

    } catch (err) {
        reject(err);
    }
});

exports.initUser = (client, user) => new Promise(async function (resolve, reject) {
    try {
        const sql = require("sqlite");

        // Insert the new user into the 'user' table
        await sql.run(`INSERT INTO user (discord_id, username) VALUES (?, ?)`, [user.id, user.username]);

        // Inform the new user that they have earned their first point
        let embedTemplates = require("./templates/embed.js");
        await user.send(embedTemplates.newFirstPointsEmbed(client, user.username));

        resolve(`User added to database. ID: '${user.id}', Username: '${user.username}'.`);

    } catch (err) {
        reject(err);
    }
});