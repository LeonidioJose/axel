import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageEmbed } from 'discord.js';

class uptime extends core {
  constructor(client: Client) {
    super({
      name: 'uptime',
      aliases: ['ontime'],
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:uptime.syntax',
      description: 'commandsConfig:uptime.description',
      usage: 'commandsConfig:uptime.usage',
      category: 'commandsConfig:uptime.category',
    },client);
  }

  async run(msg: Message, args: any[], t: any) {
    let dias = 0;
    let semanas = 0;

    let uptimeNice = this.client.uptime || 0;

    let uptime = ``;
    let totalSegundos = uptimeNice / 1000;
    let horas = Math.floor(totalSegundos / 3600);
    totalSegundos %= 3600;
    let minutos = Math.floor(totalSegundos / 60);
    let segundos = Math.floor(totalSegundos % 60);

    if (horas > 23) {
      dias = dias + 1;
      horas = 0;
    }
    if (dias == 7) {
      dias = 0;
      semanas = semanas + 1;
    }
    if (semanas > 0) {
      uptime += t.translate('commands:uptime.weeks', { weeks: semanas });
    }
    if (minutos > 60) {
      minutos = 0;
    }

    uptime += dias + 'd ' + horas + 'h ' + minutos + 'm ' + segundos + 's ';

    this.send(
      t.translate('commands:uptime.message', { ontime: uptime })
    )
  }
}

export default uptime;
