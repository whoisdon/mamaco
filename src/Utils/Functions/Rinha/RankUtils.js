import { loadImage, createCanvas } from 'canvas';
import { registerFont } from 'canvas';

registerFont('./src/Utils/Fonts/Oswald.ttf', { family: 'osvaldo' });

export const simplifyName = (fullName) => {
  const names = fullName.split(' ');
  if (names.length === 1) {
    return names[0];
  }
  const preservedWords = ['de', 'dos', 'da'];
  const simplifiedNames = [
    names[0],
    ...names.slice(1, -1).map((middleName) =>
      preservedWords.includes(middleName.toLowerCase())
        ? middleName
        : middleName[0] + '.'
    ),
    names[names.length - 1],
  ];
  return simplifiedNames.join(' ');
};

export const drawImageWithText = (ctx, image, text, x, y) => {
  ctx.font = '25px osvaldo';
  ctx.drawImage(image, x, y, 25, 25);

  if (text === 'não encontrado') {
    ctx.fillStyle = '#FF0000';
    ctx.strokeText(`${text}`, x + 30, y + 24);
    ctx.fillText(`${text}`, x + 30, y + 24);
  } else {
    ctx.strokeText(`${text}`, x + 30, y + 24);
    ctx.fillText(`${text}`, x + 30, y + 24);
  }
};

export const generateRankCanvas = async (guild, usersDB, type) => {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  const pic = [
    'https://i.imgur.com/62uwHFD.jpg',
    'https://i.imgur.com/EBFUs6s.png',
    'https://avatarfiles.alphacoders.com/129/129785.jpg',
    'https://i.imgur.com/URhujtS.png',
    'https://i.pinimg.com/736x/38/aa/39/38aa39ae59e0af0557a7aafb699c6b73.jpg',
  ];

  const [serverIcon, background, layout, insta, discord] = await Promise.all([
    loadImage(guild.iconURL({ forceStatic: true, extension: 'png', size: 4096 })),
    loadImage('https://i.imgur.com/XJobkQf.png'),
    loadImage('https://i.imgur.com/RCBNEMa.png'),
    loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png'),
    loadImage('https://i.imgur.com/tNMFePQ.png'),
  ]);

  ctx.drawImage(serverIcon, 515, -102.5, 285, 285);
  ctx.drawImage(background, 0, 75, canvas.width, canvas.height);
  ctx.drawImage(layout, 0, 0, canvas.width, canvas.height);

  ctx.font = '33px osvaldo';
  ctx.fillStyle = '#F8F8F8';
  ctx.fillText(`${type} ${guild.name}`, 265 - guild.name.length * 8, 50);

  for (let i = 0; i < usersDB.length; i++) {
    const cordenada = i * 105;
    ctx.save();

    const user = usersDB[i];
    const search = guild.client.users.cache.get(user?.id);
    const name = simplifyName(user.name);

    ctx.font = '40px osvaldo';
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(`${name}`, 290, cordenada + 115);
    ctx.fillText(`${name}`, 290, cordenada + 115);

    drawImageWithText(ctx, insta, user.insta, 290, cordenada + 122);
    drawImageWithText(ctx, discord, search?.username || 'não encontrado', 290, cordenada + 150);

    ctx.beginPath();
    ctx.moveTo(0, cordenada + 75);
    ctx.lineTo(265, cordenada + 75);
    ctx.lineTo(285, cordenada + 180);
    ctx.lineTo(0, cordenada + 180);
    ctx.lineTo(0, cordenada + 75);
    ctx.closePath();
    ctx.clip();

    const userAvatar = await loadImage(search?.displayAvatarURL({ forceStatic: true, extension: 'png', size: 4096 }) ?? pic[i]);
    ctx.drawImage(userAvatar, 0, cordenada, 285, 285);
    ctx.restore();
  }

  return canvas;
};
