import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';

export default class bio extends core {
  constructor(client: Client) {
    super({
      name: 'queue',
      aliases: ['q','lista','musics','musicas','músicas'],
      description: 'commandsConfig:queue.description',
      syntax: 'commandsConfig:queue.syntax',
      usage: 'commandsConfig:queue.usage',
      category: 'commandsConfig:queue.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    let player = this.client.musicManager.players.get(msg.guild?.id)

    if(!player) {
        return (
            this.send(
                t.translate("commands:queue.noMusic")
            )
        )
    }

    if(!player.queue) {
        return (
            this.send(
                t.translate("commands:queue.noQueue")
            )
        )
    }

    const queue = player.queue.map((a: any) => a)
    const embeds = []

    let k = 15;

    for(let i = 0; i < queue.length; i+=15) {
        const current = queue.slice(i,k)
        let j = i
        k += 15

        const info = current.map((track: any) => `${++j} - [${track.title}](${track.uri})`).join("\n");

        const embed = new this.client.embed()
        .setTitle("• Queue")
        .setDescriptionFromBlockArray(
            [
                [
                    info
                ]
            ]
        )
        .setThumbnail(msg.guild?.iconURL({dynamic: true}))

        embeds.push(embed)
    }

    this.client.API.pagination('guild',msg,embeds,["⏪", "⏩"],'120000')
  }
}
