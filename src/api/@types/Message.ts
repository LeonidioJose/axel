import {DMChannel, Message, NewsChannel, TextChannel} from 'discord.js'
import Client from '../../Axel'

class nMsg extends Message {
    constructor(cli: Client, data: object, channel: TextChannel | DMChannel | NewsChannel) {
        super(cli,data,channel)
    }

    async quote(content: string | object, obj?: object) {
        return "..."
    }
}
export default nMsg