import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import EventMap from '../../Structure/EventMap.js';
import * as RankUtils from '../../Utils/Functions/Rinha/RankUtils.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'interactionCreate',
    });
  }

  run = async (interaction) => {
    if (!interaction.isButton()) return;

    const allowedCustomIds = ['left', 'right'];
    if (!allowedCustomIds.includes(interaction.customId)) return;

    const data = (await this.firebase.ref('Participantes').once("value")).val();
    const data_ids = interaction.message.components[0].components[1].data.custom_id

    if (data_ids.endsWith('_back')) {
        const totalPages = Math.ceil(data.back.length / 5);

        const currentPage = parseInt(interaction.message.components[0].components[1].label.split('/')[0]);
        const newPage = interaction.customId === 'left' ? Math.max(1, currentPage - 1) : Math.min(totalPages, currentPage + 1);

        const startIndex = (newPage - 1) * 5;
        const endIndex = Math.min(newPage * 5, data.back.length);
        const usersDB = data.back.slice(startIndex, endIndex);

        const canvas = await RankUtils.generateRankCanvas(interaction.guild, usersDB, 'Backend');

        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setEmoji('⬅️').setStyle(ButtonStyle.Primary).setCustomId('left'),
            new ButtonBuilder()
            .setLabel(`${newPage}/${totalPages}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
            .setCustomId('paginator_back'),
            new ButtonBuilder().setEmoji('➡️').setStyle(ButtonStyle.Primary).setCustomId('right')
        );

        await interaction.update({ files: [canvas.toBuffer()], components: [buttons] }).catch(() => {});
    }

    else if (data_ids.endsWith('_front')) {
        const totalPages = Math.ceil(data.front.length / 5);

        const currentPage = parseInt(interaction.message.components[0].components[1].label.split('/')[0]);
        const newPage = interaction.customId === 'left' ? Math.max(1, currentPage - 1) : Math.min(totalPages, currentPage + 1);

        const startIndex = (newPage - 1) * 5;
        const endIndex = Math.min(newPage * 5, data.front.length);
        const usersDB = data.front.slice(startIndex, endIndex);

        const canvas = await RankUtils.generateRankCanvas(interaction.guild, usersDB, 'Frontend');

        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setEmoji('⬅️').setStyle(ButtonStyle.Primary).setCustomId('left'),
            new ButtonBuilder()
            .setLabel(`${newPage}/${totalPages}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
            .setCustomId('paginator_front'),
            new ButtonBuilder().setEmoji('➡️').setStyle(ButtonStyle.Primary).setCustomId('right')
        );

        await interaction.update({ files: [canvas.toBuffer()], components: [buttons] }).catch(() => {});
    }
  };
}
