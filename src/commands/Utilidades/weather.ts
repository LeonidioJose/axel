import core from '@src/core/commands';
import Client from '@src/Axel';
import { Message, MessageAttachment } from 'discord.js';
import weather from 'weather-js';

import Images from '../../services/Images';

class Weather extends core {
  constructor(client: Client) {
    super({
      name: 'weather',
      aliases: [],
      cooldown: '10s',
      userPermissions: [],
      botPermissions: ["ATTACH_FILES"],
      syntax: 'commandsConfig:weather.syntax',
      description: 'commandsConfig:weather.description',
      usage: 'commandsConfig:weather.usage',
      category: 'commandsConfig:weather.category',
    },client);
  }

  async run(msg: Message, args: Array<string>, t: any) {
    const local = args.join(' ');

    if (!local) return msg.channel.send('Not found');

    weather.find(
      { search: local, degreeType: 'C' },
      async (error: Error, result: any) => {
        if (error) return msg.channel.send('Error');
        if (!result.length) return msg.channel.send('Result error');

        const {
          location: { name, alert },
          current: { temperature, humidity, windspeed },
        } = result[0];

        const img = await new Images().weather(
          windspeed,
          `${humidity}%`,
          `${temperature} Cº`,
          alert || t.translate('commands:weather.noAlert'),
          name,
          `${t.translate('commands:weather.windspeed')}`,
          `${t.translate('commands:weather.humidity')}`,
          `${t.translate('commands:weather.temperature')}`,
          `${t.translate('commands:weather.alert')}`
        );

        msg.channel.send(new MessageAttachment(img));
      }
    );
  }
}

export default Weather;
