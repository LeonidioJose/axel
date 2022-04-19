import core from '../../core/commands'
import Client from '../../Axel'
import Message from '../../api/@types/Message'

type tApiTy = {
    translate: (path: string, placeholders?: object) => string
}

class loop extends core {
    constructor(client: Client) {
        super(
            {
                name: "loop",
                usage: "commandsConfig:loop.usage",
                description: "commandsConfig:loop.description",
                syntax: "commandsConfig:loop.syntax",
                category: "commandsConfig:loop.category"
            },
            client
        )

    }

    async run(msg: Message, args: string[] | any[], t: tApiTy) {
        if(!args[0]) {
            let embed = await this.helpEmbed(t,msg,this.client)

            return msg.quote(embed)
        }

        if(!msg.member?.voice.channel) {
            return this.send(
                t.translate("commands:loop.noMemberVC")
            )
        }

        let player = this.client.musicManager.players.get(msg.guild?.id)

        if(!player) {
            return this.send(
                t.translate("commands:loop.noPlayer")
            )
        }

        if(player && msg.guild?.voice?.channelID != msg.member.voice.channelID) {
            return  this.send(
                t.translate("commands:loop.voiceDif",{channel: msg.guild?.me?.voice.channel?.name})
            )
        }

        let array = []
        switch(this.client.getGuildLang(String(msg.guild?.id))) {
            case 'pt':
                let  opt = ["música","desativar","queue"]
                for(let x of opt) {
                    array.push(x)
                }
            break
            case 'en': 
                let optEN = ["music","queue","off"]
                
                for(let x of optEN) {
                    array.push(x)
                }
            break    
        }

        if(!array.includes(args[0]?.toLowerCase())) {
           return this.send(
                t.translate("commands:loop.invalidArg",{args: array.map((b: string) => `\`${b}\``).join(', '), arg: args[0]})
           )
        }

        if(["music","música"].includes(args[0]?.toLowerCase())) {
            player.loop(1)
            msg.react("✅")
        }

        if(args[0]?.toLowerCase() == "queue") {
            player.loop(2)
            msg.react("✅")
        }

        if(["off","desligar"].includes(args[0]?.toLowerCase())) {
            player.loop(2)
            msg.react("✅")
        }
    }
}

export default loop