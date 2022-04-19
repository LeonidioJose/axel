import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';

import Images from '../../services/Images';
import GenerateChars from '../../functions/GenerateChars';

class gift extends core {
  constructor(client: Client) {
    super({
      name: 'gift',
      aliases: [],
      cooldown: '10s',
      description: 'commandsConfig:gift.description',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:gift.syntax',
      usage: 'commandsConfig:gift.usage',
      category: 'undefined',
    },client);
  }

  async run(msg: Message, args: Array<string>, t: any) {
    if (!this.client.owners.includes(msg.author.id))
      return msg.channel.send(t.translate('commands:devOnly'));

    const giftCode = GenerateChars(10).toUpperCase();
    const giftBackground = await new Images().gift(
      giftCode,
      t.translate('commands:gift.giftTitle')
    );

    await msg.channel.send(new MessageAttachment(giftBackground));

    const collector = msg.channel
      .createMessageCollector((x) => x, { time: 20000, max: 1 })
      .on('collect', async (response) => {
        if (response.content === giftCode) {
          collector.stop();

          return msg.channel.send('Código certo');
        } else {
          collector.stop();

          return msg.channel.send('Código errado');
        }
      })

      .on('end', async (response) => {
        if (collector.endReason() === 'limit') return;

        return msg.channel.send('Finalizado');
      });
  }
}

export default gift;
