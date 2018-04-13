var YouTube = require('youtube-node')
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('db.json')
var SpotifyWebApi = require('spotify-web-api-node');
export var db = low(adapter)
export var ytdl = require('ytdl-core')
export var youTube = new YouTube();
youTube.setKey('AIzaSyA1xXaVNquNgxrStmjdkSXX4vEiKTTGneY');
var clientID = db.get('spotify.clientID').value()
var clientSecret = db.get('spotify.clientSecret').value()
export var spotifyApi = new SpotifyWebApi({
    clientId: clientID,
    clientSecret: clientSecret
});
export var queue = []
export function resetQueue() {
    return queue = []
}
export function grantSpotifyCredentials() {
    spotifyApi.clientCredentialsGrant()
        .then(function (data) {
            console.log('The access token expires in ' + data.body['expires_in'])
            console.log('The access token is ' + data.body['access_token'])

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token'])
        }, function (err) {
            console.log('Something went wrong when retrieving an access token', err)
        })
}