import core from '@src/core/commands';
import Ax from '@src/Axel';
import { Message } from 'discord.js';
import AxelEmbed from '@src/services/AxelEmbed';
import ms from 'pretty-ms';
import strD from '../../functions/deleteFromString'

export default class Lockdown extends core {
  constructor(client: Ax) {
    super({
      name: 'lockdown',
      aliases: [],
      userPermissions: ['ADMINISTRATOR'],
      botPermissions: ['ADMINISTRATOR'],
      description: 'commandsConfig:lockdown.description',
      usage: 'commandsConfig:lockdown.usage',
      syntax: 'commandsConfig:lockdown.syntax',
      //category: 'commandsConfig:lockdown.category',
    },client);
  }

  async run(msg: Message, args: Array<string> | string[], t: any) {
    let $guildChannels = msg.guild?.channels.cache.filter((ch) =>
      Boolean(ch.id)
    );

    let $everyoneRole = msg.guild?.roles.cache.find(a => a.name === 'everyone')

    if (args[0] === 'on' || args[0] === 'ligar') {
      let $embedToConfirm = new AxelEmbed(
        msg.author
      ).setDescriptionFromBlockArray([
        [
          
          `Are you sure to turn on the **lockdown** mode? It can last ${ms(
            //@ts-ignore
            Number(msg.guild?.channels.cache.size * 350)
          )}`,
        ],
      ]);

      msg.channel.send($embedToConfirm).then(($embed) => {
        $embed.react('740316818664587325');
        $embed.react('740313235634520094')

        const $embedReactionCollector = $embed.createReactionCollector(
          (r, u) =>
            (r.emoji.id === '740316818664587325', '740313235634520094') &&
            u.id !== this.client.user.id &&
            u.id === msg.author.id,
          { max: 1 }
        );

        $embedReactionCollector.on('collect', (r) => {
          switch (r.emoji.id) {
            case '740316818664587325':
              $embed.reactions.removeAll();

              let $channelsReaction = 0;

              $guildChannels?.forEach(($channel) => {
                setTimeout(() => {
                  $channelsReaction++;
                  $channel.setName(`🔒-${$channel.name}`);

                  //@ts-ignore
                  $channel.createOverwrite(msg.guild?.roles.everyone, {
                    SEND_MESSAGES: false,
                  });
                }, 3500);
              });

              let $inter = setInterval(() => {
                //@ts-ignore
                if ($channelsReaction >= msg.guild?.channels.cache.size) {
                  clearInterval($inter);
                  msg.channel.send('Success');
                }
              }, 1500);

              $embedReactionCollector.stop();
              break;

            case '740313235634520094':
              $embedReactionCollector.stop();

              msg.channel.send('Cancel');
              break;
          }
        });
      });
    }

    if (args[0] === 'off' || args[0] === 'desligar') {
      let $embedToConfirm = new AxelEmbed(
        msg.author
      ).setDescriptionFromBlockArray([
        [
          `Are you sure to turn off the **lockdown** mode? It can last ${ms(
            //@ts-ignore
            Number(msg.guild?.channels.cache.size * 350)
          )}`,
        ],
      ]);

      msg.channel.send($embedToConfirm).then(($embed) => {
        $embed.react('740316818664587325');
        $embed.react('740313235634520094');

        const $embedReactionCollector = $embed.createReactionCollector(
          (r, u) =>
            (r.emoji.id === '740316818664587325', '740313235634520094') &&
            u.id !== this.client.user.id &&
            u.id === msg.author.id,
          { max: 1 }
        );

        $embedReactionCollector.on('collect', (r) => {
          switch (r.emoji.id) {
            case '740316818664587325':
              $embed.reactions.removeAll();

              let $channelsReaction = 0;

              $guildChannels?.forEach(($channel) => {
                setTimeout(() => {
                  $channelsReaction++;
                 $channel.setName(String(strD(["🔒-"],$channel.name)))

                 //@ts-ignore
                  $channel.updateOverwrite(msg.guild?.roles.everyone, {
                    SEND_MESSAGES: true,
                  });
                });
              });

              let $inter = setInterval(() => {
                //@ts-ignore
                if ($channelsReaction >= msg.guild?.channels.cache.size) {
                  clearInterval($inter);
                  msg.channel.send('Success');
                }
              }, 1500);

              $embedReactionCollector.stop();
              break;

            case '740313235634520094':
              $embedReactionCollector.stop();

              msg.channel.send('Cancel');
              break;
          }
        }); 
      });
    }
  }
}
