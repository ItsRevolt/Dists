export default {
    name: 'echo',
    description: 'Get message content and sends it back',
    permission: 'default',
    execute(message, args) {
        message.channel.send(message.content);
    },
};