export default {
    name: 'fuck',
    description: 'Sends a fuck you to the person of choice',
    args: true,
    usage: '<thing>',
    execute(message, args) {
        var thing = args[0]
        var d = Math.random();
        if (d > 0.35) {
            message.channel.send(`Yeah, fuck **${thing}**`);
        } else {
            message.reply(`No, fuck you`);
        }
    },
};