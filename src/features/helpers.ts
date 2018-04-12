var consola = require('consola')
export default function setActivity(message: any, title: string) {
    message.client.user.setActivity(title, { type: 'LISTENING' })
        .catch(console.error);
}