const fs = require('fs');
const ytdl = require('ytdl-core');
import { queue, resetQueue } from './play'
export default {
    name: 'stop',
    description: 'Stops all audio playing, removes all in queue, and doesnt continue queue',
    execute(message, args, client?) {
        resetQueue()
        var voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id)
        if (!voiceConnection) return
        const dispatcher = voiceConnection.player.dispatcher
        if (voiceConnection.paused) dispatcher.resume();
        dispatcher.end();
        voiceConnection.disconnect()
        message.reply('**Stopped!** :ok_hand::skin-tone-5: ')
    }
}