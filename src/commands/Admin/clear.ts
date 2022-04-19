import core from '../../core/commands'
import { Message } from 'discord.js'
import Client from '../../Axel'

class clear extends core {
    constructor(client: Client) {
        super({
            name: "clear",
            usage: "commandsConfig:clear.usage",
            description: "commandsConfig:clear.description",
            syntax: "commandsConfig:clear.syntax",
            category: "commandsConfig:clear.category",
            userPermissions: ["MANAGE_MESSAGES"],
            botPermissions: ["MANAGE_MESSAGES"]
        },client)
    }

    async run(msg: Message, args: Array<string> | Array<any>, t: {translate: (path: string, placesholders?: object) => string}) {

        if(!args[0]) {
            return (
                //@ts-ignore
                msg.quote(
                    //@ts-ignore
                    await this.helpEmbed(t,msg,this.client)
                )
            )
        }

        if(isNaN(args[0])) {
            return (
                //@ts-ignore
                msg.quote(
                    //@ts-ignore
                    await this.helpEmbed(t,msg,this.client)
                )
            )    
        }

        let number = parseInt(args[0])
        if(number > 1000 || number <= 0) {
            return (
                this.send(t.translate("commands:clear.number"))
            )
        }

        //@ts-ignore
        let users = []
        let pages = Math.ceil(number / 100)

        if(args[1]) {
            for(let x of args.slice(1)) {
                let find = msg.guild?.members.cache.get(
                    x
                    .replace(/<|>|!|@/g)
                ) ||
                 msg.guild?.members.cache.filter((user) => user.user.username.toLowerCase().includes(x.toLowerCase())).first()
                //@ts-ignore
                || msg.guild?.members.cache.filter((user) => user.nickname?.toLowerCase().includes(x.toLowerCase())).first()

                if(find) {
                    users.push(find.id)
                }
            }
        }

        if(users.length == 0) {
            if(pages == 1) {
                let messages = await (await msg.channel.messages.fetch({limit: number})).filter(b => !b.pinned)

                //@ts-ignore
                const deletedMessages = await msg.channel?.bulkDelete(messages,true)

                let replyThis = deletedMessages.size < messages.size ? t.translate("commands:clear.sucessFailGlobal",{fail: messages.size - deletedMessages.size, member: msg.author}) : t.translate("commands:clear.sucessGlobal",{member: msg.author})

                //@ts-ignore
                msg.channel.send(replyThis)
            } else {
                let leng = 0;

                for(let i = 0; i < pages; i++) {
                    let limit = i == (pages - 1) ? number - ((pages - 1) * 100) : 100
                    let messages = await (await msg.channel.messages.fetch({limit})).filter((b) => !b.pinned)

                    //@ts-ignore
                    const deleted = msg.channel.bulkDelete(messages,true)
                    leng += deleted.size
                    if(msg.channel.messages.cache.size == 0) break
                    await this.sleep(2000)
                }

                let replyThis = leng < number ? t.translate("commands:clear.sucessFailGlobal",{fail: number - leng, member: msg.author}) : t.translate("commands:clear.sucessGlobal",{member: msg.author})

                msg.channel.send(replyThis)
            }
        } else {
            if(pages == 1) {
                //@ts-ignore
                let userMessages = await (await msg.channel.messages.fetch({limit: 100})).filter((b) => !b.pinned && users?.includes(b.author.id))

                //@ts-ignore
                const deletedMessages = await msg.channel.bulkDelete(userMessages,true)

                let replyThis = deletedMessages.size < userMessages.size ? t.translate("commands:clear.sucessFailUser",{fail: number - deletedMessages.size, member: msg.author, users: users.map((b) => `${this.client.users.cache.get(b)?.username}`).join(', ')}) : t.translate("commands:clear.sucessUsers",{member: msg.author,users: users.map((b) => `${this.client.users.cache.get(b)?.username}`).join(', ')})

                msg.channel.send(replyThis)
            } else {
                let leng = 0;

                for(let i = 0; i < pages; i++) {
                    let limit = i == (pages - 1) ? number - ((pages - 1) * 100) : 100
                    //@ts-ignore
                    let messages = (await msg.channel.messages.fetch({ limit })).filter((b) => !b.pinned && users.includes(b.author.id))
                    

                    //@ts-ignore
                    const deleted = await msg.channel.bulkDelete(messages,true)
                    leng += deleted.size
                    await this.sleep(2000)
                }

                let replyThis = leng < number ? t.translate("commands:clear.sucessFailUser",{fail: number - leng, member: msg.author, users: users.map((b) => `${this.client.users.cache.get(b)?.username}`).join(', ')}) : t.translate("commands:clear.sucessUsers",{member: msg.author,users: users.map((b) => `${this.client.users.cache.get(b)?.username}`).join(', ')})

                msg.channel.send(replyThis)
            }
        }
    }
}

export default clear