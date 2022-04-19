import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';

class banList extends core {
  constructor(client: Client) {
    super({
      name: 'ban-list',
      aliases: ['banlist'],
      userPermissions: ['BAN_MEMBERS'],
      botPermissions: [],
      syntax: 'commandsConfig:ban-list.syntax',
      usage: 'commandsConfig:ban-list.usage',
      description: 'commandsConfig:ban-list.description',
      category: 'commandsConfig:ban-list.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    msg.guild?.fetchBans().then((bannedList) => {
      let actualPage = 1;

      let pages = new this.client.Collection();

      let bannedMembers = null;

      //@ts-ignore
      bannedList.map((user) => pages.add(`${user.user.tag} - ${user.user.id}`));
      let page = Math.ceil(pages.length() / 30);

      let pagineted = pages.paginate(actualPage, 30);
      if (pages.length() === 0)
        bannedMembers = t.translate('commands:ban-list.noMembers');
      else bannedMembers = pagineted;

      let embed = new this.client.embed()
        .setTitle('<:Moderation:738074557063364678> Ban-List')
        .setDescription(
          `**${t.translate('commands:ban-list.howMuch', {
            qtd: pages.length(),
          })}**\n\`\`\`yaml\n ${
            Array.isArray(bannedMembers)
              ? bannedMembers.join(' \n ')
              : bannedMembers
          }\`\`\``
        )
        .setThumbnail(msg.guild?.iconURL({ dynamic: true, format: 'png' }));

      msg.channel.send(msg.author, embed).then((message) => {
        if (page <= 1) return;

        if (page >= 2) {
          message.react('⏩');

          const collector = message.createReactionCollector(
            (r, u) =>
              ['⏪', '⏩'].includes(r.emoji.name) && u.id === msg.author.id
          );

          collector.on('collect', async (r2) => {
            switch (r2.emoji.name) {
              case '⏩':
                if (message.guild?.me?.hasPermission('MANAGE_MESSAGES'))
                  r2.users.remove(msg.author.id);

                if (actualPage === page) return;

                actualPage++;
                pagineted = pages.paginate(actualPage, 30);

                embed.setDescription(
                  `**${t.translate('commands:ban-list.howMuch', {
                    qtd: pages.length(),
                  })}**\n\`\`\`yaml\n ${pagineted.join('\n')}\`\`\``
                );

                await message.edit(embed);
                await message.react('⏪');

                if (
                  actualPage === page &&
                  msg.guild?.me?.hasPermission('MANAGE_MESSAGES')
                )
                  r2.remove();
                if (
                  actualPage === page &&
                  !msg.guild?.me?.hasPermission('MANAGE_MESSAGES')
                )
                  r2.users.remove(this.client.user?.id);

                break;
              case '⏪':
                if (message.guild?.me?.hasPermission('MANAGE_MESSAGES'))
                  r2.users.remove(msg.author.id);

                if (actualPage === 1) return;

                actualPage--;
                pagineted = pages.paginate(actualPage, 30);

                if (actualPage === page) return;
                embed.setDescription(
                  `**${t.translate('commands:ban-list.howMuch', {
                    qtd: pages.length(),
                  })}**\n\`\`\`yaml\n ${pagineted.join('\n')}\`\`\``
                );

                await message.edit(embed);
                await message.react('⏪');

                if (
                  actualPage === page &&
                  msg.guild?.me?.hasPermission('MANAGE_MESSAGES')
                )
                  r2.remove();
                if (
                  actualPage === page &&
                  !msg.guild?.me?.hasPermission('MANAGE_MESSAGES')
                )
                  r2.users.remove(this.client.user?.id);

                message.react('⏩');

                break;
            }
          });
        }
      });
    });
  }
}

export default banList;
