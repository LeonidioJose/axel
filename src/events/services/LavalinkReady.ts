import core from '../../core/events'
import Client from '../../Axel'
import firebase from 'firebase'
import { Guild } from 'discord.js'

export default class ready extends core {
    private client: Client
    constructor(client: Client) {
        super(
            {
                name: "ready"
            }
        )

        this.client = client
    }

    async run(packet: any) {/** 
        this.client.musicManager.start(this.client.user?.id)

        this.client.guilds.cache.each((guild: Guild) => {
            let player = this.client.musicManager.players.get(guild.id)

            if(player) player.queue.remove()
        })
        **/
    }
}