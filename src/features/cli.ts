import { login } from './login';
var inquirer = require('inquirer');
const consola = require('consola')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

let questions: any[] = [
    {
        type: 'input',
        name: 'token',
        message: "What's your bots token?",
        validate: function (value: string) {
            if (value !== null || value !== typeof ('undefined')) {
                return true;
            }
            return 'Please enter a valid token';
        }
    },
    {
        type: 'input',
        name: 'prefix',
        message: "What's prefix to get bots attention?",
        default: '!',
        validate: function (value: string) {
            if (value !== null || value !== typeof ('undefined')) {
                if (value.length <= 5) {
                    return true;
                } else {
                    return 'Prefix must not be longer than 5 characters';
                }
            }
            return 'Please enter a valid prefix';
        }
    },
    {
        type: 'input',
        name: 'admingroup',
        message: "What is the admin group called on your server?",
        default: 'Admin',
        validate: function (value: string) {
            if (value !== null || value !== typeof ('undefined')) {
                return true
            }
            return 'Please enter a valid admin group';
        }
    },
    {
        type: 'input',
        name: 'moderatorgroup',
        message: "What is the moderator group called on your server?",
        default: 'Moderator',
        validate: function (value: string) {
            if (value !== null || value !== typeof ('undefined')) {
                return true
            }
            return 'Please enter a valid moderator group';
        }
    }
];
export function cli() {
    inquirer.prompt(questions).then(answers => {
        //Todo when done, group these together
        db.set('token', answers.token).write()
        db.set('firstrun', false).write()
        db.set('prefix', answers.prefix).write()
        db.set('admingroup', answers.admingroup).write()
        db.set('moderatorgroup', answers.moderatorgroup).write()
        consola.success(`Your bot has been created with token: ${answers.token}`)
        consola.info('To start your bot, type "node dists.js"')
        consola.info(`To add the bot to your guild, follow this link (REPLACE CLIENT_ID_HERE WITH THE ONE FROM YOUR BOT):https://discordapp.com/api/oauth2/authorize?client_id=CLIENT_ID_HERE&permissions=8&scope=bot`)
    });
}