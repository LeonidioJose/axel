import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import userModel from '../../database/models/users'

class AfkCommand extends core {
  constructor(client: Client) {
    super({
      name: 'afk',
      aliases: ['setafk', 'brb'],
      usage: 'commandsConfig:afk.usage',
      description: 'commandsConfig:afk.description',
      syntax: 'commandsConfig:afk.syntax',
      category: 'commandsConfig:afk.category',
    },client);
  }

  async run(msg: Message, args: Array<string>, t: any) {
    let reason = args.join(' ') || 'AFK'

    let verify = await userModel.model.findById(msg.author.id)
    if(verify) {
      //@ts-ignore
      verify.onAfk = true
      //@ts-ignore
      verify.afkReason = reason
      verify?.save()
    } else {
      new userModel.model({
        _id: msg.author.id,
        onAfk: true,
        afkReason: reason
      })?.save()
    }

    if (msg.guild?.me?.hasPermission('MANAGE_NICKNAMES')) {
      //@ts-ignore
      var er = null;

      msg.member
        ?.setNickname(`[AFK] ${msg.member.nickname || msg.author.username}`)
        .catch((err) => {
          er = err;
        })
        .then(() => {
          //@ts-ignore
          if (er == null) {
            return this.send(
              t.translate('commands:afk.sucess')
            )
          } else {
            return this.send(
              t.translate('commands:afk.err', { erro: er || "undefined"})
            )
          }
        });
    } else {
      this.send(
        t.translate('commands:afk.sucess')
      )
    }
  }
}

export default AfkCommand;
