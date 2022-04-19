import core from '../../core/events';
import Client from '../../Axel';
import { Guild } from 'discord.js';

class guildCreate extends core {
  public client: Client;
  constructor(client: Client) {
    super({
      name: 'guildCreate',
    });

    this.client = client;
  }

  async run(guild: Guild) {
    if (!this.client.langGuilds.get(String(guild.id))) {
      this.client.langGuilds.set(String(guild.id), 'pt');
    }

    let emb = new this.client.embed()
      .setDescription('Fui adicionado em um novo servidor!\n\nInformações:')
      .addField('• Nome:', `\`${guild.name}\``)
      .addField('• ID:', `\`${guild.id}\``)
      .addField(
        '• Dono do servidor:',
        `\`${guild.owner?.user.username}\` - ${guild.owner?.user}`
      )
      .addField('• Quantidade de membros:', `\`${guild.members.cache.size}\``)
      .setThumbnail(guild.iconURL({ dynamic: true }));

    //@ts-ignore
    this.client.channels.cache.get('744673231793029290')?.send(emb);
  }
}

export default guildCreate;
