import EventMap from '../../Structure/EventMap.js';
import { ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } from 'discord.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'interactionCreate'
    });
  }

  run = async (interaction) => {
    const log = new ActionRowBuilder()
      .addComponents(
        new TextInputBuilder()
          .setCustomId('form/placeholder')
          .setLabel('Nome ou Instagram:')
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(4000)
          .setPlaceholder('Informe seu nome ou instagram registrado no formulário.')
          .setRequired(true)
      );

    const modal = new ModalBuilder()
      .setCustomId('modals/from')
      .setTitle('Página do Participante')
      .addComponents([log]);

    if (interaction.customId === 'update') {
      interaction.showModal(modal);
      return;
    } else if (interaction.customId === 'modals/from') {
      const list = await this.quickdb.get('Participantes') || { back: [], front: [] };
      const insta = interaction.fields.getTextInputValue('form/placeholder').toLowerCase().replace('@');
      const userId = interaction.user.id;
      
      const userExistsBack = list.back.some(entry => entry.insta.toLowerCase() === insta || entry.name.toLowerCase() === insta);
      const userExistsFront = list.front.some(entry => entry.insta.toLowerCase() === insta || entry.name.toLowerCase() === insta);

      if (!userExistsBack && !userExistsFront) {
        interaction.reply({ content: `${this.emoji.rs} **|** Não foi possível encontrá-lo na lista de participantes. Verifique sua ortografia!`, ephemeral: true });
        return;
      }

      const userWithIdBack = list.back.some(entry => entry.insta.toLowerCase() === insta && entry.id || entry.name.toLowerCase() === insta && entry.id);
      const userWithIdFront = list.front.some(entry => entry.insta.toLowerCase() === insta && entry.id || entry.name.toLowerCase() === insta && entry.id);

      if (userWithIdBack || userWithIdFront) {
        interaction.reply({ content: `${this.emoji.rs} **|** Suas informações já foram verificadas anteriormente!`, ephemeral: true });
        return;
      }

      const updatedList = {
        back: updateID(list.back, insta, userId),
        front: updateID(list.front, insta, userId),
      };

      await this.quickdb.set('Participantes', updatedList);

      interaction.reply({ content: `${this.emoji.rs} **|** Suas informações foram atualizadas com sucesso!`, ephemeral: true });
      return;
    }
  }
}

const updateID = (array, insta, newId) => {
  return array.map(entry => (entry.insta.toLowerCase() === insta || entry.name.toLowerCase() === insta ? { ...entry, id: newId } : entry));
};
