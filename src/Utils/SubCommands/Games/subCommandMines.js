import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';

const subCommandMines = async ({ interaction, emoji, firebase }) => {
    const option = interaction.options.getString('foguetim') ?? 2;

    let isFinish = false;
    let boardSize = 5;
    let numberOfBombs = parseInt(option);
    
    if (option === 'cell_2') {
        boardSize = 4;
        numberOfBombs = 2;
    }
    
    const bombPositions = [];

    while (bombPositions.length < numberOfBombs) {
        const x = ~~(Math.random() * boardSize);
        const y = ~~(Math.random() * boardSize);

        const position = `${x}-${y}`;

        if (!bombPositions.includes(position)) {
            bombPositions.push(position);
        }
    }

    const buttons = [];

    for (let y = 0; y < boardSize; y++) {
        const row = [];

        for (let x = 0; x < boardSize; x++) {
            const isBomb = bombPositions.includes(`${x}-${y}`);

            const button = new ButtonBuilder()
                .setCustomId(`${interaction.user.id}-${x}-${y}`) 
                .setLabel('❓')
                .setStyle(ButtonStyle.Secondary);

            row.push(button);
        }

        buttons.push(row);
    }

    const buttonRows = buttons.map(row => new ActionRowBuilder().addComponents(...row));

    const reply = await interaction.reply({
        content: 'Campo Minado!',
        components: buttonRows,
        fetchReply: true,
        ephemeral: true
    });

    const totalDiamonds = (boardSize * boardSize) - numberOfBombs;
    let diamondsDiscovered = 0;
    
    const filter = (i) => {
        if (i.user.id !== interaction.user.id) {
            i?.reply({ content: `${emoji.rs} **|** ${i.user} apenas ${interaction.user} pode interagir com os botões!`, ephemeral: true }).catch(() => { });
            return false;
        }
        return true;
	};
    
    const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
        if (isFinish) {
            interaction.reply({ content: `❌ **|** O jogo foi encerrado!`, ephemeral: true })
            return;
        }

        const [_, x, y] = interaction.customId.split('-').map(Number);
        const isBomb = bombPositions.includes(`${x}-${y}`);
        
        const content = isBomb 
        ? `Kaboom! ${emoji.kabum} Parece que você encontrou um curso pago! Não caia no conto do foguetim.` 
        : diamondsDiscovered + 1 === 0 
        ? `${emoji.gddiamond} | Eureka! Um mamaco acaba de atravessar seu caminho! Brilhe como um verdadeiro aventureiro!`
        : `${emoji.gddiamond} | Ei, você é como o Botas da Dora Aventureira! Um? Dois? Três? Não pare agora, você está em uma selva de aventuras! (${diamondsDiscovered + 1 > 1 ? `\`${diamondsDiscovered + 1}\` Mamacos encontrados` : `\`${diamondsDiscovered + 1}\` Mamaco encontrado`})`;
        
        const newButton = new ButtonBuilder()
            .setCustomId(interaction.customId)
            .setEmoji(isBomb ? emoji.gbomb : emoji.gddiamond)
            .setStyle(isBomb ? ButtonStyle.Danger : ButtonStyle.Primary) 
            .setDisabled(true);

        const rowIndex = y;
        const row = [...buttonRows[rowIndex].components];
        row[x] = newButton;

        buttonRows[rowIndex] = new ActionRowBuilder().addComponents(...row);

        await interaction?.update({ content, components: buttonRows }).catch(() => { });
        
        if (isBomb) {
            isFinish = true;
            buttonRows.forEach(row =>
                row.components.forEach(button => button.setDisabled(true))
            );
        
            await interaction.message.edit({ content, components: buttonRows }).catch(() => { });
        } else {
            diamondsDiscovered++;

            if (diamondsDiscovered === totalDiamonds) {
                isFinish = true;

                let ago = (await firebase.ref(`Users/${interaction.user.id}/Donkeys`).once("value")).val() || 0;

                const finish = 100 - (numberOfBombs * 2);
                ago += Math.max(finish, 0);

                firebase.ref(`Users/${interaction.user.id}/Donkeys`).set(ago);
                await interaction.editReply({ content: `Você é uma estrela brilhante! Todos os mamacos são seus ${emoji.rs}, e você venceu o jogo com estilo!`, components: [] }).catch(() => { });;
            }
        }
    });

    collector.on('end', (_, reason) => {
        if (reason === 'time') {
            reply?.edit({ content: `${emoji.rs} **|** O tempo voou mais rápido do que o Flash! Você está fora de tempo! ⌛🏃‍`, components: [] }).catch(() => { });
        }
    });
}

export default subCommandMines;
