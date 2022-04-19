import core from '../../core/events';
import Client from '../../Axel';
import { Guild } from 'discord.js';

class guildDelete extends core {
  public client: Client;
  constructor(client: Client) {
    super({
      name: 'guildDelete',
    });

    this.client = client;
  }

  async run(guild: Guild) {
    let emb = new this.client.embed()
      .setDescription('Fui removido em um servidor!\n\nInformações:')
      .addField('• Nome:', `\`${guild.name}\``)
      .addField('• ID:', `\`${guild.id}\``)
      .addField(
        '• Dono do servidor:',
        `\`${guild.owner?.user.username}\` - ${guild.owner?.user}`
      )
      .addField('• Quantidade de membros:', `\`${guild.members.cache.size}\``)
      .setThumbnail(guild.iconURL({ dynamic: true }));

    this.client.channels.cache.get('744673231793029290')?.send(emb);
  }
}

export default guildDelete;
