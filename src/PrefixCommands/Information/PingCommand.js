import PrefixCommands from '../../Structure/PrefixCommands.js';

export default class extends PrefixCommands {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: ['ms', 'latência', 'latencia', 'latency', 'clientping']
        });
    }
    run = (message, args) => {
        message.reply({ content: `🏓 **| Pong!** Meu ping é medido em tempo real e aponta os ms de uma certa conexão:
⏱️ **| Latência do chat:** \`${Date.now() - message.createdTimestamp}ms\`
⚡ **| Latência da API:** \`${this.client.ws.ping}ms\`` });
    }
}
