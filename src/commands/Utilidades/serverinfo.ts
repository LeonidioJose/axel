import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';
import Canvas from 'canvas';
import moment from 'moment';

import formatNum from '../../functions/formatNum';
import applyText from '../../functions/applyText';

class serverinfo extends core {
  constructor(client: Client) {
    super({
      name: 'serverinfo',
      aliases: ['sinfo'],
      cooldown: '10s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:serverinfo.syntax',
      description: 'commandsConfig:serverinfo.syntax',
      usage: 'commandsConfing:serverinfo.usage',
      category: 'commandsConfig:serverinfo.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    try {
      let canaistexto = msg.guild?.channels.cache.filter(
        (a) => a.type === 'text'
      ).size;
      let canaisvoz = msg.guild?.channels.cache.filter(
        (a) => a.type === 'voice'
      ).size;

      let cargos = msg.guild?.roles.cache.size;

      let emojis = msg.guild?.emojis.cache.size;

      let verificationLevels;
      let status;
      let regions;

      if ((await this.client.getGuildLang(String(msg.guild?.id))) === 'pt') {
        verificationLevels = {
          NONE: 'Nenhum!',
          LOW: 'Baixo!',
          MEDIUM: 'Médio!',
          HIGH: 'Alto!',
          VERY_HIGH: 'Muito Alto!',
        };

        status = {
          online: 'Disponível',
          idle: 'Ausente',
          dnd: 'Não perturbe',
          offline: 'Offline',
        };

        regions = {
          brazil: 'Brasil',
          europe: 'Europa',
          hongkong: 'Hong Kong',
          india: 'Índia',
          japan: 'Japão',
          russia: 'Rússia',
          singapore: 'Singapura',
          southafrica: 'África',
          sydney: 'Sydney',
          'us-central': 'US Central',
          'us-east': 'US East',
          'us-west': 'US West',
          'us-south': 'US South',
        };

        moment.locale('pt-br');
      } else {
        verificationLevels = {
          NONE: 'None!',
          LOW: 'Low!',
          MEDIUM: 'Medium!',
          HIGH: 'High!',
          VERY_HIGH: 'Very High!',
        };

        status = {
          online: 'Online',
          idle: 'Idle',
          dnd: 'Do not disturb',
          offline: 'Offline',
        };

        regions = {
          brazil: 'Brazil',
          europe: 'Europe',
          hongkong: 'Hong Kong',
          india: 'India',
          japan: 'Japan',
          russia: 'Russia',
          singapore: 'Singapore',
          southafrica: 'South Africa',
          sydney: 'Sydney',
          'us-central': 'US Central',
          'us-east': 'US East',
          'us-west': 'US West',
          'us-south': 'US South',
        };

        moment.locale('en');
      }

      const dnd = msg.guild?.members.cache.filter(
        (a) => a.presence.status === 'dnd'
      ).size;
      const on = msg.guild?.members.cache.filter(
        (a) => a.presence.status === 'online'
      ).size;
      const idle = msg.guild?.members.cache.filter(
        (a) => a.presence.status === 'idle'
      ).size;
      const off = msg.guild?.members.cache.filter(
        (a) => a.presence.status === 'offline'
      ).size;

      const canvas = Canvas.createCanvas(1000, 600);
      const ctx = canvas.getContext('2d');

      const background = await Canvas.loadImage(
        'https://i.imgur.com/bf8uYjQ.png'
      );
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      /**
       * ! guild name/id
       */

      ctx.font = applyText(canvas, String(msg.guild?.name), 45);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${String(msg.guild?.name)}`, 175, canvas.height / 5.5);

      /**
       * ! canais de voz
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `🎤 ${t.translate('commands:serverinfo.voice', {
          voice: formatNum(Number(canaisvoz)),
        })}`,
        50,
        canvas.height / 2.2
      );

      /**
       * ! canais de texto
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `📜 ${t.translate('commands:serverinfo.text', {
          text: formatNum(Number(canaistexto)),
        })}`,
        285,
        canvas.height / 2.2
      );

      /**
       * ! regiao
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      //@ts-ignore
      ctx.fillText(
        `🌐 ${t.translate('commands:serverinfo.region', {
          country: regions[msg.guild?.region],
        })}`,
        525,
        canvas.height / 2.2
      );

      /**
       * ! roles
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `💼 ${t.translate('commands:serverinfo.roles', {
          roles: formatNum(Number(cargos)),
        })}`,
        820,
        canvas.height / 2.2
      );

      /**
       * ! verification level
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      //@ts-ignore
      ctx.fillText(
        `✅ ${t.translate('commands:serverinfo.verifLevel', {
          level: verificationLevels[msg.guild?.verificationLevel],
        })}`,
        50,
        canvas.height / 1.5
      );

      /**
       * ! emojis qtd
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `🎲 ${t.translate('commands:serverinfo.emojis', {
          emojisQtd: formatNum(Number(emojis)),
        })}`,
        325,
        canvas.height / 1.5
      );

      /**
       * ! boost qtd
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `🎉 ${t.translate('commands:serverinfo.boostQtd', {
          boosts: msg.guild?.premiumSubscriptionCount,
        })}`,
        480,
        canvas.height / 1.5
      );

      /**
       * ! boost lvl
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `🎁 ${t.translate('commands:serverinfo.boostLvl', {
          boostLvl: msg.guild?.premiumTier
            ? `Impulso ${msg.guild?.premiumTier}`
            : t.translate('commands:serverinfo.noBoost'),
        })}`,
        785,
        canvas.height / 1.5
      );

      /**
       * ! members qtd
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `👥 ${t.translate('commands:serverinfo.membersQtd', {
          members: formatNum(Number(msg.guild?.memberCount)),
        })}`,
        50,
        canvas.height / 1.15
      );

      /**
       * ! bots qtd
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `🤖 ${t.translate('commands:serverinfo.botsQtd', {
          bots: formatNum(
            Number(msg.guild?.members.cache.filter((mem) => mem.user.bot).size)
          ),
        })}`,
        325,
        canvas.height / 1.15
      );

      /**
       * ! when joined
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `🚪 ${t.translate('commands:serverinfo.joinedAt', {
          joined: moment(msg.guild?.me?.joinedAt).format('LL'),
        })}`,
        575,
        canvas.height / 1.15
      );

      /**
       * ! created date
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `📆 ${t.translate('commands:serverinfo.createdAt', {
          created: moment(msg.guild?.createdAt).format('LL'),
        })}`,
        175,
        canvas.height / 3.5
      );

      /**
       * ! owner
       */

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `👑 ${t.translate('commands:serverinfo.owner', {
          owner: msg.guild?.owner?.user.tag,
        })}`,
        650,
        canvas.height / 3.5
      );

      let guildAvatar = msg.guild?.iconURL({ format: 'png' })
        ? msg.guild?.iconURL({ format: 'png' })
        : 'https://media.istockphoto.com/vectors/no-image-available-sign-vector-id922962354?k=6&m=922962354&s=612x612&w=0&h=_KKNzEwxMkutv-DtQ4f54yA5nc39Ojb_KPvoV__aHyU=';

      //@ts-ignore
      const guildImg = await Canvas.loadImage(guildAvatar);
      ctx.drawImage(guildImg, 13, 15, 145, 145);

      const redondo = await Canvas.loadImage('https://i.imgur.com/YTY3CBm.png');
      ctx.drawImage(redondo, 13, 15, 145, 145); // img, x, y, width, heigth

      const attachment = new MessageAttachment(
        canvas.toBuffer(),
        'serverinfo.png'
      );

      //@ts-ignore
      msg.quote(attachment);
    } catch (err) {
      this.client.logger.error(err);
      //@ts-ignore
      msg.quote(t.translate('commands:serverinfo.error'));
    }
  }
}

export default serverinfo;
