"use strict";var ping={name:"ping",description:"Ping!",execute(e,t){console.log("received"),e.channel.send("Pong.")}},echo={name:"echo",description:"Get message content and sends it back",execute(e,t){e.channel.send(e.content)}},YouTube=require("youtube-node"),low=require("lowdb"),FileSync=require("lowdb/adapters/FileSync"),adapter=new FileSync("db.json"),SpotifyWebApi=require("spotify-web-api-node"),db=low(adapter),ytdl=require("ytdl-core"),youTube=new YouTube;youTube.setKey("AIzaSyA1xXaVNquNgxrStmjdkSXX4vEiKTTGneY");var clientID=db.get("spotify.clientID").value(),clientSecret=db.get("spotify.clientSecret").value(),spotifyApi=new SpotifyWebApi({clientId:clientID,clientSecret:clientSecret}),queue=[];function resetQueue(){return queue=[]}function grantSpotifyCredentials(){spotifyApi.clientCredentialsGrant().then(function(e){console.log("The access token expires in "+e.body.expires_in),console.log("The access token is "+e.body.access_token),spotifyApi.setAccessToken(e.body.access_token)},function(e){console.log("Something went wrong when retrieving an access token",e)})}var consola=require("consola");function setActivity(e,t,n){e.client.user.setActivity(t,{type:n}).catch(console.error)}const consola$1=require("consola");var param,res,title;grantSpotifyCredentials();var play={name:"play",description:"Plays audio from several sources!",args:!0,usage:"<youtube url> or <youtube search query> or <spotify> <userID> <playlistID>",execute(e,t,n){async function o(){let t=n.voiceConnections.find(t=>t.channel.guild.id==e.guild.id);if(!(Array.isArray(queue)&&queue.length||null===t))return t.disconnect(),setActivity(e,"Nothing","LISTENING"),e.channel.send("```Done playing Song(s)```");if(null===t)var i=await e.member.voiceChannel.join();else i=await t;var r=queue[0],a=ytdl(r,{filter:"audioonly"}),s=i.playStream(a);ytdl.getInfo(r,(t,n)=>{setActivity(e,n.title,"LISTENING")}),s.on("end",()=>{setTimeout(()=>{queue.length>0?(queue.shift(),o()):setActivity(e,"Nothing","LISTENING")},1e3)})}function i(t){youTube.search(t,1,function(t,n){if(t)e.reply(t);else{var i=n.items[0].id.videoId;ytdl.getInfo(i,(t,n)=>{if(t)return e.reply(t);queue.push(n.video_url),title=n.title,1===queue.length&&o()})}})}param=t[0],res=t.join().replace(","," "),function(){if(!e.guild)return;if(!e.member.voiceChannel)return e.reply("```You are not in a channel! :thermometer_face:```");if(!param)return e.reply("```Make sure to enter a search term!```");param.indexOf("youtu.be")>-1||param.indexOf("youtube.com")>-1?(queue.push(param),1===queue.length&&o(),queue.length>=1&&ytdl.getInfo(param).then(t=>{e.reply(`**[${queue.length}]**-${t.title}`)})):"spotify"==param.toLowerCase()?(console.log("spotify"),function(){var n=t[1],o=t[2],r=t[3];if(!db.has("spotify.clientID").value()&&!db.has("spotify.clientSecret").value())return e.reply("It appears that the server owner has not configured Spotify. Please bug that person.");if(25!==n.length)return e.reply("Invalid user ID!");if(22!==o.length)return e.reply("Invalid playlist ID!");if(r>100)return e.reply("Limit cannot be greater than 100");r=r?"all"==r?100:r:25;console.log("spotify 2"),spotifyApi.getPlaylistTracks(n,o,{offset:1,limit:r,fields:"items(track(name,artists))"}).then(function(e){for(var t in e.body.items)console.log(e.body.items[t].track.name);for(var t in e.body.items){var n=e.body.items[t].track.name,o=e.body.items[t].track.artists[0].name;i(`${n} - ${o} audio`)}},function(t){return e.reply("Error: "+t)})}()):i(res)}()}};const fs=require("fs"),ytdl$1=require("ytdl-core");var queue$1={name:"queue",description:"Shows audio queue",execute(e,t,n){if(0==queue.length)return e.channel.send("Nothing in queue bud");queue.reverse().map(t=>ytdl$1.getInfo(t).then(n=>setTimeout(()=>{e.channel.send(`\n**[${queue.indexOf(t)}]** - ${n.title}\n`)},300)))}};const fs$1=require("fs"),ytdl$2=require("ytdl-core");var skip={name:"skip",description:"Skips to next song in queue",execute(e,t,n){if(0===queue.length)return e.reply("You cannot skip a non-existent song! :raised_hands::skin-tone-5:");var o=Math.min(1,queue.length);queue.splice(0,o-1);var i=n.voiceConnections.find(t=>t.channel.guild.id==e.guild.id);const r=i.player.dispatcher;i.paused&&r.resume(),r.end(),e.reply("**Skipped!** :ok_hand::skin-tone-5:")}};const fs$2=require("fs"),ytdl$3=require("ytdl-core");var stop={name:"stop",description:"Stops all audio playing, removes all in queue, and doesnt continue queue",execute(e,t,n){resetQueue();var o=n.voiceConnections.find(t=>t.channel.guild.id==e.guild.id);if(!o)return;const i=o.player.dispatcher;o.paused&&i.resume(),i.end(),o.disconnect(),e.reply("**Stopped!** :ok_hand::skin-tone-5: ")}},fuck={name:"fuck",description:"Sends a fuck you to the person of choice",args:!0,usage:"<thing>",execute(e,t){var n=t[0],o=Math.random();o<.5?e.channel.send(`Yeah, fuck **${n}**`):o<.7?e.reply("No, fuck you"):e.channel.send(`Yeah, fuck **${n}**`)}};const path=require("path"),consola$2=require("consola");let Files=[ping,echo,play,skip,queue$1,stop,fuck];function init(e,t){for(const t of Files)consola$2.success("Loaded: "+t.name),e.commands.set(t.name,t);e.on("message",n=>{if(consola$2.info(`${n.author.username} Posted: '${n.content}' - ${n.createdTimestamp}`),"prefix"===n.content&&n.channel.send(`Prefix is: '**${t}**'`),!n.content.startsWith(t)||n.author.bot)return;const o=n.content.slice(t.length).split(/ +/),i=o.shift().toLowerCase();if(i.args&&!o.length){let e=`You didn't provide any arguments, ${n.author}!`;return i.usage&&(e+=`\nThe proper usage would be: \`${t}${i.name} ${i.usage}\``),n.channel.send(e)}if(e.commands.has(i))try{e.commands.get(i).execute(n,o,e)}catch(e){consola$2.error(e),n.reply("there was an error trying to execute that command!")}}),process.on("unhandledRejection",e=>console.error(`Uncaught Promise Rejection:\n${e}`))}const fs$3=require("fs"),Discord=require("discord.js"),consola$3=require("consola"),client=new Discord.Client;client.commands=new Discord.Collection;const low$1=require("lowdb"),FileSync$1=require("lowdb/adapters/FileSync"),adapter$1=new FileSync$1("db.json"),db$1=low$1(adapter$1);var prefix=db$1.get("prefix").value(),token=db$1.get("token").value();function login(){init(client,prefix),client.login(token),client.on("ready",()=>{consola$3.success("Bot Started Successfully")})}var inquirer=require("inquirer");const consola$4=require("consola"),low$2=require("lowdb"),FileSync$2=require("lowdb/adapters/FileSync"),adapter$2=new FileSync$2("db.json"),db$2=low$2(adapter$2);let questions=[{type:"input",name:"token",message:"What's your bots token?",validate:function(e){return null!==e||"string"!==e||"Please enter a valid token"}},{type:"input",name:"prefix",message:"What's prefix to get bots attention?",default:"!",validate:function(e){return null!==e||"string"!==e?e.length<=5||"Prefix must not be longer than 5 characters":"Please enter a valid prefix"}},{type:"input",name:"admingroup",message:"What is the admin group called on your server?",default:"Admin",validate:function(e){return null!==e||"string"!==e||"Please enter a valid admin group"}},{type:"input",name:"moderatorgroup",message:"What is the moderator group called on your server?",default:"Moderator",validate:function(e){return null!==e||"string"!==e||"Please enter a valid moderator group"}},{type:"input",name:"clientID",message:"What is your spotify client id? (Blank for none)",default:""},{type:"input",name:"clientSecret",message:"What is your spotify client secret? (Blank for none)",default:""}];function cli(){inquirer.prompt(questions).then(e=>{db$2.set("token",e.token).write(),db$2.set("firstrun",!1).write(),db$2.set("prefix",e.prefix).write(),db$2.set("admingroup",e.admingroup).write(),db$2.set("moderatorgroup",e.moderatorgroup).write(),db$2.set("spotify.clientID",e.clientID).write(),db$2.set("spotify.clientSecret",e.clientSecret).write(),consola$4.success(`Your bot has been created with token: ${e.token}`),consola$4.info('To start your bot, type "node dists.js"'),consola$4.info("To add the bot to your guild, follow this link (REPLACE CLIENT_ID_HERE WITH THE ONE FROM YOUR BOT):https://discordapp.com/api/oauth2/authorize?client_id=CLIENT_ID_HERE&permissions=8&scope=bot")})}const low$3=require("lowdb"),FileSync$3=require("lowdb/adapters/FileSync"),adapter$3=new FileSync$3("db.json"),db$3=low$3(adapter$3);db$3.defaults({commandAliases:[],admingroup:"",moderatorgroup:"",permissions:[],firstrun:!0,prefix:"",spotify:{clientID:"",clientSecret:""}}).write();var firstrun=db$3.get("firstrun").value();1==firstrun?cli():login();
