const path = require('path');
const consola = require('consola')

// Here we define all of our commands and manually append them in the arrary for discord.js to load
import ping from './commands/basic/ping'
import echo from './commands/basic/echo'
import play from './commands/basic/audio/play'
import skip from './commands/basic/audio/skip'
let Files = [ping, echo, play, skip]

export function init(client, prefix: string) {
    for (const file of Files) {
        consola.success('Loaded: ' + file.name)
        client.commands.set(file.name, file)
    }
    client.on('message', message => {
        consola.info(`${message.author.username} Posted: '${message.content}' - ${message.createdTimestamp}`)
        if (message.content === 'prefix') {
            message.channel.send(`Prefix is: '${prefix}'`)
        }
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        if (!client.commands.has(command)) return;
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