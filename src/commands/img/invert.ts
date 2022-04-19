import core from '../../core/commands';
import { Collection, Message, MessageAttachment } from 'discord.js';
import Client from '../../Axel';
import Canvas from 'canvas';

class invert extends core {
  constructor(client: Client) {
    super({
      name: 'invert',
      usage: 'commandsConfig:invert.usage',
      description: 'commandsConfig:invert.description',
      syntax: 'commandsConfig:invert.syntax',
      category: 'commandsConfig:invert.category',
    },client);
  }

  async run(msg: Message, args: Array<any>, t: any,{mentions, memberMentions}: any) {
    let link;
    let print = msg.attachments.first();
    let attachLastFetch = await msg.channel.messages.fetch({limit: 100})
    let attachLast = attachLastFetch.filter(c => c.attachments.size > 0).sort((a: Message, b: Message) => b.createdTimestamp - a.createdTimestamp).first()

    if (print) {
      link = print.url;
    } else if (
      args[0] && this.client.users.cache.filter((b) => b.username.toLowerCase().includes(args.join(' ').toLowerCase())).first()
    ) {
      link = this.client.users.cache.filter((b) => b.username.toLowerCase().includes(args.join(' ').toLowerCase())).first()
        ?.displayAvatarURL({ dynamic: false, format: 'png' });
    } else if (this.client.users.cache.get(args[0])) {
      link = this.client.users.cache
        .get(args[0])
        ?.displayAvatarURL({ format: 'png' });
    } else if (mentions.first()) {
      link = mentions.first()?.displayAvatarURL({ format: 'png' });
    } else if (
      //@ts-ignore
      args[0] && msg.guild?.members.cache.filter((b) => b.nickname?.toLowerCase().includes(args.join(' ').toLowerCase())).first()
    ) {
      //@ts-ignore
      link = msg.guild?.members.cache.filter((b) => b.nickname?.toLowerCase().includes(args.join(' ').toLowerCase())).first()?.user.displayAvatarURL({ format: 'png' });
    } else if (
      args[0] &&
      args[0].search(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i) >= 0
    ) {
      link = args[0];
    } else if(
      attachLast
    ) {
      //@ts-ignore
      link = attachLast.attachments.first()?.url
    } else if (!link) {
      link = msg.author.displayAvatarURL({ format: 'png' });
    }

    let propObj = this.client.getDimensions(link);

    let Imag = await Canvas.loadImage(link);

    const canvas = Canvas.createCanvas(Imag.width, Imag.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(Imag, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, (await propObj).width, (await propObj).height);

    let Attach = new MessageAttachment(canvas.toBuffer(), 'invert.png');

    //@ts-ignore
    msg.quote(Attach);
  }
}

export default invert;
