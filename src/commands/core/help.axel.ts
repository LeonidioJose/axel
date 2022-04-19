import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import similar from 'string-similarity'

export default class helpAX extends core {
  constructor(client: Client) {
    super({
      name: 'help',
      usage: 'commandsConfig:help.usage',
      category: 'undefined',
      syntax: 'commandsConfig:help.syntax',
      description: 'commandsConfig:help.description',
      aliases: ['cmds', 'commands', 'comandos', 'ajuda'],
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    let commands = new Map();
    let aliases = new Map();

    this.client.commands.forEach(async (value: any, key: string) => {
      let cmd = this.client.commands.get(key);
      if (cmd.help.category !== 'undefined') {
        commands.set(key, cmd);
        for (let x of cmd.help.aliases) {
          aliases.set(x, key);
        }
      }
    });

    let check = commands.get(args[0]) || commands.get(aliases.get(args[0]));

    if (args[0] && check) {
      let aliases = check.help.aliases.length
        ? check.help.aliases.join(' | ')
        : t.translate('commands:help.aliases.no');

      let prefix = await this.client.getPrefix(String(msg.guild?.id));

      let emb = new this.client.embed()
        .setTitle(t.translate('commands:help.commandEmbed.title'))
        .setDescriptionFromBlockArray([
          [
            t.translate('commands:help.commandEmbed.description.name', {
              name: check.help.name,
            }),
            t.translate('commands:help.commandEmbed.description.aliases', {
              aliases,
            }),
          ],
          [
            t.translate('commands:help.commandEmbed.description.desc', {
              desc: t.translate(check.help.description),
            }),
          ],
          [
            t.translate('commands:help.commandEmbed.description.syntax', {
              syntax: t.translate(check.help.syntax),
            }),
          ],
          [
            t.translate('commands:help.commandEmbed.description.usage', {
              usage: t.translate(check.help.usage, {
                '<prefix>': prefix,
                membro: `@${msg.guild?.members.cache.random().user.username}`,
                '<user1>': `@${msg.author.username}`,
                '<user2>': `@${
                  msg.guild?.members.cache.random().user.username
                }`,
                randomUserID: msg.guild?.members.cache.random().id,
                channel: msg.guild?.channels.cache.filter((a) => a.type == 'text').random().name
              }),
            }),
          ],
          [
            t.translate('commands:help.commandEmbed.description.category', {
              category: t.translate(check.help.category),
            }),
            t.translate('commands:help.commandEmbed.description.cooldown', {
              time: check.help.cooldown,
            }),
          ],
        ])
        .setThumbnail(this.client.user?.displayAvatarURL());

      //@ts-ignore
      return msg.quote(emb);
    }

    if(args[0] && !check) {

      let cmdThink = similar.findBestMatch(args[0],this.client.commandsArray).bestMatch.target
       // @ts-ignore
       return msg.quote(
         new this.client.embed()
          .setDescriptionFromBlockArray([[t.translate("commands:help.noCommandFound",{
            command: args[0],
            commandThink: cmdThink
          })]])
       )
    }

    let commandsObj = {};

    commands.forEach((value: any, key: string) => {
      let cmd = this.client.commands.get(key);

      console.log(cmd.help.name)
      let category = t.translate(String(cmd.help.category));

      if (!Object.keys(commandsObj).includes(category)) {
        //@ts-ignore
        commandsObj[String(category)] = [cmd.help.name];
      } else {
        //@ts-ignore
        commandsObj[String(category)].push(cmd.help.name);
      }
    });

    let mainEmb = new this.client.embed()
      .setTitle(t.translate('commands:help.mainEmbed.title'))
      .setDescriptionFromBlockArray([
        [
          t.translate('commands:help.mainEmbed.description', {
            user: msg.author,
            commandsSize: commands.size,
          }),
        ],
      ])
      .setThumbnail(msg.guild?.iconURL({ dynamic: true }));
    for (let x in commandsObj) {
      //@ts-ignore
      let em = require('../../util/data/category.ts').default[
        //@ts-ignore
        this.client.getCategoryID(x)
      ];

      //@ts-ignore
      mainEmb.addField(
        //@ts-ignore
        `${em} ${x} [${commandsObj[x].length}]`,
        //@ts-ignore
        `\`${commandsObj[x].join(' | ')}\``
      );
    }

    //@ts-ignore
    msg.quote(mainEmb);
  }
}
