import { login } from './features/login';
import { cli } from './features/cli';
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

//Set defaults, Will not write if already populated
db.defaults({ commandAliases: [], admingroup: '', moderatorgroup: '', permissions: [], firstrun: true, prefix: '' }).write()

var firstrun = db.get('firstrun').value()
if (firstrun == true) {
    cli()
} else {
    login()
}