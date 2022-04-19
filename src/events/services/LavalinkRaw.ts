import core from '../../core/events'
import Client from '../../Axel'

export default class raw extends core {
    private client: Client
    constructor(client: Client) {
        super(
            {
                name: "raw"
            }
        )

        this.client = client
    }

    async run(packet: any) {
        this.client.musicManager.packetUpdate(packet)
    }
}