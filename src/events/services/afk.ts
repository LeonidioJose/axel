import { Message } from 'discord.js';
import Client from '../../Axel';
import core from '../../core/events';
import tAPI from '../../../lib/i19Axel';
import { resolve } from 'path';
import deleteStr from '../../functions/deleteFromString';
import userM from '../../database/models/users'

class afk extends core {
  private client: Client;
  constructor(client: Client) {
    super({
      name: 'message',
    });

    this.client = client;
  }

  async run(msg: Message) {
    
    if (msg.author.bot) return;

    let t = new tAPI({
      preload: resolve(__dirname, '../../language'),
      lang: this.client.getGuildLang(String(msg.guild?.id)),
    });

    let checkAuthor = await userM.model.findById(msg.author.id)
    //@ts-ignore
    if (checkAuthor?.onAfk) {
      //@ts-ignore
      checkAuthor?.onAfk = false
      checkAuthor?.save()

      let backEmb = new this.client.embed().setDescription(
        t.translate('events:services.afk.back')
      );
      //@ts-ignore
      msg.member?.setNickname(msg.member.nickname?.replace('[AFK]', ''));
      //@ts-ignore

      return msg.quote(backEmb);
    }

    let user = msg.mentions.users.first();
    let checkUser = await userM.model.findById(user?.id)


    //@ts-ignore
    if (checkUser?.onAfk) {
      //@ts-ignore
      let reason = checkUser?.afkReason || "AFK"

      let heAFK = new this.client.embed().setDescription(
        t.translate('events:services.afk.heAfk', { reason: reason })
      );

      //@ts-ignore

      msg.quote(heAFK);
    }
    
  }
}

export default afk;
