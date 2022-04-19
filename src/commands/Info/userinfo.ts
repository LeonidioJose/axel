import core from '../../core/commands';
import Client from '../../Axel';
import { Guild, Message, MessageEmbed, User } from 'discord.js';
import moment from 'moment'
import category from '../../util/data/category';

type options = {
    userId: string,
    tApi: {translate: (path: string, placesHolders?: any) => {}},
    guild: Guild,
    message: Message 
}

export default class userinfo extends core {
  constructor(client: Client) {
    super({
      name: 'userinfo',
      usage: 'commandsConfig:userinfo.usage',
      description: 'commandsConfig:userinfo.description',
      syntax: 'commandsConfig:userinfo.syntax',
      aliases: ["infouser","user"],
      category: "commandsConfig:userinfo.category"
    },client);
  }
  async run(msg: Message, args: string[] | any[], t: any) {
    let user = msg.mentions.users.first() || this.client.users.cache.get(args[0]) || args[0]
    //@ts-ignore

    if(user instanceof User && !msg.guild?.members.cache.get(user?.id)) user = msg.author

    if(user == args[0]) {
        let users = msg.guild?.members.cache.filter((guildMember) => guildMember.user.username.toLowerCase().includes(user?.toLowerCase())).array()

        if(users?.length == 1) {
            let userId = users[0].id

            //@ts-ignore
            let embed = this.showEmbed({userId, tApi: t, guild: msg?.guild})

            return msg.channel.send(embed)
            //@ts-ignore
        } else if(users?.length > 1){
            let usersMap = users?.map((b) => `${b.user.tag}`)

            let str = ""

            //@ts-ignore
            if(usersMap?.length > 15) str = "and " + usersMap?.length - 15 + " more"
            usersMap?.slice(0,14)

            return this.send([[t.translate("commands:userinfo.includes",{map: usersMap?.join("\n"), length: usersMap?.length, str, arg: args[0]})]])
        } else if(users?.length == 0) {
            //@ts-ignore
            let embed = this.showEmbed({userId: msg.author.id, tApi: t, guild: msg?.guild})

            return msg.channel.send(embed)
        }
    } else if(user && user instanceof User) {
        let embed = this.showEmbed({
            userId: user?.id,
            tApi: t,
            //@ts-ignore
            guild: msg.guild,
            message: msg
        })

        return msg.channel.send(embed)
    
    }

    //@ts-ignore

    let embed = this.showEmbed({userId: msg.author.id, tApi: t, guild: msg?.guild})

    msg.channel.send(embed)

  }

  showEmbed(options: options) {
    let user = this.client.users.cache.get(options.userId)

    let statusObj = {
        dnd: "<:dnd:748938791464730745>",
        idle: "<:idle:753046728063713361>",
        online: "<:online:753046901690990652>",
        offline: "<:offline:753047023959146637>"
    }

    const flags = {
        DISCORD_EMPLOYEE: "EMPLOYEE",
        DISCORD_PARTNER: "<:partner:753048111718465636>",
        HYPESQUAD_EVENTS: "<:events:753048367197585529>",
        BUGHUNTER_LEVEL_1: "<:bug1:753048577063911536>",
        HOUSE_BRAVERY: "<:brav:753048780198379540>",
        HOUSE_BRILLIANCE: "<:bri:753048699185397880>",
        HOUSE_BALANCE: "<:bal:753048919205871617>",
        EARLY_SUPPORTER: "<:suport:753049242419069009>",
        TEAM_USER: "<:staff:753049421654130709>",
        SYSTEM: "SYESTEM",
        BUGHUNTER_LEVEL_2: "<:bug2:753048496575086633>",
        VERIFIED_BOT: "<:verify:753049579301240912>",
        VERIFIED_DEVELOPER: "<:devs:743904472211914858>"
      }

      let userFlags = this.client.users.cache.get(options.userId)?.flags?.toArray()

      //@ts-ignore
      let mapFlags = userFlags?.length >= 1 ? userFlags?.map((e) => flags[e]).join(' ') : options.tApi.translate("commands:userinfo.noFlags")

      let timestamp = this.client.getGuildLang(String(options.guild?.id)) == 'pt' ? 'pt-br' : 'en-us'
      moment.locale(timestamp)

      let date = moment(this.client.users.cache.get(options.userId)?.createdAt).format("LL")
      let time = moment(options.guild?.members.cache.get(options.userId)?.joinedAt).format("LL")

      let orderMap = options.guild?.members.cache.sort((a: any, b: any) => a.joinedAt - b.joinedAt).map((b) => b.id)

      let getUser = (u : string) => this.client.users.cache.get(u)

      let order = orderMap?.indexOf(String(user?.id))
      let number = Number(order) - 3
      let sliced = orderMap?.slice(number < 0 ? 0 : number, order+ 3).map((b) => `${getUser(b)?.id == user?.id ? "**"+getUser(b)?.username+"**" : getUser(b)?.username} >`).join(" ")

      let data 
      //@ts-ignore
      let orderString = orderMap.length == 1 ? data  = [`\`${user?.username}\``] : data = sliced.split(">")

      data.push("🤷‍♂️")
      data = data.filter((rs) =>  rs.trim() != '')

      let compServ = this.client.guilds.cache.filter((b) => b.members.cache.has(options.userId) && b.id != options.guild.id).map((c) => `\`${c.name}\``)
      let str = ""

      if(compServ.length > 6) str = `and ${compServ.length - 6} more`
      compServ.slice(0,5)
      
      let embed = new MessageEmbed()
      //@ts-ignore
      .setTitle(`${statusObj[this.client.users.cache.get(options.userId)?.presence.status]} ${this.client.users.cache.get(options.userId)?.tag} : ${options.userId}`)
      .setDescription(mapFlags)
      .addField(options.tApi.translate("commands:userinfo.fields.createdAccount"),date,true)
     .addField(options.tApi.translate("commands:userinfo.fields.joined"),time,true)
     .addField(options.tApi.translate("commands:userinfo.fields.joinOrder"),data.join(">"))
     .setThumbnail(String(user?.displayAvatarURL({dynamic: true})))
     .setColor("#4a9ecf")
      .addField("🎮 Presence:",user?.presence.activities.length ? user.presence.activities.join(', ') : options.tApi.translate("commands:userinfo.noPr"))
      .addField(options.tApi.translate("commands:userinfo.fields.sharedServ"),`${compServ.length >= 1 ?  compServ.join(", ") : options.tApi.translate("commands:userinfo.noServ")}`)

      return embed
  }
}
