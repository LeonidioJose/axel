import { User } from 'discord.js';
import firebase from 'firebase';
import Client from '../Axel'
import Message from '../api/@types/Message'
type helpI = {
  name: string;
  aliases?: Array<any>;
  cooldown?: string;
  userPermissions?: Array<string>;
  botPermissions?: Array<string>;
  usage: string;
  description: string;
  syntax: string;
  category?: string;
};

type tApiType = {
  translate: (path: string, placeholders?: object) => {}
}

class Base {
  public help: helpI;
  public tType: any
  public client: Client
  public msg: any
  public args: Array<string | undefined>
  constructor(options: helpI, client: Client) {
    this.help = {
      name: options.name,
      aliases: options.aliases || [],
      cooldown: options.cooldown || '3s',
      userPermissions: options.userPermissions || [],
      botPermissions: options.botPermissions || [],
      usage: options.usage || 'Nenhum exemplo de uso',
      description: options.description || 'Nenhuma descrição definida',
      syntax: options.syntax || 'Nenhuma sintaxe de uso.',
      category: options.category || 'undefined',
    };

    this.tType = {
      translate: (path: string, placeholders?: object) => {}
    }

    this.client = client
    this.args = [""]
  }
  async setCooldown(user: User) {
    const db = firebase.database();

    db.ref(`Commands/Cooldown/${user.id}/${this.help.name}`).set({
      Timestamp: Date.now(),
    });
  }

  async helpEmbed(tApi: tApiType, msg: Message, client: Client) {

    const placeholders = {
      "<prefix>": await client.getPrefix(String(msg.guild?.id)),
      membro: `@${msg.guild?.members.cache.random().user.username}`,
      '<user1>': `@${msg.author.username}`,
      '<user2>': `@${msg.guild?.members.cache.random().user.username}`,
      randomUserID: msg.guild?.members.cache.random().id,
      channel: msg.guild?.channels.cache.filter((b) => b.type == 'text').random().id,
      member: `@${msg.guild?.members.cache.random().user.username}`
    }

     let embed = new client.embed()
     .setDescriptionFromBlockArray(
       [
         [
           tApi.translate("commands:global.helpDescription",{command: this.help.name,description: tApi.translate(this.help.description), syntax: tApi.translate(this.help.syntax)})
         ]
       ]
     )
     .addField(tApi.translate("commands:global.fields.examplesName"),`\`\`\`yaml\n${this.help.usage.split("\n").map((b) => tApi.translate(b,placeholders)).join('\n')}\`\`\``)
     .addField(
       tApi.translate("commands:global.fields.permissionsName"),
       //@ts-ignore
       `🙆 ▫️ ${msg.author.username} - ${ this.help.userPermissions?.length >= 1 ? this.help.userPermissions?.map((b) => `\`${tApi.translate("permissions:user."+b)}\``).join(', ') : tApi.translate("commands:global.noPerm")}` +
       "\n" +
       //@ts-ignore
       `<:AxelLogo:799007700196655135> ▫️ ${client.user?.username} - ${this.help.botPermissions?.length >= 1 ? this.help.botPermissions?.map((b) => `\`${tApi.translate("permissions:bot."+b)}\``).join(', ') : tApi.translate("commands:global.noPerm")}`
       )

       return embed
  }

  async sleep(time: number) {
    return new Promise((rs) => setTimeout(rs,time))
  }

   send(str: string| Array<Array<any>>, options?: {footer?: {str: string,url?: string},image?: string, thumbnail?: string, title?: string, author?: {url?: string, str: string}, fields?: Array<{name: string, value: string, inline?: Boolean}>}) {
    let embed = new this.client.embed()
    if(!Array.isArray(str)) {
    embed.setDescription(str)
    } else {
      embed.setDescriptionFromBlockArray(str)
    }
    embed.setTimestamp()

    if(options?.footer) embed.setFooter(options?.footer.str,options?.footer?.url || '')
    if(options?.image) embed.setImage(options?.image)
    if(options?.thumbnail) embed.setThumbnail(options?.thumbnail)
    if(options?.title) embed.setTitle(options?.title)
    if(options?.author) embed.setAuthor(options?.author.str, options?.author?.url || '')
    if(options?.fields) {
      for(let x of options?.fields) {
        embed.addField(x.name,x.value,x.inline)
      }
    }

    let c = this.msg.quote(embed)

    c.reactBox = async (author: User) => {
      let y = await c
      y.react("802521209899319296")
      y.react("802521817108971540")

      return new Promise((rs: any) => {
        y.createReactionCollector((r: any,user: any) => ["802521209899319296","802521817108971540"].includes(r.emoji.id) && user.id == author?.id).on('collect',(r2: any) => {
          switch(r2.emoji.id) {
            case '802521209899319296':
              rs(true)
            break
            case '802521817108971540':
              rs(false)
            break
          }
        })
      })
    }
    return c
  }

  s(msg: Message, args: Array<string | undefined>) {
    this.msg = msg
    this.args = args
  }
}

export default Base;
