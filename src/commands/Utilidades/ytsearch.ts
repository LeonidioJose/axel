import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import ytApi from 'youtube-search-engine'

export default class test extends core {
  private client: Client;
  constructor(client: Client) {
    super({
      name: 'ytsearch',
      usage: 'u',
      description: '',
      syntax: 'a',
      aliases: ["sy","youtube"]
    },client);

    this.client = client;
  }
  async run(msg: Message, args: string[] | any[], t: any) {
    ytApi.execute(args[0]).then((rs: any) => {
      console.log(rs)
    })
  }
}
