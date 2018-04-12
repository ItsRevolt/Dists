const fs = require('fs')
const ytdl = require('ytdl-core')
const consola = require('consola')
var YouTube = require('youtube-node')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
var SpotifyWebApi = require('spotify-web-api-node');
var clientID = db.get('spotify.clientID').value()
var clientSecret = db.get('spotify.clientSecret').value()
var spotifyApi = new SpotifyWebApi({
    clientId: clientID,
    clientSecret: clientSecret
});
console.log(clientID)
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });

import setActivity from '../../../helpers'
var youTube = new YouTube();
youTube.setKey('AIzaSyA1xXaVNquNgxrStmjdkSXX4vEiKTTGneY');
export var queue = []
export function resetQueue() {
    return queue = []
}
// IF SOMEONE IS READING THIS PLEASE TIDY UP THE CODE BELOW K THNX
var param
var res
var title
export default {
    name: 'play',
    description: 'Plays audio from several sources!',
    args: true,
    usage: '<url> or <search query>',
    execute(message, args, client?) {
        param = args[0]
        res = args.join().replace(',', ' ')
        start()
        function start() {
            console.log('arg0: ' + args[0] + 'arg1: ' + args[1])
            if (!message.guild) return;
            if (!message.member.voiceChannel) return message.reply('```You are not in a channel! :thermometer_face:```')
            if (!param) return message.reply('```Make sure to enter a search term!```')
            // Hacks way to check fo youtube url. Check for shortened youtube and full url. ¯\_(ツ)_/¯
            if (param.indexOf('youtu.be') > -1 || param.indexOf('youtube.com') > -1) {
                queue.push(param)
                if (queue.length === 1) {
                    console.log('called execute que from top')
                    executeQueue();
                }
                if (queue.length >= 1) {
                    console.log('called get info')
                    ytdl.getInfo(param).then(info => { message.reply(`**[${queue.length}]**-${info.title}`) })
                }
            } else if (args[0].toLowerCase() == 'spotify') {
                if (!db.has('spotify.clientID').value() && !db.has('spotify.clientSecret').value()) {
                    return message.reply('It appears that the server owner has not configured Spotify. Please bug that person.')
                }
                //These are hardcoded to check whether or not the user id and playlist id are valid. Probably not a good way to check. -Please fix
                if (args[1].length !== 25) {
                    return message.reply('Invalid user ID!')
                }
                if (args[2].length !== 22) {
                    return message.reply('Invalid playlist ID!')
                }
                var limit
                if (args[3]) {
                    if (args[3] == 'all') {
                        limit = 100
                    } else {
                        limit = args[3]
                    }
                } else {
                    limit = 25
                }
                spotifyApi.getPlaylistTracks(args[1], args[2], { 'offset': 1, 'limit': limit, 'fields': 'items(track(name,artists))' })
                    .then(function (data) {
                        console.log(JSON.stringify(data))
                        for (var item in data.body.items) {
                            console.log(data.body.items[item].track.name);
                        }
                        for (var item in data.body.items) {
                            var name = data.body.items[item].track.name
                            var artist = data.body.items[item].track.artists[0].name
                            youtube(`${name} - ${artist} audio`)
                        }
                    }, function (err) {
                        return message.reply('Error: ' + err)
                    });
            } else {
                console.log('trying to search')
                youtube(res)
            }
        }

        function youtube(toSearch) {
            youTube.search(toSearch, 1, function (error, result) {
                if (error) {
                    message.reply(error);
                }
                else {
                    var id: string = result.items[0].id.videoId
                    console.log(id)
                    ytdl.getInfo(id, (err, info) => {
                        if (err) return message.reply(err)
                        queue.push(info.video_url)
                        title = info.title
                        message.channel.send(`**[${queue.length}]**-${info.title}`)
                        if (queue.length === 1) {
                            executeQueue();
                        }
                    })
                }
            });
        }

        async function executeQueue() {
            console.log('execute')
            var connection
            const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
            if (!Array.isArray(queue) || !queue.length) {
                if (voiceConnection !== null) {
                    voiceConnection.disconnect();
                    setActivity(message, 'Nothing')
                    return message.channel.send('```Done playing Song(s)```')
                }
            }
            if (voiceConnection === null) {
                connection = await message.member.voiceChannel.join()
            } else {
                connection = voiceConnection
            }
            var playThis = queue[0]
            var stream = ytdl(playThis, { filter: 'audioonly' })
            var dispatcher = connection.playStream(stream);
            ytdl.getInfo(playThis, (err, info) => {
                setActivity(message, info.title)
            })
            dispatcher.on('end', () => {
                setTimeout(() => {
                    if (queue.length > 0) {
                        queue.shift()
                        executeQueue()
                    } else {
                        setActivity(message, 'Nothing')
                    }
                }, 1000)
            })
        }
    }
}