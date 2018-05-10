const Discord = require('discord.js');
let low = require('lowdb')
let FileSync = require('lowdb/adapters/FileSync')
let adapter = new FileSync('./db.json')
export let chalk = require('chalk');
export let log = console.log
export let success = chalk.bold.green
export let error = chalk.bold.bgRed
export let important = chalk.bold.bgYellow
export let db = low(adapter)

export let owner = db.get('ownerID').value()

export let token = db.get('token').value()

export let prefix = db.get('prefix').value()

export let client = new Discord.Client();
client.commands = new Discord.Collection()

export let login = () => {
    client.login(token)
    client.on('ready', () => {
        console.log(`
        ${success('Bot Started Successfully')}. Logged in as ${success(client.user.tag)}!
        `);
    });
}

export var delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export function setActivity(message: any, title: string, type: string) {
    message.client.user.setActivity(title, { type: type })
        .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
        .catch(console.error);
}