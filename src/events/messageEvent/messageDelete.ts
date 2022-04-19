import core from '../../core/events';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';
import i19Axel from '../../../lib/i19Axel';
import { resolve } from 'path';
import guildModel from '../../database/models/guilds'
import moment from 'moment';

class messageDelete extends core {
  public client: Client;

  constructor(client: Client) {
    super({
      name: 'messageDelete',
    });

    this.client = client;
  }

  async run(msg: Message) {
    
    if (msg.author.bot) return;

    let guildLogs = await guildModel.model.findById(msg.guild?.id)
    if(!guildLogs) return
    if(!guildLogs.get("logsEvents")?.includes("messagedelete")) return;
    if(guildLogs.get("logsChannel") == 'None') return

    let lang = this.client.getGuildLang(String(msg.guild?.id))
    let momentDate 

    switch(lang) {
      case 'pt':
        momentDate = 'pt-br'
      break
      case 'en':
        momentDate = 'en-us'  
      break  
    }

    moment.locale(momentDate)

    let tApi = new i19Axel({
      preload: resolve(__dirname, `../../language/`),
      lang: lang,
    });

    let ms_

    if(guildLogs.get("logsType") == 'embed') {
    ms_ = new this.client.embed()
      .setAuthor(
        tApi.translate('events:messageDelete.author'),
        msg.guild?.iconURL({ dynamic: true })
      )
      .setDescription(
        tApi.translate('events:messageDelete.description', {
          member: msg.author,
        })
      )
      .setImage(
        msg.attachments ? msg.attachments.first()?.url : ""
      )
      .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: tApi.translate('events:messageDelete.channelField'),
          value: `${msg.channel} :: ${msg.channel.id}`,
        },
        {
          name: tApi.translate('events:messageDelete.contentField'),
          value: `${msg.content.length ? msg : tApi.translate("events:messageDelete.noContent")}`,
        },
        {
          name: tApi.translate('events:messageDelete.dateField'),
          value: tApi.translate('events:messageDelete.date', {
            DATE: moment(Date.now()).format('LL'),
          }),
        }
      );
    } else if(guildLogs.get("logsType") == 'text') {
       ms_ = `<:security:740311263518916689> \`[${moment(Date.now()).format("DD/MM/YYYY")}]\` - ${tApi.translate('events:messageDelete.author')} (${msg.author.tag})
${tApi.translate('events:messageDelete.channelField')}\u200b ${msg.channel} :: \`${msg.channel.id}\`
${tApi.translate('events:messageDelete.contentField')}\u200b ${msg.content.length ? msg.content.replace(/<@&[\d\w]{1,32}>|(@everyone)|<@[\w]{1,32}>|<@![\w]{1,32}>/g,'`{{AXEL BLOCK MENTION}}`') : tApi.translate("events:messageDelete.noContent")}
      `
    }

      let channel = this.client.channels.cache.get(
        guildLogs.get("logsChannel")
      )

      channel?.send(ms_)
      
  }
}

export default messageDelete;
