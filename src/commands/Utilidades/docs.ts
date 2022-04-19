import core from '@src/core/commands';
import Ax from '@src/Axel';
import { Message } from 'discord.js';
import axios from 'axios';
import AxelEmbed from '@src/services/AxelEmbed';

export default class Docs extends core {
  constructor(client: Ax) {
    super({
      name: 'docs',
      aliases: [],
      cooldown: '5s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:docs.syntax',
      description: 'commandsConfig:docs.description',
      usage: 'commandsConfig:docs.usage',
      category: 'commandsConfig:docs.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    let docsSearch = args.join('+');

    if (!docsSearch) return msg.channel.send('Search error');

    const { data } = await axios.get(
      `https://djsdocs.sorta.moe/v1/main/master/embed?q=${docsSearch}`
    );
    if (!data || data === undefined || !data.fields || !data.fields.length)
      return this.send('Nothing');


    this.send(
      [
        [`[Docs URL for ${docsSearch}](${data.url})`],
        [`**Properties:** \n\n ${data.fields[0].value}`],
        [`**Methods:** \n\n ${data.fields[1].value}`],
        [data.fields[2]?.value || "No one."],
      ],
      {
        thumbnail: data.author.icon_url,
        author: {
          str: data.author.name,
          url: data.author.icon_url
        }
      }
    )
  }
}
