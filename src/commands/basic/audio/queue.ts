const fs = require('fs')
const ytdl = require('ytdl-core')
import { queue } from './helpers'
import { stringify } from 'querystring'
export default {
    name: 'queue',
    description: 'Shows audio queue',
    execute(message, args, client?) {
        if (queue.length == 0) {
            return message.channel.send('Nothing in queue bud')
        } else {
            var data = queue.reverse().map(item => ytdl.getInfo(item).then(info => setTimeout(() => { { message.channel.send(`\n**[${queue.indexOf(item)}]** - ${info.title}\n`) } }, 300)))
        }
    }
}