import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageEmbed } from 'discord.js';
import os from 'os';

class botinfo extends core {
  constructor(client: Client) {
    super({
      name: 'botinfo',
      aliases: ['binfo', 'bi'],
      cooldown: '3s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:botinfo.syntax',
      description: 'commandsConfig:botinfo.description',
      usage: 'commandsConfig:botinfo.usage',
      category: 'commandsConfig:botinfo.category',
    },client);
  }

  async run(msg: Message, args: any[], t: any) {
    let loadEmbed = new this.client.embed().setDescription(
      t.translate('commands:botinfo.loading')
    );

    const cpuState = require('cpu-stat');

    let Client = this.client;
    let z = this

    cpuState.usagePercent(async function (
      err: Error,
      percent: any,
      seconds: number
    ) {
      if (err) {
        throw new Error(String(err));
      }

      let embed = new MessageEmbed()
        .addFields(
          {
            name: t.translate('commands:botinfo.devsFieldName'),
            value: '<@360834865639325697>, <@682203061606678534>',
          },
          {
            name: t.translate('commands:botinfo.specialThanksFieldName'),
            value: t.translate('commands:botinfo.specialThanksFieldValue', {
              user: msg.author.username,
            }),
          },
          {
            name: t.translate('commands:botinfo.statisticsFieldName'),
            value: `${t.translate(
              'commands:botinfo.statisticsFieldValue.guilds',
              { guildsSize: Client.guilds.cache.size }
            )} ${t.translate('commands:botinfo.statisticsFieldValue.users', {
              usersSize: Client.users.cache.size,
            })} ${t.translate(
              'commands:botinfo.statisticsFieldValue.channels',
              { channelsSize: Client.channels.cache.size }
            )}`,
            inline: true,
          },
          {
            name: t.translate('commands:botinfo.informationFieldName'),
            value: `${t.translate(
              'commands:botinfo.informationFieldValue.language'
            )} ${t.translate(
              'commands:botinfo.informationFieldValue.runtime'
            )} ${t.translate(
              'commands:botinfo.informationFieldValue.database'
            )} ${t.translate('commands:botinfo.informationFieldValue.host')}`,
            inline: true,
          },
          {
            name: t.translate('commands:botinfo.cpuModelFieldName'),
            value: `${os.cpus().map((i) => `${i.model}`)[0]}`,
          },
          {
            name: t.translate('commands:botinfo.cpuUseFieldName'),
            value: `${percent.toFixed(2)}%`,
          },
          {
            name: t.translate('commands:botinfo.cpuMemoryFieldName'),
            value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
              2
            )} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
          }
        )
        .setColor(require('../../util/colours.json').main)
        .setFooter(t.translate('commands:botinfo.footer'));

      //@ts-ignore
      z.send(t.translate('commands:botinfo.loading')).then((_module) => {
        setTimeout(() => {
          _module.edit(embed);
        }, 5000);
      });
    });
  }
}

export default botinfo;
