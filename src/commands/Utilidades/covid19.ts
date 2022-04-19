import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';
import axios from 'axios';

import Images from '../../services/Images';

class covid19 extends core {
  constructor(client: Client) {
    super({
      name: 'covid19',
      aliases: ['covid'],
      cooldown: '10s',
      userPermissions: [],
      botPermissions: ["ATTACH_FILES"],
      syntax: 'commandsConfig:covid19.syntax',
      description: 'commandsConfig:covid19.description',
      usage: 'commandsConfig:covid19.usage',
      category: 'commandsConfig:covid19.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    try {
      const country = args.join(' ');

      if (!country) {
        const { data } = await axios.get('https://corona.lmao.ninja/v2/all');

        const img = await new Images().covid19(
          data.cases,
          data.deaths,
          data.recovered,
          false,
          this.client,
          msg.guild,
          t.translate('commands:covid19.cases'),
          t.translate('commands:covid19.deaths'),
          t.translate('commands:covid19.recovered'),
          t.translate('commands:covid19.phrase', {
            local:
              country.toUpperCase() || t.translate('commands:covid19.world'),
          })
        );

        msg.channel.send(new MessageAttachment(img));
      } else {
        let data;

        try {
          const { data: d } = await axios.get(
            'https://corona.lmao.ninja/v2/countries/' + country
          );

          data = d;
        } catch (err) {
          this.client.logger.error(err);
        }

        if (data.cases === undefined)
          return msg.channel.send('No content found');

        const img = await new Images().covid19(
          data.cases,
          data.deaths,
          data.recovered,
          { name: data.countryInfo.iso3, flag: data.countryInfo.flag },
          this.client,
          msg.guild,
          t.translate('commands:covid19.cases'),
          t.translate('commands:covid19.deaths'),
          t.translate('commands:covid19.recovered'),
          t.translate('commands:covid19.phrase', {
            local:
              country.toUpperCase() || t.translate('commands:covid19.world'),
          })
        );

        msg.channel.send(new MessageAttachment(img));
      }
    } catch (err) {
      this.client.logger.error(err);
      msg.channel.send(t.translate('commands:covid19.error'));
    }
  }
}

export default covid19;
