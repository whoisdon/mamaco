import { ActionRowBuilder, ButtonStyle, ButtonBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, AttachmentBuilder } from 'discord.js';
import EventMap from '../../Structure/EventMap.js';
import * as RankUtils from '../../Utils/Functions/Rinha/RankUtils.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'interactionCreate'
    });
  }

  run = async (interaction) => {
    const buttons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId('realizar-aposta')
        .setLabel('Realizar aposta')
        .setEmoji('<:ticket_:1175477002921324575>')
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId('como-aposta')
        .setLabel('Como apostar')
        .setEmoji(this.emoji.rs)
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('ver-participantes-back')
        .setLabel('Participantes Backend')
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId('ver-participantes-front')
        .setLabel('Participantes Frontend')
        .setStyle(ButtonStyle.Secondary)
    )

    const aposta = new ActionRowBuilder()
    .addComponents(
        new TextInputBuilder()
        .setCustomId('participante/placeholder')
        .setLabel('Participante:')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(4000)
        .setPlaceholder('Qual será o nome, insta ou id do participante a ser apostado?')
        .setRequired(true)
    )

    const modal = new ModalBuilder()
    .setCustomId('modals/urna')
    .setTitle('🐵 Urna Eletrônica')
    .addComponents([aposta]);

    const button_urna = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('confirmar_aposta')
      .setLabel('Confirmar')
      .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
      .setCustomId('realizar-aposta')
      .setLabel('Alterar Participante')
      .setStyle(ButtonStyle.Danger)
    )

    const data = (await this.firebase.ref('Participantes').once("value")).val();

    if (interaction.customId === 'apostar') {
        interaction.reply({ content: `> Ao participar dessa premiação, você concorrerá a um prêmio de \`500k\` mamacos coin. O voto no participante pode ser feito apenas **UMA VEZ**.

Todos podem participar dessa premiação, inclusive os candidatos.`,  components: [buttons], ephemeral: true })
        return;
    }

    else if (interaction.customId ==='ver-participantes-back') {
      await interaction.deferReply({ ephemeral: true })
      const usersDB = data.back.slice(0, 5);
      const canvas = await RankUtils.generateRankCanvas(interaction.guild, usersDB, 'Backend');

      const update = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setEmoji('⬅️').setStyle(ButtonStyle.Primary).setCustomId('left'),
          new ButtonBuilder()
            .setLabel(`1/${Math.ceil(data.back.length / 5)}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
            .setCustomId('paginator_back'),
          new ButtonBuilder().setEmoji('➡️').setStyle(ButtonStyle.Primary).setCustomId('right')
      );
      await interaction.editReply({
        files: [canvas.toBuffer()],
        components: [update]
      });
      return;
    }

    else if (interaction.customId === 'ver-participantes-front') {
      await interaction.deferReply({ ephemeral: true })
      const usersDB = data.front.slice(0, 5);
      const canvas = await RankUtils.generateRankCanvas(interaction.guild, usersDB, 'Frontend');

      const update = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setEmoji('⬅️').setStyle(ButtonStyle.Primary).setCustomId('left'),
          new ButtonBuilder()
            .setLabel(`1/${Math.ceil(data.front.length / 5)}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
            .setCustomId('paginator_front'),
          new ButtonBuilder().setEmoji('➡️').setStyle(ButtonStyle.Primary).setCustomId('right')
      );
      await interaction.editReply({
        files: [canvas.toBuffer()],
        components: [update]
      });
      return;
    }
    else if (interaction.customId === 'realizar-aposta') {
      interaction.showModal(modal)
      return;
    }
    else if (interaction.customId === 'modals/urna') {
      const participante = interaction.fields.getTextInputValue('participante/placeholder').toLowerCase();
      const atual = (await this.firebase.ref('Participantes').once("value")).val();

      const search = [...atual.back, ...atual.front].find(c => c.name.toLowerCase() === participante.toLowerCase() || c.insta === participante.toLowerCase() || c.id === participante);
      if (!search) {
        interaction.reply({ content: `❌ **|** Participante \`${participante}\` não encontrado.`, ephemeral: true })
        return; 
      }

      interaction.reply({ content: `Ao confirmar no botão abaixo você está ciente que **NÃO** poderá trocar sua escolha no participante \`${search.name}\` (<@${search.id}>)`, components: [button_urna], ephemeral: true })
      return;
    }
    else if (interaction.customId === 'confirmar_aposta') {
      const atual = (await this.firebase.ref(`Rinha/Aposta/${interaction.user.id}`).once("value")).val();

      if (atual) {
        interaction.reply({ content: `${this.emoji.rs} **|** Você já realizou sua aposta no usuário \`${atual.name}\` (<@${atual.id}>)`, ephemeral: true })
        return;
      } 

      const info = interaction.message;

      this.firebase.ref(`Rinha/Aposta/${interaction.user.id}`).update({
        id: info.mentions.users.first().id,
        name: info.content.match(/`([^`]+)`/)[1]
      })
      interaction.reply({ content: `${this.emoji.rs} **|** Aposta realizada com sucesso!`, ephemeral: true })
      return;
    }
    else if (interaction.customId === 'como-aposta') {
      const attachment = new AttachmentBuilder(`${process.cwd()}/src/Utils/Attachments/introduction.webm`, { name: 'introduction.webm' });
      interaction.reply({ content: 'Sigam as instruções situadas abaixo:', files: [attachment], ephemeral: true })
      return;
    }
  }
}
