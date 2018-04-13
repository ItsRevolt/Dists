const fs = require('fs');
const ytdl = require('ytdl-core');
import { queue } from './helpers'
export default {
    name: 'skip',
    description: 'Skips to next song in queue',
    execute(message, args, client?) {
        if (queue.length === 0) {
            return message.reply('You cannot skip a non-existent song! :raised_hands::skin-tone-5:')
        }
        var toSkip = Math.min(1, queue.length);
        queue.splice(0, toSkip - 1);
        // Resume and stop playing.
        var voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id)
        const dispatcher = voiceConnection.player.dispatcher
        if (voiceConnection.paused) dispatcher.resume();
        dispatcher.end();
        message.reply('**Skipped!** :ok_hand::skin-tone-5:')
    }
}