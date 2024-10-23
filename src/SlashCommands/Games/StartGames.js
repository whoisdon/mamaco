import SlashCommands from '../../Structure/SlashCommands.js';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

import subCommandMines from '../../Utils/SubCommands/Games/subCommandMines.js';
import subCommandTic from '../../Utils/SubCommands/Games/subCommandTic.js';
import subCommandTermo from '../../Utils/SubCommands/Games/subCommandTermo.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('[Game] Se divirta com jogos clássicos e divertidos.')  
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand
          .setName('tic-tac-toe')
          .setDescription('[Game] Entre no desafio do clássico jogo da velha e mostre quem manda.')
          .addStringOption(option => option 
            .setName('dificuldade')
            .setDescription('[Dificuldade] Em qual dificuldade gostaria de arriscar?')
            .setRequired(false)
            .addChoices(
              { name: 'Fácil', value: 'easy' },
              { name: 'Médio', value: 'average' },
              { name: 'Difícil', value: 'hard' },
              { name: 'Impossível', value: 'impossible' }
            )
		    )
          .addUserOption(user => user
              .setName('multiplayer')
              .setDescription('[User] Junte-se ao jogo da velha multiplayer e mostre suas habilidades estratégicas!')
          )
        )
        .addSubcommand(subcommand => subcommand
          .setName('termo')
          .setDescription('[Game] Teste seu vocabulário e mostre sua habilidade em adivinhar a palavra secreta!')
        )
        .addSubcommand(subcommand => subcommand
          .setName('mines')
          .setDescription('[Game] Entre na aventura do jogo Mines e arrase colecionando todos os Foguetim!')
          .addStringOption(option => option 
            .setName('foguetim')
            .setDescription('[Mines] Quantos foguetes serão adicionadas ao game?')
            .setRequired(false)
            .addChoices(
              { name: 'Selecionar 2 Foguetim', value: '2' },
              { name: 'Selecionar 3 Foguetim', value: '3' },
              { name: 'Selecionar 4 Foguetim', value: '4' },
              { name: 'Selecionar 5 Foguetim', value: '5' },
              { name: 'Selecionar 6 Foguetim', value: '6' },
              { name: 'Selecionar 7 Foguetim', value: '7' },
              { name: 'Selecionar 8 Foguetim', value: '8' },
              { name: 'Selecionar 9 Foguetim', value: '9' },
              { name: 'Selecionar 10 Foguetim', value: '10' },
              { name: 'Selecionar 11 Foguetim', value: '11' },
              { name: 'Selecionar 12 Foguetim', value: '12' },
              { name: 'Selecionar 13 Foguetim', value: '13' },
              { name: 'Selecionar 14 Foguetim', value: '14' },
              { name: 'Selecionar 15 Foguetim', value: '15' },
              { name: 'Selecionar 16 Foguetim', value: '16' },
              { name: 'Selecionar 17 Foguetim', value: '17' },
              { name: 'Selecionar 18 Foguetim', value: '18' },
              { name: 'Selecionar 19 Foguetim', value: '19' },
              { name: 'Selecionar 20 Foguetim', value: '20' },
              { name: 'Selecionar 21 Foguetim', value: '21' },
              { name: 'Selecionar 22 Foguetim', value: '22' },
              { name: 'Selecionar 23 Foguetim', value: '23' },
              { name: 'Selecionar 24 Foguetim', value: '24' },
              { name: '4x4 (2 Foguetim)', value: 'cell_2' },
            )
          )
        )
    });
  }

  run = async (interaction) => {
    const game = interaction.options.getSubcommand()

    switch (game) {
      case 'mines':
        subCommandMines({ interaction, emoji: this.emoji, firebase: this.firebase })
      break;
      case 'tic-tac-toe':
        subCommandTic({ interaction, emoji: this.emoji, firebase: this.firebase }) 
      break;
      case 'termo':
        new subCommandTermo({ emoji: this.emoji, firebase: this.firebase }).createGame(interaction)
      break;
    }
  }
}
