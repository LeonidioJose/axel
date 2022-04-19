import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import searchNpmRegistry from 'search-npm-registry';
import AxelEmbed from '../../services/AxelEmbed';

class Npm extends core {
  constructor(client: Client) {
    super({
      name: 'npm',
      aliases: [],
      cooldown: '5s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:npm.syntax',
      description: 'commandsConfig:npm.description',
      usage: 'commandsConfig:npm.usage',
      category: 'commandsConfig:npm.category',
    },client);
  }

  async run(msg: Message, args: Array<string>, t: any) {
    let search = args.join(' ');

    if (!search) return msg.channel.send(t.translate('commands:npm.noSearch'));

    const [npm] = await searchNpmRegistry().text(search).size(5).search();

    if (npm === undefined)
      return msg.channel.send(t.translate('commands:npm.noExist'));

    let embed = new AxelEmbed(msg.author)
      .setThumbnail(
        'https://raw.githubusercontent.com/npm/logos/master/npm%20logo/npm-logo-red.png'
      )
      .addField(
        t.translate('commands:npm.description'),
        npm.description
          ? npm.description
          : t.translate('commands:npm.noDescription')
      )
      .setTitle(npm.name)
      .setDescriptionFromBlockArray([
        [
          npm.keywords && npm.keywords.length > 0
            ? `${t.translate('commands:npm.keywords')} ` +
              npm.keywords.map((words: any) => `**${words}**`).join(' | ')
            : `${t.translate('commands:npm.noKeywords')}`,
          `${t.translate('commands:npm.version')} ${npm.version}`,
        ],
        [
          `${t.translate('commands:npm.author')} ${npm.author.name} (${
            npm.author.username || t.translate('commands:npm.noUsername')
          })`,
          `${t.translate('commands:npm.publisher')} ${npm.publisher.username}`,
        ],
        [
          `[${t.translate('commands:npm.npmPage')}](${npm.links.npm}) \n ${
            npm.links.repository
              ? `[${t.translate('commands:npm.githubPage')}](${
                  npm.links.repository
                })`
              : ''
          }`,
        ],
      ]);

    //@ts-ignore
    msg.quote(embed);
  }
}

export default Npm;
