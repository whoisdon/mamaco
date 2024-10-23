import SlashCommands from '../../Structure/SlashCommands.js';
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      onlyDevs: true,
      data: new SlashCommandBuilder()
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
     	.setName('set')
     	.setDescription('[Developer] Comando privado apenas para o desenvolvedor desta aplicação.')  
      .addSubcommand(subcommand => subcommand
        	.setName('form')
     		  .setDescription('[Developer] Comando privado apenas para o desenvolvedor desta aplicação.')  
            .addChannelOption(option => option 
                .setName('channel')
                .setDescription('[Developer] Comando privado apenas para o desenvolvedor desta applicação')
                .addChannelTypes(ChannelType.GuildText)
            )
      )
      .addSubcommand(subcommand => subcommand
        .setName('bilheteria')
         .setDescription('[Developer] Comando privado apenas para o desenvolvedor desta aplicação.')  
          .addChannelOption(option => option 
              .setName('channel')
              .setDescription('[Developer] Comando privado apenas para o desenvolvedor desta applicação')
              .addChannelTypes(ChannelType.GuildText)
          )
      )
    });
  }

  run = async (interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    const form = new EmbedBuilder()
    .setTitle('Participantes da Rinha')
    .setColor('#FFFF00')
    .setImage('https://i.imgur.com/iCDgWql.png')
    .setDescription(`Neste espaço, valorizamos um atendimento direto e eficiente. Contudo, solicitamos que você utilize-o com consciência.

Precisamos da sua colaboração para aprimorar nossa experiência durante a rinha de backend e frontend. Pedimos sinceridade ao atualizar as informações em seus respectivos registros.`)

  const bilheteria = new EmbedBuilder()
  .setTitle('Bilheteria da Rinha')
  .setColor('#6064f4')
  .setImage('https://i.imgur.com/wRdTXtx.png')
  .setDescription(`Bem-vindo à Bilheteria da Rinha de Backend e Frontend! Aqui, você pode apostar em seus participantes favoritos para ter a chance de ganhar mamacos coin.

Para participar, basta comprar bilhetes e escolher o participante em quem deseja apostar.`)


    const bilheteria_button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setEmoji('<:ticket_:1175477002921324575>')
        .setLabel('Apostar')
        .setStyle(ButtonStyle.Success)
        .setCustomId('apostar')
    )

    const form_button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setLabel('Atualizar Informações')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('update')
    )

    switch (subcommand) {
      case 'form':
        channel.send({ embeds: [form], components: [form_button] }).then(() => {
          interaction.reply({ content: 'send', ephemeral: true })
        })
      break;
      case 'bilheteria':
        channel.send({ embeds: [bilheteria], components: [bilheteria_button] }).then(() => {
          interaction.reply({ content: 'send', ephemeral: true })
        })
      break;
    }
  }
}
