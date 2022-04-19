import core from '../../core/events'
import Client from '../../Axel'
import { Message } from 'discord.js'

export default class messageUpdate extends core {
    private client: Client
    constructor(client: Client) {
        super(
            {
                name: "messageUpdate"
            }
        )

        this.client = client
    }

    async run(oldMsg: Message, newMsg: Message) {
        this.client.emit("message",newMsg)
    }
}