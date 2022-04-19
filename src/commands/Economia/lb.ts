import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import Connection from '../../../lib/connectLibs'

export default class test extends core {
  constructor(client: Client) {
    super({
      name: 'lb',
      usage: 'u',
      description: '',
      syntax: 'a',
      aliases: ["leaderboard"]
    },client);
  }
  async run(msg: Message, args: string[] | any[], t: any) {
    let array = this.client.moneyLb.array().sort((a, b) => b.Money - a.Money).filter((b) => !!b.Money)
    let col = this.client.moneyLb.array().sort((a, b) => b.Money - a.Money)
    let data = new this.client.libs.formatter()

    const map = array.map((lb, rank) => `${rank + 1}° ${this.client.users.cache.get(lb.id)?.username} :: ${data.formatNumber(lb.Money,",")}`).slice(0,14).join('\n')

    const embed = new this.client.embed()
    .setTitle("<:owner:753708179212206080> Leaderboard")
    .setDescriptionFromBlockArray([[`**\`\`\`\n${map}\n\`\`\`**`]])
    .setThumbnail('https://static.thenounproject.com/png/901816-200.png')

    this.send([[`**\`\`\`\n${map}\n\`\`\`**`]],{
      title: "<:owner:753708179212206080> Leaderboard",
      thumbnail: 'https://static.thenounproject.com/png/901816-200.png'
    })
  }
}