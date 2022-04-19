import core from '../../core/commands'
import Client from '../../Axel'
import { GuildMember, Message, MessageReaction } from 'discord.js'
import pretty from 'pretty-ms'

 class ban extends core {
    constructor(client: Client) {
        super({
            name: "ban",
            usage: "commandsConfig:ban.usage",
            description: "commandsConfig:ban.description",
            syntax: "commandsConfig:ban.syntax",
            category: "commandsConfig:ban.category",
            userPermissions: ["BAN_MEMBERS"],
            botPermissions: ["BAN_MEMBERS"]
        },client)
    }

    async run(msg: Message, args: string[], t: any) {
        if(!args[0]) {
            return (
                //@ts-ignore
                msg.quote(
                    //@ts-ignore
                    await this.helpEmbed(t,msg,this.client)
                )
            )
        }

        //@ts-ignore
        let users = []
        let sliceReason = 0

        for(let x of args) {
            let verify = msg.guild?.members.cache.get(
                x
                .replace(/<|>|@|!/g,'')
            ) || msg.guild?.members.cache.get(
                //@ts-ignore
                msg.guild.members.cache.filter((b: GuildMember) => b.user.username.toLowerCase().includes(x.toLowerCase()))?.first()?.id
                ||
                //@ts-ignore
                msg.guild.members.cache.filter((b: GuildMember) => b.nickname?.toLowerCase().includes(x.toLowerCase()))?.first()?.id
            ) 

            if(verify) {
                users.push(verify?.id)
                ++sliceReason
            } else { break }
        }

        if(users.length < 1) {
            return (
                this.send(t.translate("commands:ban.noUser"))
            )
        }

        //@ts-ignore
        let willSendThis = await this.send(t.translate("commands:ban.confirm",{users: users?.map((b) => `\`${this.client.getUser(b)?.username}\``).join(', '), time: pretty(users.length == 1 ? users.length : (users.length - 1)* 2000)})        )

        let reactThis = ['740316818664587325', '740313235634520094']

        for(let x of reactThis) {willSendThis.react(x)}

        let collector = willSendThis.createReactionCollector((reaction: MessageReaction,  user: GuildMember) => 
        (reaction.emoji.id ==  '740316818664587325', '740313235634520094') &&
        user.id == msg.author.id,
        {max: 1}
        )

        collector.on('collect',(r2: MessageReaction) => {
            switch(r2.emoji.id) {
                case '740316818664587325':
                    let banned = []
                    //@ts-ignore
                    for(let x of users) {
                        let guildMember = msg.guild?.members.cache.get(x)

                        //@ts-ignore
                        if(guildMember?.roles.highest.position >= msg.member?.roles.highest.position && msg.guild?.ownerID != msg.author.id) {
                            this.send(t.translate("commands:ban.userPosition",{user: guildMember?.user.username}))
                        } else {
                            if(!guildMember?.bannable) {
                                this.send(t.translate("commands:ban.cantBan",{user: guildMember?.user.username}))
                            } else {
                                guildMember?.ban({reason: args.slice(sliceReason).join(' ') || "Axel Ban"})

                                banned.push(guildMember.id)
                                 this.sleep(2000).then((rs) => rs)
                            }
                        }
                    }

                    if(banned.length >= 1) {
                        //@ts-ignore
                        this.send(t.translate("commands:ban.usersBanned",{
                            users: banned.map((b) => `\`${this.client.getUser(b)?.username}\``).join(', ')
                        }))
                    }
                break
            case '740313235634520094':
                    this.send(t.translate("commands:ban.cancel"))
                break        
            }
        })
    }
}

export default ban