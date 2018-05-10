const consola = require('consola')
import { queue, grantSpotifyCredentials, ytdl, youTube, db, spotifyApi } from './helpers'
grantSpotifyCredentials()
import { setActivity, delay } from '../../../helpers'
// IF SOMEONE IS READING THIS PLEASE TIDY UP THE CODE K THNX
let title
export default {
    name: 'play',
    description: 'Plays audio from several sources!',
    args: true,
    usage: '<youtube url> or <youtube search query> or <spotify> <userID> <playlistID>',
    execute(message, args, client?) {
        let param = args[0]
        let res = args.join().replace(',', ' ')
        console.log('param: ' + param + ' res: ' + res)
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
                spotify()
            } else {
                youtubeSearch(res)
            }
        }

        async function executeQueue() {
            let connection
            let voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id)
            if (!Array.isArray(queue) || !queue.length) {
                if (voiceConnection !== null) {
                    voiceConnection.disconnect();
                    setActivity(message, 'Nothing', 'LISTENING')
                    return message.channel.send('```Done playing Song(s)```')
                }
            }
            if (voiceConnection === null) {
                connection = await message.member.voiceChannel.join()
            } else {
                connection = await voiceConnection
            }
            let playThis = queue[0]
            let stream = ytdl(playThis, { filter: 'audioonly' })
            let dispatcher = connection.playStream(stream);
            ytdl.getInfo(playThis, (err, info) => {
                if (err) {
                    console.log('Error trying to get info before setting activity.' + err)
                }
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
            let userID = args[1]
            let playlistID = args[2]
            let limit = args[3]
            if (!db.has('spotify.clientID').value() || !db.has('spotify.clientSecret').value()) {
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
                limit = 30
            }
            // Get tracks from playlist. Only include track name and artist. Needed to get accurate results from youtube search
            spotifyApi.getPlaylistTracks(userID, playlistID, { 'offset': 1, 'limit': limit, 'fields': 'items(track(name,artists))' })
                .then(function (data) {
                    for (let item in data.body.items) {
                        console.log(data.body.items[item].track.name);
                    }
                    for (let item in data.body.items) {
                        let name = data.body.items[item].track.name
                        let artist = data.body.items[item].track.artists[0].name
                        youtubeSearch(`${name} - ${artist} audio`)
                    }
                }, function (err) {
                    console.log('Error getting spotify playlist' + err)
                    //Natural expire time for spotify api. Retry to connect, and run again.
                    //Cant test properly due to expire time of 1hr
                    grantSpotifyCredentials().then(spotify())
                    return message.reply('Error getting spotify playlist')
                })
        }
        function youtubeSearch(toSearch) {
            youTube.search(toSearch, 1, function (error, result) {
                if (error) {
                    console.log('Error searching. -yt' + error)
                    message.reply('Error Searching. -yt')
                }
                else {
                    let id = result.items[0].id.videoId
                    ytdl.getInfo(id, (err, info) => {
                        console.log(info.title)
                        if (err) {
                            console.log('Error getting info. -ytdl' + err)
                            message.reply('Error getting info. -ytdl')
                        }
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