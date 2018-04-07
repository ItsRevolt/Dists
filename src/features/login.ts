import { init } from './init'
const fs = require('fs')
const Discord = require('discord.js');
const consola = require('consola')
const client = new Discord.Client();
client.commands = new Discord.Collection()
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

var prefix: string = db.get('prefix').value()
var token: string = db.get('token').value()
export function login() {
    // Initialize-Loads commands and some other stuff
    init(client, prefix)
    client.login(token);
    client.on('ready', () => {
        consola.success(`Bot Started Successfully`);
    });
}