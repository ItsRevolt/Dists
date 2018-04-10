const path = require('path');
const consola = require('consola')

// Here we define all of our commands and manually append them in the array for discord.js to load
// Basic
import ping from './commands/basic/ping'
import echo from './commands/basic/echo'
// Audio
import play from './commands/basic/audio/play'
import queue from './commands/basic/audio/queue'
import skip from './commands/basic/audio/skip'
import stop from './commands/basic/audio/stop'
// Fun
import fuck from './commands/fun/fuck'
let Files = [ping, echo, play, skip, queue, stop, fuck]

export function init(client, prefix: string) {
    // Get list of commands from array of files, import them, and log
    for (const file of Files) {
        consola.success('Loaded: ' + file.name)
        client.commands.set(file.name, file)
    }

    client.on('message', message => {
        //Log all messages
        consola.info(`${message.author.username} Posted: '${message.content}' - ${message.createdTimestamp}`)
        //Add direct check that tells prefix
        if (message.content === 'prefix') {
            message.channel.send(`Prefix is: '**${prefix}**'`)
        }
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        // Check if command needs args-pulled from command file, replies accordingly
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.channel.send(reply);
        }
        if (!client.commands.has(command)) return;
        //Execute commands
        try {
            client.commands.get(command).execute(message, args, client);
        }
        catch (error) {
            consola.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    });
    process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));
}