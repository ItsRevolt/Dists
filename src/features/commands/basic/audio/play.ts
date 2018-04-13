const consola = require('consola')
import { queue, grantSpotifyCredentials, ytdl, youTube, db, spotifyApi } from './helpers'
grantSpotifyCredentials()
import setActivity from '../../../helpers'
// IF SOMEONE IS READING THIS PLEASE TIDY UP THE CODE BELOW K THNX
var param
var res
var title
export default {
    name: 'play',
    description: 'Plays audio from several sources!',
    args: true,
    usage: '<youtube url> or <youtube search query> or <spotify> <userID> <playlistID>',
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
                if (queue.length === 1) {
                    executeQueue();
                }
                if (queue.length >= 1) {
                    ytdl.getInfo(param).then(info => { message.reply(`**[${queue.length}]**-${info.title}`) })
                }
            } else if (param.toLowerCase() == 'spotify') {
                console.log('spotify')
                spotify()
            } else {
                youtubeSearch(res)
            }
        }

        async function executeQueue() {
            let voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
            if (!Array.isArray(queue) || !queue.length) {
                if (voiceConnection !== null) {
                    voiceConnection.disconnect();
                    setActivity(message, 'Nothing', 'LISTENING')
                    return message.channel.send('```Done playing Song(s)```')
                }
            }
            if (voiceConnection === null) {
                var connection = await message.member.voiceChannel.join()
            } else {
                var connection = await voiceConnection
            }
            var playThis = queue[0]
            var stream = ytdl(playThis, { filter: 'audioonly' })
            var dispatcher = connection.playStream(stream);
            ytdl.getInfo(playThis, (err, info) => {
                setActivity(message, info.title, 'LISTENING')
            })
            dispatcher.on('end', () => {
                setTimeout(() => {
                    if (queue.length > 0) {
                        queue.shift()
                        executeQueue()
                    } else {
                        setActivity(message, 'Nothing', 'LISTENING')
                    }
                }, 1000)
            })
        }
        function spotify() {
            var userID = args[1]
            var playlistID = args[2]
            var limit = args[3]
            if (!db.has('spotify.clientID').value() && !db.has('spotify.clientSecret').value()) {
                return message.reply('It appears that the server owner has not configured Spotify. Please bug that person.')
            }
            //These are hardcoded to check whether or not the user id and playlist id are valid. Probably not a good way to check. -Please fix
            if (userID.length !== 25) {
                return message.reply('Invalid user ID!')
            }
            if (playlistID.length !== 22) {
                return message.reply('Invalid playlist ID!')
            }
            if (limit > 100) return message.reply('Limit cannot be greater than 100')
            if (limit) {
                if (limit == 'all') {
                    limit = 100
                } else {
                    limit = limit
                }
            } else {
                limit = 25
            }
            // Get tracks from playlist. Only include track name and artist. Needed to get accurate results from youtube search
            console.log('spotify 2')
            spotifyApi.getPlaylistTracks(userID, playlistID, { 'offset': 1, 'limit': limit, 'fields': 'items(track(name,artists))' })
                .then(function (data) {
                    for (var item in data.body.items) {
                        console.log(data.body.items[item].track.name);
                    }
                    for (var item in data.body.items) {
                        var name = data.body.items[item].track.name
                        var artist = data.body.items[item].track.artists[0].name
                        youtubeSearch(`${name} - ${artist} audio`)
                    }
                }, function (err) {
                    return message.reply('Error: ' + err)
                })
        }
        function youtubeSearch(toSearch) {
            youTube.search(toSearch, 1, function (error, result) {
                if (error) {
                    message.reply(error);
                }
                else {
                    var id: string = result.items[0].id.videoId
                    ytdl.getInfo(id, (err, info) => {
                        if (err) return message.reply(err)
                        queue.push(info.video_url)
                        title = info.title
                        if (queue.length === 1) {
                            executeQueue();
                        }
                    })
                }
            });
        }
    }
}