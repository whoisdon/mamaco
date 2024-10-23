import EventMap from '../../Structure/EventMap.js';
import Config from '../../Config/Config.json' assert { type: 'json' }

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'guildMemberAdd'
    });
  }
  run = async (member) => {
    if (member.user.bot) return;

    const verify = await this.quickdb.get(`Users/${member.user.id}/Donkeys`)

    if (!verify) {
      await this.quickdb.set(`Users/${member.user.id}/Donkeys`, 1500)
    }

    const arr = [
      `Bem vinde ${member.user}, seus fios já começaram a cair 🐒 🥰`,
      `${member.user} acaba de se livrar de fazer a Tribo 🐒 💸`,
      `${member.user} acabou de sair do foguetinho 🐒 ${this.emoji.kabum}`,
      `${member.user} bem vinde dev senior de 2 anos 🐒 😎`,
      `${member.user} dev +40k entrou no chat 🐒 🤑`,
      `${member.user} nerdola que programa em rust quer fazer amigos aqui 🐒 🤓 👆`,
      `🤫 shiiii o ${member.user}, dev java véio acabou de dormir no chat`,
      `O ${member.user} disse que frontend é mais difícil que backend, num deixava 🐒`,
      `O guru dos cursos acaba de aterrisar ${member.user} ${this.emoji.kabum}`,
      `CALADOS! O ${member.user} caiu no conto da Tribo, press F no chat`
    ]

    const channel = this.client.channels.cache.get(Config.default_welcome)
    
    channel.send({ content: arr[~~(Math.random() * arr.length )] }) 
    //.then(m => setTimeout(() => m?.delete(), 15000))
  }
}
