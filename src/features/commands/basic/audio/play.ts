const fs = require('fs');
const ytdl = require('ytdl-core');
const consola = require('consola')
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyA1xXaVNquNgxrStmjdkSXX4vEiKTTGneY');
export var queue
queue = []
// IF SOMEONE IS READING THIS PLEASE TIDY UP THE CODE BELOW K THNX
var param
var res
var isUrl
var title
export default {
    name: 'play',
    description: 'Plays audio from several sources!',
    execute(message, args, client?) {
        param = args[0]
        res = args.join().replace(',', ' ')
        start()
        function start() {
            if (!message.guild) return;
            if (!message.member.voiceChannel) return message.reply('```You are not in a channel! :thermometer_face:```')
            if (!param) return message.reply('```Make sure to enter a search term!```')
            // Hacks way to check fo youtube url. Check for shortened youtube and full url. ¯\_(ツ)_/¯
            if (param.indexOf('youtu.be') > -1 || param.indexOf('youtube.com') > -1) {
                queue.push(param)
                isUrl = true
                if (queue.length === 1) {
                    console.log('called execute que from top')
                    executeQueue();
                }
                if (queue.length >= 1) {
                    console.log('called get info')
                    ytdl.getInfo(param).then(info => { message.reply(`**[${queue.length}]**-${info.title}`) })
                }
            } else {
                console.log('trying to search')
                youTube.search(res, 1, function (error, result) {
                    console.log('param111111111: ' + JSON.stringify(result.items[0].id.videoId))
                    if (error) {
                        message.reply(error);
                    }
                    else {
                        isUrl = false
                        var id: string = result.items[0].id.videoId
                        console.log(id)
                        ytdl.getInfo(id, (err, info) => {
                            if (err) return message.reply(err)
                            queue.push(info.video_url)
                            title = info.title
                            message.reply(`**[${queue.length}]**-${info.title}`)
                            if (queue.length === 1) {
                                executeQueue();
                            }
                        })
                    }
                });
            }
        }

        async function executeQueue() {
            console.log('execute')
            var connection
            const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
            if (!Array.isArray(queue) || !queue.length) {
                if (voiceConnection !== null) {
                    voiceConnection.disconnect();
                    return message.reply('```Done playing Song(s)```')
                }
            }
            if (voiceConnection === null) {
                connection = await message.member.voiceChannel.join()
            } else {
                connection = voiceConnection
            }
            var playThis = queue[0]
            var stream = ytdl(playThis, { filter: 'audioonly' })
            if (isUrl == true) {
                ytdl.getInfo(playThis, (err, info) => {
                    message.client.user.setActivity(info.title, { type: 'PLAYING' })
                        .then(presence => consola.info(`**Playing:** ${res}-${info.title}`))
                        .catch(console.error);
                })
            } else {
                message.client.user.setActivity(title, { type: 'PLAYING' })
                    .then(presence => consola.info(`**Playing:** ${res}-${title}`))
                    .catch(console.error);
            }
            var dispatcher = connection.playStream(stream);
            dispatcher.on('end', () => {
                setTimeout(() => {
                    if (queue.length > 0) {
                        queue.shift()
                        executeQueue()
                    }
                }, 1000)
            })
        }
    }
}