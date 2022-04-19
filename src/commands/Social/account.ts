import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';
import Canvas from 'canvas';
import breakLines from '../../functions/breakLines'
import userM from '../../database/models/users'

import applyText from '../../functions/applyText';

import Format from 'number-formatter-z';

class account extends core {
  constructor(client: Client) {
    super({
      name: 'account',
      aliases: ['conta', 'perfil'],
      cooldown: '10s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:account.syntax',
      description: 'commandsConfig:account.description',
      usage: 'commandsConfig:account.usage',
      category: 'commandsConfig:account.category',
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
        let verify = await userM.model.findById(member?.id)
        
        msg.channel.startTyping()

        //@ts-ignore
      let money = verify?.money || 300
      //@ts-ignore
      let badges = verify?.badges || []
      
      //@ts-ignore
      let biography = verify?.biography


      //@ts-ignore
      let execsCmds = verify?.commandsExec || 0

      const canvas = Canvas.createCanvas(900, 562);
      const ctx = canvas.getContext('2d');

      const background = await Canvas.loadImage(
        'https://i.imgur.com/NSgMUMe.png'
      );
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // x, y, width, heigth

      if (badges.includes("bughunter")) {
        const bugHunterImg = await Canvas.loadImage(
          'https://i.imgur.com/o03HwG1.png'
        );
        ctx.drawImage(bugHunterImg, 615, 360, 40, 40);
      }

      if (badges.includes("dev")) {
        const devImg = await Canvas.loadImage(
          'https://i.imgur.com/3FYU3rE.png'
        );
        ctx.drawImage(devImg, 705, 360, 40, 40);
      }

      if (badges.includes("beta")) {
        const betaImg = await Canvas.loadImage(
          'https://i.imgur.com/lbxWb8L.png'
        );
        ctx.drawImage(betaImg, 792, 355, 50, 50);
      }

      if (badges.includes("partner")) {
        const partnerImg = await Canvas.loadImage(
          'https://i.imgur.com/BmKRsoR.png'
        );
        ctx.drawImage(partnerImg, 612, 452, 40, 40);
      }

      if (badges.includes("friend")) {
        const friendImg = await Canvas.loadImage(
          'https://i.imgur.com/sL2H2Ir.png'
        );
        ctx.drawImage(friendImg, 705, 452, 40, 40);
      }

      ctx.font = '17px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(
        t.translate('commands:account.description'),
        75,
        canvas.height / 2.5
      );

      if (biography != "undefined") {

        let breakLinesBio = breakLines(String(biography),90)
        console.log(breakLinesBio)

        ctx.font = '17px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(String(breakLinesBio), 75, canvas.height / 2.2);
      } else {
        ctx.font = '17px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(t.translate('commands:bio.noBio2'), 75, canvas.height / 2);
      }

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(t.translate('commands:account.execs'), 150, 460);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(
        `${
          execsCmds
            ? await formatOptions.formatWithCommas(execsCmds)
            : 0
        }`,
        150,
        496
      );

      ctx.font = applyText(canvas, String(member?.user?.username), 40);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(String(member?.user?.username), 240, canvas.height / 5);

      ctx.font = applyText(canvas, String(member?.user?.discriminator), 50);
      ctx.fillStyle = '#dbdbdb';
      ctx.fillText(
        `#${String(member?.user?.discriminator)}`,
        240,
        canvas.height / 3.6
      );

      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(
        `${
          money ? await formatOptions.formatWithCommas(money) : 0
        }`,
        665,
        canvas.height / 5
      );

      const avatar = await Canvas.loadImage(
        String(member?.user.displayAvatarURL({ format: 'png' }))
      );
      ctx.drawImage(avatar, 30, 30, 150, 150);

      const image2 = await Canvas.loadImage('https://i.imgur.com/YTY3CBm.png');
      ctx.drawImage(image2, 30, 30, 150, 150);

      const attachment = new MessageAttachment(
        canvas.toBuffer(),
        'account.png'
      );

      //@ts-ignore
      msg.quote(attachment).then (rs => msg.channel.stopTyping());
    } catch (err) {
      console.error(err)

      throw new Error(err)
    }
  }
}

export default account;
