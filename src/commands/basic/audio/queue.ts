const fs = require('fs')
const ytdl = require('ytdl-core')
import { queue } from './helpers'
import { stringify } from 'querystring'
export default {
    name: 'queue',
    description: 'Shows audio queue',
    async execute(message, args, client?) {
        if (queue.length == 0) {
            return message.channel.send('Nothing in queue bud')
        } else {
            //  Nice meme
            var deletthis
            if (queue.length < 30) {
                deletthis = await message.reply('Getting queue. This may take a while :cow:')
            } else {
                deletthis = await message.reply('Queue is big. Sending in DM. :cow:')
            }
            getData()
            async function getData() {
                let tempQueue = []
                for (var i = 0, len = queue.length; i < len; i++) {
                    let response = await ytdl.getInfo(queue[i])
                    tempQueue.push('\n**[' + i + ']**' + ' - ' + response.title)
                    if (tempQueue.length == 10) {
                        var toSend = tempQueue.join().replace(',', ' ')
                        if (queue.length < 30) {
                            message.channel.send(toSend)
                        } else {
                            message.author.sendMessage(toSend)
                        }
                        tempQueue = []
                    }
                }
                await deletthis.delete()
            }
        }
    }
}