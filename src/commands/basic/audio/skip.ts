const fs = require('fs')
const ytdl = require('ytdl-core')
import { queue } from './helpers'
export default {
    name: 'skip',
    description: 'Skips to next song in queue',
    usage: '<how many to skip> (optional)',
    execute(message, args, client?) {
        if (queue.length === 0) {
            return message.reply('You cannot skip a non-existent song! :raised_hands::skin-tone-5:')
        }
        var howMany = args[0] ? args[0] : 1
        var toSkip = Math.min(howMany, queue.length)
        queue.splice(0, toSkip - howMany)
        // Resume and stop playing.
        var voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id)
        const dispatcher = voiceConnection.player.dispatcher
        if (dispatcher.paused) dispatcher.resume()
        dispatcher.end()
        message.reply('**Skipped!** :ok_hand::skin-tone-5:')
    }
}