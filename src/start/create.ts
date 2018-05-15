import { client, login, prefix, important, success, error } from '../helpers'
import ping from '../commands/basic/ping'
import echo from '../commands/basic/echo'
// Audio
import play from '../commands/basic/audio/play'
import queue from '../commands/basic/audio/queue'
import skip from '../commands/basic/audio/skip'
import stop from '../commands/basic/audio/stop'
// Fun
import fuck from '../commands/fun/fuck'
let Files = [ping, echo, play, skip, queue, stop, fuck]
export function create() {
    for (const file of Files) {
        console.log(success('Loaded: ') + file.name)
        client.commands.set(file.name, file)
    }

    client.on('message', message => {
        //Log all messages
        console.info(`${important(message.author.username)} Posted: '${success(message.content)}' - ${error(message.createdTimestamp)}`)
        //Add direct check that tells prefix
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        try {
            command.execute(message, args, client);
        }
        catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    });
    login()
}