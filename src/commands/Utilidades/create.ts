import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import isHexColor from 'is-hexcolor';

class create extends core {
  constructor(client: Client) {
    super({
      name: 'create',
      aliases: [],
      cooldown: '5s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:create.syntax',
      description: 'commandsConfig:create.description',
      usage: 'commandsConfig:create.usage',
      category: 'commandsConfig:create.category',
    },client);
  }

  async run(msg: Message, args: Array<string>, t: any) {
    let whatCreateArray = [
      'channel',
      'canal',
      'category',
      'categoria',
      'role',
      'cargo',
    ];

    let optionsArray = ['voz', 'voice', 'text', 'texto'];

    let whatCreate = args[0];
    let channelType = args[1];
    let channelName;

    if (!whatCreateArray.includes(whatCreate))
      return this.send(t.translate('commands:create.nothing'));

    if (
      (whatCreate === whatCreateArray[0] ||
        whatCreate === whatCreateArray[1]) &&
      (channelType === optionsArray[0] || channelType === optionsArray[1])
    ) {
      channelName = args.slice(2).join(' ');

      if (!['voice', 'voz'].includes(channelType))
        if (!channelType)
          return this.send(t.translate('commands:create.noChannelType'));
      if (!channelName)
        return this.send(t.translate('commands:create.noChannelName'));

      msg.guild?.channels.create(channelName, { type: 'voice' });

      return this.send(
        t.translate('commands:create.voiceSuccess', { channel: channelName })
      );
    }

    if (
      (whatCreate === whatCreateArray[0] ||
        whatCreate === whatCreateArray[1]) &&
      (channelType === optionsArray[2] || channelType === optionsArray[3])
    ) {
      channelName = args.slice(2).join(' ');

      if (!channelType)
        return msg.channel.send(t.translate('commands:create.noChannelType'));
      if (!channelName)
        return msg.channel.send(t.translate('commands:create.noChannelName'));

      msg.guild?.channels.create(channelName, { type: 'text' });

      return msg.channel.send(
        t.translate('commands:create.textSuccess', { channel: channelName })
      );
    }

    if (
      whatCreate === whatCreateArray[2] ||
      whatCreate === whatCreateArray[3]
    ) {
      channelType = args.slice(1).join(' ');

      if (!channelType)
        return msg.channel.send(t.translate('commands:create.noCategoryName'));

      msg.guild?.channels.create(channelType, { type: 'category' });

      return msg.channel.send(
        t.translate('commands:create.categorySuccess', { categ: channelType })
      );
    }

    if (
      whatCreate === whatCreateArray[4] ||
      whatCreate === whatCreateArray[5]
    ) {
      let roleName = args[1];
      let color = args[2];


      if (!roleName)
      return msg.channel.send(t.translate('commands:create.noName'));

      if (!color)
      return msg.channel.send(t.translate('commands:create.noColor'));

      if (!isHexColor(color))
        return msg.channel.send(
          t.translate('commands:create.invalidColor', { colorInput: color })
        );
      if (!color.startsWith('#'))
        return msg.channel.send(t.translate('commands:create.noHex'));

      msg.guild?.roles
        .create({
          data: {
            name: roleName.replace("+"," "),
            color: color,
          },
          reason: 'Axel create command',
        })
        .catch(console.error);

      msg.channel.send(
        t.translate('commands:create.roleSuccess', {
          role: roleName.replace("+"," "),
          col: color,
        })
      );
    }
  }
}

export default create;
