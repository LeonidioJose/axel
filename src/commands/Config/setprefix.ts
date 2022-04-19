import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import guildModel from '../../database/models/guilds'

import firebase from 'firebase';

class setprefix extends core {
  constructor(client: Client) {
    super({
      name: 'setprefix',
      aliases: [],
      cooldown: '15s',
      userPermissions: ['MANAGE_GUILD'],
      botPermissions: [],
      description: 'commandsConfig:setprefix.description',
      syntax: 'commandsConfig:setprefix.syntax',
      usage: 'commandsConfig:setprefix.usage',
      category: 'commandsConfig:setprefix.category',
    },client);

  }

  async run(msg: Message, args: string[], t: any) {
    let newPrefix = args[0];

    let Embed = new this.client.embed();

    if (!newPrefix) {
      Embed.setDescription(t.translate('commands:setprefix.noPrefix'))

      //@ts-ignore
      return msg.quote(Embed);
    }

    if (newPrefix.length > 3) {
      Embed.setDescription(t.translate('commands:setprefix.maxChars'));

      //@ts-ignore
      return msg.quote(Embed);
    }

    if (newPrefix === 'a!') {
      Embed.setDescription(t.translate('commands:setprefix.defaultPrefix'));

      //@ts-ignore
      return msg.quote(Embed);
    }

    let anotherArgs = args.slice(1).join(' ');

    if (anotherArgs) {
      Embed.setDescription(t.translate('commands:setprefix.moreArgs'));

      //@ts-ignore
      return msg.quote(Embed);
    }

    try {
      let us
      let guild = await guildModel.model.findById(msg.guild?.id)

      if(guild) {
        //@ts-ignore
        guild.prefix = newPrefix
        guild.save()
      } else {
        let set = new guildModel.model({
          _id: msg.guild?.id,
          prefix: newPrefix
        }).save()
      }

      Embed.setDescription(
        t.translate('commands:setprefix.success', { prefix: newPrefix })
      );

      //@ts-ignore
      return msg.quote(Embed);
    } catch (err) {
      this.client.logger.error(err);

      Embed.setDescription(
        t.translate('commands:setprefix.error', { error: err })
      );

      //@ts-ignore
      return msg.reply(Embed);
    }
  }
}

export default setprefix;
