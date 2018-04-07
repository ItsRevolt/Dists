const path = require('path');
const consola = require('consola')

// Here we define all of our commands and manually append them in the arrary for discord.js to load
import ping from './commands/basic/ping'
import echo from './commands/basic/echo'
let Files = [ping, echo]

export function init(client, prefix: string) {
    for (const file of Files) {
        consola.info(file)
        client.commands.set(file.name, file)
    }
    client.on('message', message => {
        consola.info(message.content)
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).execute(message, args);
        }
        catch (error) {
            consola.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    });
}