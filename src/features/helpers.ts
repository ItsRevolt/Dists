export var delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export default function setActivity(message: any, title: string, type: string) {
    message.client.user.setPresence({ game: { name: title, type: type } })
        .catch(console.error)
}