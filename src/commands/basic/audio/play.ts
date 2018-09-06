import { queue, grantSpotifyCredentials, ytdl, spotifyApi } from './helpers'
var ytpl = require('ytpl');
var ytsr = require('ytsr');
import { setActivity, delay, db } from '../../../helpers'
grantSpotifyCredentials()
// IF SOMEONE IS READING THIS PLEASE TIDY UP THE CODE K THNX. Instead of calling .getInfo() all the time, do it once and store it.
export default {
    name: 'play',
    description: 'Plays audio from several sources!',
    args: true,
    aliases: ['song'],
    usage: '<yt url> or <yt search query> or <spotify> <userID> <playlistID> <limit>(optional)',
    execute(message, args, client?) {
        let param = args[0]
        let res = args.join().replace(',', ' ')
        start()
        function start() {
            if (!message.guild) return
            if (!message.member.voiceChannel) return message.reply('```You are not in a channel! :thermometer_face:```')
            // Hacks way to check for youtube url. Check for shortened youtube and full url. ¯\_(ツ)_/¯
            if (param.indexOf('youtu.be') > -1 || param.indexOf('youtube.com') > -1) {
                if (param.indexOf('&list=') > -1) {
                    youtubePlaylist(param)
                } else {
                    queue.push(param)
                }
                if (queue.length === 1) {
                    executeQueue();
                }
            } else if (param.toLowerCase() == 'spotify') {
                spotify()
            } else {
                youtubeSearch(res)
            }
        }

        async function executeQueue() {
            var connection = await message.member.voiceChannel.join()
            if (!Array.isArray(queue) || !queue.length) {
                if (connection !== null) {
                    connection.disconnect()
                    setActivity(message, 'Nothing', 'LISTENING')
                    return message.channel.send('```Done playing Song(s)```')
                }
            }
            console.log(queue, queue[0])
            let playThis = queue[0]
            let dispatcher = await connection.playStream(ytdl(playThis, { quality: 'highestaudio' }))
            ytdl.getInfo(playThis, (err, info) => {
                if (err) {
                    console.log('Error trying to get info before setting activity.' + err)
                }
                setActivity(message, info.title, 'LISTENING')
            })
            dispatcher.on('end', () => {
                if (queue.length > 0) {
                    queue.shift()
                    executeQueue()
                } else {
                    setActivity(message, 'Nothing', 'LISTENING')
                }
            })
            dispatcher.on('error', (error) => {
                console.log(error)
            })
        }
        async function spotify() {
            let userID = args[1]
            let playlistID = args[2]
            let limit = args[3]
            if (!db.has('spotify.clientID').value() || !db.has('spotify.clientSecret').value()) {
                return message.reply('It appears that the server owner has not configured Spotify. Please bug that person.')
            }
            if (userID.length < 1) {
                return message.reply('Invalid user ID!')
            }
            if (playlistID.length < 1) {
                return message.reply('Invalid playlist ID!')
            }
            switch (true) {
                case (limit > 100):
                    return message.reply('Limit cannot be greater than 100')
                case (limit == 'all'):
                    limit = 100
                    break
                case (limit):
                    limit = limit
                    break
                default:
                    limit = 30
            }
            // Get tracks from playlist. Only include track name and artist. Needed to get accurate results from youtube search
            try {
                let data = await spotifyApi.getPlaylistTracks(userID, playlistID, { 'offset': 1, 'limit': limit, 'fields': 'items(track(name,artists))' })
                for (let item in data.body.items) {
                    let name = data.body.items[item].track.name
                    let artist = data.body.items[item].track.artists[0].name
                    youtubeSearch(`${name} - ${artist} audio`)
                }
            } catch (e) {
                console.log('Error getting spotify playlist' + e)
                //Natural expire time for spotify api. Retry to connect, and run again.
                //Cant test properly due to expire time of 1hr
                await grantSpotifyCredentials()
                await message.reply('Error getting spotify playlist. Trying again.')
                await spotify()
            }
        }
        function youtubeSearch(toSearch) {
            //Todo: Add this to website with why and how to fix for big servers eventually
            //if (!db.has('youtube.key').value()) return message.reply('Error performing action. Make sure you have a youtube api key set.')
            let filter;
            let options = {
                limit: 1,
            }
            ytsr(toSearch, options, function (err, results) {
                if (err) throw err;
                queue.push(results.items[0].link)
                if (queue.length == 1) {
                    executeQueue();
                }
            })
        }

        function youtubePlaylist(link) {
            let limit = args[2] ? args[2] : 100
            let options = {
                limit: limit
            }
            var self = this
            ytpl(link, options, (err, playlist) => {
                message.reply(`Now playing [${limit}] songs in ${playlist.title}`)
                playlist.items.forEach(item => {
                    queue.push(item.url_simple)
                    console.log(item.url_simple)
                    if (queue.length == 1) {
                        executeQueue();
                    }
                });
            })
        }
    }
}