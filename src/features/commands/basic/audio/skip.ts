const fs = require('fs');
const ytdl = require('ytdl-core');
import { queue } from './play'
export default {
    name: 'skip',
    description: 'Plays audio from several sources!',
    execute(message, args, client?) {
        var toSkip = Math.min(1, queue.length);
        queue.splice(0, toSkip - 1);

        // Resume and stop playing.
        var voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id)
        const dispatcher = voiceConnection.player.dispatcher
        if (voiceConnection.paused) dispatcher.resume();
        dispatcher.end();
    }
}