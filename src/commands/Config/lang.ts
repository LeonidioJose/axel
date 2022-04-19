import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import firebase from 'firebase';
import guildModel from '../../database/models/guilds'

class lang extends core {
  constructor(client: Client) {
    super({
      name: 'lang',
      aliases: ['set-lang', 'guild-lang'],
      cooldown: '15s',
      userPermissions: ['MANAGE_GUILD'],
      botPermissions: [],
      description: 'commandsConfig:lang.description',
      syntax: 'commandsConfig:lang.syntax',
      usage: 'commandsConfig:lang.usage',
      category: 'commandsConfig:lang.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    let lang = args[0]?.toLowerCase();

    let user = await guildModel.model.findById(msg.guild?.id)

    let prefix = await this.client.getPrefix(String(msg.guild?.id))

    if (!lang) {
      return this.send(t.translate('commands:lang.noLang'))
    }

    if (!['pt', 'en'].includes(lang)) {
      return this.send(t.translate('commands:lang.args'))
    }

    let lang2 = this.client.langGuilds.get(String(msg.guild?.id));

    if (lang2 === lang) {
      return this.send(t.translate('commands:lang.hasDefault', { idioma: lang }))
    }

    if(user) {
      //@ts-ignore
      user.lang = lang
      user.save()
    } else {
      new guildModel.model({
        _id: msg.guild?.id,
        lang: lang
      }).save()
    }
    this.client.langGuilds.set(String(msg.guild?.id), lang);

    if (lang === 'pt') {
      //@ts-ignore
      return this.send(
        
        '<a:certo:737330776596807711> **»** <@' +
          msg.author.id +
          '> Agora o idioma padrão do servidor é `pt` - Português'
        
      );
    } else if (lang === 'en') {
      //@ts-ignore
      return this.send(
        `<a:certo:737330776596807711> **»** ${msg.author} Now the default language of the guild is \`en\` - English`
        
      );
    }
  }
}

export default lang;
