import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';
import superagent from 'superagent'

export default class test extends core {
  constructor(client: Client) {
    super({
      name: 'swift',
      usage: 'u',
      description: '',
      syntax: 'a',
      botPermissions: ["ATTACH_FILES"]
    },client);

  }
  async run(msg: Message, args: string[] | any[], t: any) {
    this.send("https://top.gg/bot/577139966379819044")
  }
}