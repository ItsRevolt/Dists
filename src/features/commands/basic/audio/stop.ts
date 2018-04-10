const fs = require('fs');
const ytdl = require('ytdl-core');
import { queue } from './play'
var queue2 = queue
export default {
    name: 'stop',
    description: 'Stops all audio playing, removes all in queue, and doesnt continue queue',
    execute(message, args, client?) {
        if (queue.length == 0) {
            return message.reply('You cannot stop a non-existent song! :raised_hands::skin-tone-5:')
        }
        queue2 = []
        var voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id)
        const dispatcher = voiceConnection.player.dispatcher
        if (voiceConnection.paused) dispatcher.resume();
        dispatcher.end();
        message.reply('**Stopped!** :ok_hand::skin-tone-5: ')
    }
}