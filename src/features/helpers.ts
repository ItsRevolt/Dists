var consola = require('consola')
export default function setActivity(message: any, title: string, type: string) {
    message.client.user.setActivity(title, { type: type })
        .catch(console.error)
}