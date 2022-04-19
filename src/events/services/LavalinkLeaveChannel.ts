import core from '../../core/events'
import Client from '../../Axel'
import { VoiceState } from 'discord.js'

export default class raw extends core {
    private client: Client
    constructor(client: Client) {
        super(
            {
                name: "voiceStateUpdate"
            }
        )

        this.client = client
    }

    async run(oldChannel: VoiceState, newChannel: VoiceState | undefined) {
        if(newChannel?.channel) return


        if(oldChannel.channel?.members.size == 1 && oldChannel.channel.members.array()[0].id == this.client.user?.id) {

            let player = this.client.musicManager.players.get(oldChannel.guild.id)

            if(player) {
            player.queue.remove()
            player.destroy()
            }
        }
    }
}