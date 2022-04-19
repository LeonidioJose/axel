import core from '../../core/commands'
import Client from '../../Axel'
import { GuildMember, MessageReaction } from 'discord.js'
import pretty from 'pretty-ms'
import Message from '../../api/@types/Message'
 class kick extends core {
    constructor(client: Client) {
        super({
            name: "kick",
            usage: "commandsConfig:kick.usage",
            description: "commandsConfig:kick.description",
            syntax: "commandsConfig:kick.syntax",
            category: "commandsConfig:kick.category",
            userPermissions: ["KICK_MEMBERS"],
            botPermissions: ["KICK_MEMBERS"]
        },client)
    }

    async run(msg: Message, args: string[], t: {translate: (path: string, placeholders?: object) => string}) {
        if(!args[0]) {
            return (
                //@ts-ignore
                msg.quote(
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
                this.send(t.translate("commands:kick.noUser"))
            )
        }

        let willSendThis = await this.send(t.translate("commands:kick.confirm",{users: users?.map((b) => `\`${this.client.getUser(b)?.username}\``).join(', '), time: pretty(users.length == 1 ? users.length : (users.length - 1)* 2000)}))

        let reactThis = ['740316818664587325', '740313235634520094']

        //@ts-ignore
        for(let x of reactThis) {willSendThis.react(x)}

        //@ts-ignore
        let collector = willSendThis.createReactionCollector((reaction: MessageReaction,  user: GuildMember) => 
        (reaction.emoji.id ==  '740316818664587325', '740313235634520094') &&
        user.id == msg.author.id,
        {max: 1}
        )

        collector.on('collect',(r2: MessageReaction) => {
            switch(r2.emoji.id) {
                case '740316818664587325':
                    let kicked = []
                    //@ts-ignore
                    for(let x of users) {
                        let guildMember = msg.guild?.members.cache.get(x)

                        //@ts-ignore
                        if(guildMember?.roles.highest.position >= msg.member?.roles.highest.position && msg.guild?.ownerID != msg.author.id) {
                            this.send(t.translate("commands:kick.userPosition",{user: guildMember?.user.username})
                            )
                        } else {
                            if(!guildMember?.kickable) {
                                this.send(t.translate("commands:kick.cantKick",{user: guildMember?.user.username})
                                )
                            } else {
                                guildMember?.kick( args.slice(sliceReason).join(' ') || 'Axel kick')

                                kicked.push(guildMember.id)
                                 this.sleep(2000).then((rs) => rs)
                            }
                        }
                    }

                    if(kicked.length >= 1) {
                        this.send( t.translate("commands:kick.usersKicked",{
                            users: kicked.map((b) => `\`${this.client.getUser(b)?.username}\``).join(', ')
                        }))
                    }
                break
            case '740313235634520094':
                this.send(t.translate("commands:kick.cancel"))  
                break
            }
        })
    }
}

export default kick