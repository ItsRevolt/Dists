var YouTube = require('youtube-node')
import { db } from '../../../helpers'
var SpotifyWebApi = require('spotify-web-api-node')
export var ytdl = require('ytdl-core')
export var youTube = new YouTube()
youTube.setKey(db.get('youtube.key').value())
export var spotifyApi = new SpotifyWebApi({
    clientId: db.get('spotify.clientID').value(),
    clientSecret: db.get('spotify.clientSecret').value()
});
export var queue = []
export let resetQueue = () => {
    queue = []
}
export async function grantSpotifyCredentials() {
    try {
        let data = await spotifyApi.clientCredentialsGrant()
        console.log('The access token expires in ' + data.body['expires_in'])
        console.log('The access token is ' + data.body['access_token'])
        spotifyApi.setAccessToken(data.body['access_token'])
    } catch (e) {
        console.log('Something went wrong when retrieving an access token', e)
    }
}