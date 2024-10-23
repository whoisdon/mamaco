import SlashCommands from '../../Structure/SlashCommands.js';
import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import * as RankUtils from '../../Utils/Functions/Rinha/RankUtils.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      guildCollection: ['1154389285718462514'],
      deferReply: true,
      data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('rank')
        .setDescription('[Developer] Comando privado apenas para o desenvolvedor desta aplicação.'),
    });
  }

  run = async (interaction) => {
    const data = await this.quickdb.get('Participantes');
    const usersDB = data.back.slice(0, 5);

    const canvas = await RankUtils.generateRankCanvas(interaction.guild, usersDB);

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setEmoji('⬅️').setStyle(ButtonStyle.Primary).setCustomId('left'),
        new ButtonBuilder()
          .setLabel(`1/${Math.ceil(data.back.length / 5)}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
          .setCustomId('paginator'),
        new ButtonBuilder().setEmoji('➡️').setStyle(ButtonStyle.Primary).setCustomId('right')
    );

    await interaction.editReply({
      files: [canvas.toBuffer()],
      components: [buttons]
    });
  };
}
