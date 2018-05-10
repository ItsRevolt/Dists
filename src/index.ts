import { create } from './start/create';
import { cli } from './start/cli';
import { db } from './helpers'

//Set defaults, Will not write if already populated
db.defaults({ commandAliases: [], admingroup: '', moderatorgroup: '', permissions: [], firstrun: true, prefix: '', spotify: { clientID: '', clientSecret: '' } }).write()

let firstrun: boolean = db.get('firstrun').value()
if (firstrun == true) {
    cli()
} else {
    create()
}