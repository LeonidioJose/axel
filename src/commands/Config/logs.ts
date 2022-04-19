import core from '../../core/commands';
import Client from '../../Axel';
import { CategoryChannel, CollectorFilter, GuildMember, Message, MessageReaction, ReactionCollector, TextChannel, VoiceChannel } from 'discord.js';
import logsEvents from '../../util/data/eventsLogs'
import guildModel from '../../database/models/guilds'

export default class logs extends core {
  constructor(client: Client) {
    super({
      name: 'logs',
      usage: 'commandsConfig:logs.usage',
      description: 'commandsConfig:logs.description',
      syntax: 'commandsConfig:logs.syntax',
      aliases: ["setlogs"],
      userPermissions: ["MANAGE_GUILD"],
      category: "commandsConfig:logs.category"
    },client);
  }
  async run(msg: Message, args: string[] | any[], t: any) {
    let arrayOfEvents =  logsEvents.array

    //@ts-ignore

    let map = arrayOfEvents.map(a => `\`${a.toString()}\` ・ **${logsEvents.object[a.toString()]}**`).join("\n")
    let _ = await guildModel.model.findById(msg.guild?.id)


    if(["set"].includes(args[0]?.toLowerCase())) {
        let channel = this.client.channels.cache.get(
            args[1]
            ?.replace(/<|#|>/g,"")
        ) ||
        //@ts-ignore
        this.client.channels.cache.find((a: TextChannel) => a.name == args.slice(1).join(" ")) as TextChannel

        if(!channel) {
            return (
                this.send(t.translate("commands:logs.noChannel"))
            )
        }

        if(channel && (channel instanceof VoiceChannel || channel instanceof CategoryChannel)) {
            return (
                this.send(t.translate("commands:logs.typeChannel"))
            )
        }

        //@ts-ignore
        if(!channel.permissionsFor(msg.guild?.me?.id).has("SEND_MESSAGES")) {
            return (
                //@ts-ignore
                this.send(t.translate("commands:logs.noPerm",{channel: channel?.name}))
            )
        }

        if((await guildModel.model.findById(msg.guild?.id))) {
            //@ts-ignore
            _.logsChannel = channel.id
            _?.save()
        } else {
            new guildModel.model({
                _id: msg.guild?.id,
                logsChannel: channel.id
            }).save()
        }

        this.send(
            //@ts-ignore
            t.translate("commands:logs.channelSet",{channelName: channel?.name,prefix: await this.client.getPrefix(msg.guild?.id)})
        ).then((message: Message) => {
            message.react("🔑")

            message.createReactionCollector((r: MessageReaction, u: GuildMember) => r.emoji.name == "🔑"  && u.id == msg.author.id,{max: 1})
            .on('collect',async (r2: ReactionCollector) => {

                if((await guildModel.model.findById(msg.guild?.id || ''))) {
                    //@ts-ignore
                    _.logsEvents = ["messagedelete","messageedited","guildMemberRoleAdded".toLowerCase(),"avatarchange","nicknamechange","guildMemberRoleRemove".toLowerCase()]
                    _?.save()
                } else {
                    new guildModel.model({
                        _id: msg.guild?.id,
                        logsEvents: ["messagedelete","messageedited","guildMemberRoleAdded".toLowerCase(),"avatarchange","nicknamechange","guildMemberRoleRemove".toLowerCase()]
                    }).save()
                }
                //@ts-ignore
               this.send(
                t.translate("commands:logs.setDefault",{prefix: (await this.client.getPrefix(String(msg.guild?.id)))})
               )
            })
        })
        
    }

    if(["events"].includes(args[0]?.toLowerCase())) {
        if(["config"].includes(args[1]?.toLowerCase())) {
            //@ts-ignore
            let verifyR = _?.logsEvents
            //@ts-ignore
            let enabledMap = arrayOfEvents.filter((b) => verifyR?.includes(String(b.slice("events.".length)).toLowerCase())).map((a) => `+ ${a.toString()} ・ ${logsEvents.object[a.toString()]}`).join("\n")
           //@ts-ignore
            let disabledMap = arrayOfEvents.filter((b) => !verifyR?.includes(String(b.slice("events.".length)).toLowerCase())).map((a) => `- ${a.toString()} ・ ${logsEvents.object[a.toString()]}`).join("\n")

            return (
                this.send(
                    msg.member?.presence.clientStatus?.mobile ? t.translate("commands:logs.configMobile",{d: disabledMap, e: enabledMap}) : t.translate("commands:logs.configPC",{d: disabledMap, e: enabledMap})
                )
            )                
        }

        //@ts-ignore
        this.send(
            t.translate("commands:logs.eventsField",{prefix: await this.client.getPrefix(String(msg.guild?.id)),map, randomEvent: arrayOfEvents[Math.floor(Math.random() * arrayOfEvents.length)]})
        )
    }

    if(["enable"].includes(args[0]?.toLowerCase())) {
        //@ts-ignore
        if(_?.logsChannel == "None")  {
            return (
                this.send(
                    t.translate("commands:logs.needAct")
                )
            )
        }

        if(!args[1]) {
            return (
             this.send(
                t.translate("commands:logs.needEvent")
             )
            )
        }

        if(!arrayOfEvents.map(a => a.toLowerCase()).includes(args[1]?.toLowerCase())) {
            return (
                this.send(
                    t.translate("commands:logs.invalidEvent",{event: args[1],events: arrayOfEvents.join("\n")})
                )
            )
        }

        //@ts-ignore
        if(_?.logsChannel.includes(args[1]?.slice("events.".length)?.toLowerCase())) {
            return (
                this.send(
                    t.translate("commands:logs.haveEvent",{event: args[1]})
                )
            )
        }

        
        
        if(_) {
            //@ts-ignore
            _.logsEvents.push(args[1]?.slice("events.".length)?.toLowerCase())
            _.save()
        } 

        this.send(
            t.translate("commands:logs.eventActEnable",{event: args[1]})
        )
    }

    if(["disable"].includes(args[0]?.toLowerCase())) {

        //@ts-ignore
        if(_?.logsChannel == "None")  {
            return (
               this.send(
                t.translate("commands:logs.needAct")
               )
            )
        }

        if(!args[1]) {
            return (
                this.send(
                    t.translate("commands:logs.needEvent")
                )
            )
        }

        if(!arrayOfEvents.map(a => a.toLowerCase()).includes(args[1]?.toLowerCase())) {
            return (
                this.send(
                    t.translate("commands:logs.invalidEvent",{event: args[1],events: arrayOfEvents.join("\n")})
                )
            )
        }

        //@ts-ignore
        let verifyR = _?.logsEvents

        if(verifyR && !verifyR.includes(String(args[1].slice("events.".length)).toLowerCase())) {
            //@ts-ignore

                return ( this.send(
                    t.translate("commands:logs.nEv",{event: args[1]})

            ))
            
        }

        if(_) {
            let nwA = _.get("logsEvents").filter((b: string) => b != args[1]?.toLowerCase()?.replace(/(events\.)/ig,''))
            _.$set("logsEvents",nwA)
            _.save()
        }

        this.send(
            t.translate("commands:logs.eventActDisable",{event: args[1]})
        )
    }

    if(["reset"].includes(args[0]?.toLowerCase())) {

               if(_?.get("logsChannel") == "None")  {
                return (
                    this.send(
                        t.translate("commands:logs.needAct")
                    )
                )
            }

        this.send(
            t.translate("commands:logs.resetConfirm")
        ).then((message: Message) => {
            message.react("740316818664587325")

            message.createReactionCollector((r: any, u: any) => r.emoji.id == "740316818664587325" && u.id == msg.author.id)
            .on('collect',(r2: any) => {
                //@ts-ignore
                _?.logsEvents = []
                //@ts-ignore
                _?.logsType = "text"
                //@ts-ignore
                _?.logsChannel = "None"
                _?.save()

                this.send(
                    t.translate("commands:logs.reseted")
                )
            })
        })
    }

    if(["type"].includes(args[0]?.toLowerCase()))  {
        let types = [
            "text",
            "embed"
        ]

        if(!args[1]) {
            return (
                this.send(
                    t.translate("commands:logs.noType")
                )
            )
        }

        if(!types.includes(args[1]?.toLowerCase())) {
            return (
                this.send(
                    t.translate("commands:logs.noTypeV",{type: args[1],types: `\`${types.join(", ")}\``})
                )
            )
        }

        //@ts-ignore
        _?.logsType = args[1].toLowerCase()
        _?.save()
        //@ts-ignore
        this.send(
            t.translate("commands:logs.newType",{type: args[1]})
        )
    }

    if(!logsEvents.arguments.includes(args[0]?.toLowerCase())) {
        //@ts-ignore
        this.send(
            t.translate("commands:logs.iArg",{arg: args[0] || "???", args: logsEvents.arguments.join(", "),prefix: await this.client.getPrefix(String(msg.guild?.id)), randomArg: logsEvents.arguments[Math.floor(Math.random() * logsEvents.arguments.length)]})
        )
    }
  }
}
