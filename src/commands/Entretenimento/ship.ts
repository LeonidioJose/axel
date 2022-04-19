import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';
import Canvas from 'canvas';
import str from 'string-similarity'

class ship extends core {
  constructor(client: Client) {
    super({
      name: 'ship',
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:ship.syntax',
      description: 'commandsConfig:ship.description',
      usage: 'commandsConfig:ship.usage',
      category: 'commandsConfig:ship.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    const Embed = new this.client.embed();

    if (!args[0] || !args[1]) {
      Embed.setDescription(t.translate('commands:ship.noMember'));

      return msg.channel.send(Embed);
    }

    let user1 = this.client.users.cache.get(
      args[0]
        .replace('!', '')
        .replace('<', '')
        .replace('>', '')
        .replace('@', '')
    );
    let user2 = this.client.users.cache.get(
      args[1]
        .replace('!', '')
        .replace('<', '')
        .replace('>', '')
        .replace('@', '')
    );

    if (!user1 || !user2) {
      Embed.setDescription(t.translate('commands:ship.noMember'));

      return msg.channel.send(Embed);
    }

    if (user1 === user2) {
      Embed.setDescription(t.translate('commands:ship.sameMembers'));

      return msg.channel.send(Embed);
    }

    let shipname =
      user1.username.slice(0, user1.username.length / 2.23) +
      user2.username.slice(
        user2.username.length / 2.2356,
        user2.username.length
      );


    let percent = Math.ceil(Math.random() * 100)

    let emote;
    if (percent < 25) emote = '💔';
    if (percent >= 25) emote = '😳';
    if (percent >= 50) emote = '🥰';
    if (percent >= 75) emote = '😍';
    if (percent >= 90) emote = '❤️';

    let user1Avatar = user1.displayAvatarURL({ format: 'png' });
    let user2Avatar = user2.displayAvatarURL({ format: 'png' });

    const canvas = Canvas.createCanvas(700, 350);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(
      'https://i.imgur.com/P7yZbeb.png'
    );
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatarUser1 = await Canvas.loadImage(user1Avatar);
    ctx.drawImage(avatarUser1, 80, 100, 150, 150);

    const avatarUser2 = await Canvas.loadImage(user2Avatar);
    ctx.drawImage(avatarUser2, 470, 100, 150, 150);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'ship.png');

    //@ts-ignore
    msg.quote(
      t.translate('commands:ship.description', {
        firstUser: user1.username,
        secondUser: user2.username,
        ship: shipname,
        porcentagem: percent,
        emoji: emote,
      })
      
    ,{
      files: [attachment]
    });
    
  }
}

export default ship;
