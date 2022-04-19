import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';

class ping extends core {
  constructor(client: Client) {
    super({
      name: 'ping',
      aliases: ['latência', 'latencia', 'cluster'],
      cooldown: '3s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:ping.syntax',
      description: 'commandsConfig:ping.description',
      usage: 'commandsConfig:ping.usage',
      category: 'commandsConfig:ping.category',
    },client);

  }

  async run(msg: Message, args: any[], t: any) {
    //@ts-ignore
    let send = await this.send(
      [[t.translate('commands:ping.calculando')]]
      );

    let cpu = send.createdTimestamp - msg.createdTimestamp;

    let pingEmb = new this.client.embed(msg.author)
      .setTitle(`<:online:750456739538796674> Cluster ${msg.guild?.shardID}`)
      .setDescription(
        t.translate('commands:ping.clientPing', { ping: this.client.ws.ping }) +
          `\n\n` +
          t.translate('commands:ping.discordPing', { ping: cpu })
      )
      .setThumbnail(this.client.user?.displayAvatarURL({ dynamic: true }));

    send.edit({embed: pingEmb});
  }
}

export default ping;
