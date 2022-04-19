import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';
import Canvas from 'canvas';
import userModel from '../../database/models/users'

import applytext from '../../functions/applyText';
import Format from 'number-formatter-z';

class saldo extends core {

  constructor(client: Client) {
    super({
      name: 'saldo',
      aliases: ['money', 'bank', 'bal'],
      cooldown: '10s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:saldo.syntax',
      description: 'commandsConfig:saldo.description',
      usage: 'commandsConfig:saldo.usage',
      category: 'commandsConfig:saldo.category',
    },client);

  }

  async run(msg: Message, args: string[], t: any) {
    try {
      let formatOptions = new Format();

      let member =
        msg.mentions.members?.first() ||
        msg.guild?.members.cache.get(args[0]) ||
        msg.guild?.members.cache.find(
          (a) => a.user.username.toLowerCase() === args.join(' ').toLowerCase()
        ) ||
        msg.member;

        let verify = await userModel.model.findById(member?.id)
        //@ts-ignore
      let money = verify?.money || 300

      const canvas = Canvas.createCanvas(700, 350);
      const ctx = canvas.getContext('2d');

      const background = await Canvas.loadImage(
        'https://i.imgur.com/IZUcZxI.png'
      );
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        t.translate('commands:saldo.account'),
        230,
        canvas.height / 3.5
      );

      ctx.font = applytext(canvas, String(member?.user.tag), 45);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(String(member?.user?.tag), 240, canvas.height / 1.94);

      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(
        `${
          money ? await formatOptions.formatWithCommas(money) : 0
        }`,
        90,
        canvas.height / 1.35
      );

      const avatar = await Canvas.loadImage(
        String(member?.user.displayAvatarURL({ format: 'png' }))
      );
      ctx.drawImage(avatar, 55, 47, 120, 120);

      const image2 = await Canvas.loadImage('https://i.imgur.com/YTY3CBm.png');
      ctx.drawImage(image2, 55, 47, 120, 120);

      const attachment = new MessageAttachment(canvas.toBuffer(), 'saldo.png');

      //@ts-ignore
      msg.quote(attachment);
    } catch (err) {
      console.log(err);
      //@ts-ignore
      msg.quote(t.translate('commands:saldo.error'));
    }
  }
}

export default saldo;
