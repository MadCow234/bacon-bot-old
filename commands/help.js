exports.run = (client, logger, message) => {
    // Delete the command message
    message.delete();
    message.author.send(`Help is coming!`);
}