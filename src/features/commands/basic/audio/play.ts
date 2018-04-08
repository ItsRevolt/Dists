const fs = require('fs');
const ytdl = require('ytdl-core');
export var queue
queue = []
var url
export default {
    name: 'play',
    description: 'Plays audio from several sources!',
    execute(message, args, client?) {
        url = args[0]
        start()
        function start() {
            if (!message.guild) return;
            if (url.indexOf('youtu.be') || url.indexOf('youtube.com')) {
                queue.push(url)
                if (queue.length === 1) {
                    executeQueue();
                }
                if (queue.length >= 1) {
                    ytdl.getInfo(url).then(info => { message.reply(`[${queue.length}] Queued: ${info.title}`) })
                }
            } else if (!url) {
                message.reply('Make sure you entered a valid youtube url!')
            }
        }

        function executeQueue() {
            new Promise<any>((resolve, reject) => {
                const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
                if (!Array.isArray(queue) || !queue.length) {
                    if (voiceConnection !== null) {
                        voiceConnection.disconnect();
                        return message.reply('Done playing Song(s)')
                    }
                }
                if (voiceConnection === null) {
                    message.member.voiceChannel.join().then(connection => {
                        resolve(connection)
                    })
                } else {
                    console.log('already has a connection: ' + message.member.voiceChannel.connection)
                    resolve(client.voiceConnections.find(val => val.channel.guild.id == message.guild.id))
                }
            }).then(connection => {
                var playThis = queue[0]
                console.log(playThis)
                var stream = ytdl(playThis, { filter: 'audioonly' })
                var dispatcher = connection.playStream(stream);
                var title
                ytdl.getInfo(playThis).then(info => { title = info.title })
                message.client.user.setActivity(title, { type: 'PLAYING' })
                    .then(presence => console.log(`Playing: ${playThis}-${title}`))
                    .catch(console.error);
                dispatcher.on('end', () => {
                    setTimeout(() => {
                        if (queue.length > 0) {
                            queue.shift()
                            console.log('Fired add new song')
                            executeQueue()
                        }
                    }, 1000)
                })
            })
        }
        // Hacks way to check fo youtube url. Check for shortened youtube and full url. ¯\_(ツ)_/¯
    }
}