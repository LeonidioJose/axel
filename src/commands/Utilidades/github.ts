import core from '@src/core/commands';
import Client from '@src/Axel';
import { Message } from 'discord.js';
import axios from 'axios';
import AxelEmbed from '@src/services/AxelEmbed';

class Github extends core {
  constructor(client: Client) {
    super({
      name: 'github',
      aliases: [],
      cooldown: '5s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:github.syntax',
      description: 'commandsConfig:github.description',
      usage: 'commandsConfig:github.usage',
      category: 'commandsConfig:github.category',
    },client);
  }

  async run(msg: Message, args: Array<string>, t: any) {
    try {
      const githubAccount = args.join(' ');

      if (!githubAccount) return msg.channel.send('Nenhuma conta informada!');

      let data;

      try {
        const { data: d } = await axios.get(
          `https://api.github.com/users/${githubAccount}`
        );

        data = d;
      } catch (err) {
        this.client.logger.error(err);
      }

     this.send(
      [
        [`Name: ${data.name}`],
        [`Description: \n`, data.bio || 'No description'],
        [`[URL](${data.html_url})`],
        [`ID: ${data.id}`],
      ],
      {
        thumbnail: data.avatar_url,
        author: {
          str: data.login,
          url: data.avatar_url
        }
      }
     )
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

export default Github;
