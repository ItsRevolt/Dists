export default {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        console.log('received')
        message.channel.send('Pong.');
    },
};