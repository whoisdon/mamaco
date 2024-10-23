import PrefixCommands from '../../Structure/PrefixCommands.js';

export default class extends PrefixCommands {
    constructor(client) {
        super(client, {
            name: 'permitame',
            aliases: ['permita_me', 'permita-me', 'mepermita'],
            messageDelete: true
        });
    }
    run = (message, args) => {
        const query = args.join(' ');
        if (!query) return;

        const mentionURL = message.mentions.repliedUser ? `${message.mentions.repliedUser} ` : '';
        message.channel.send({ content: `${mentionURL}https://permita.me/?q=${encodeURIComponent(query)}` });
    }
}
