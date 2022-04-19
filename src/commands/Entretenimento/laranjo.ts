import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';
import Canvas from 'canvas';

class laranjo extends core {
  constructor(client: Client) {
    super({
      name: 'laranjo',
      aliases: [],
      cooldown: '10s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:laranjo.syntax',
      description: 'commandsConfig:laranjo.description',
      usage: 'commandsConfig:laranjo.usage',
      category: 'commandsConfig:laranjo.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    try {
      let text = args.slice(0).join(' ');

      if (!text)
        return msg.channel.send(t.translate('commands:laranjo.noText'));

      if (text.length > 60)
        return msg.channel.send(
          t.translate('commands:laranjo.moreChars', { charsNumber: 60 })
        );

      const canvas = Canvas.createCanvas(600, 350);
      const ctx = canvas.getContext('2d');

      const background = await Canvas.loadImage(
        'https://i.imgur.com/Rfoo9GY.jpg'
      );
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(String(text), 25, canvas.height / 7);

      const attachment = new MessageAttachment(
        canvas.toBuffer(),
        'laranjo.png'
      );

      msg.channel.send(attachment);
    } catch (err) {
      this.client.logger.error(err);
      msg.channel.send(t.translate('commands:laranjo.error'));
    }
  }
}

export default laranjo;
