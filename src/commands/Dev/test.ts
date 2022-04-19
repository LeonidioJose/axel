import core from '../../core/commands';
import Client from '../../Axel';
import { Collection, Message } from 'discord.js';
import axios from 'axios';

export default class test extends core {
  constructor(client: Client) {
    super({
      name: 'test',
      usage: 'u',
      description: '',
      syntax: 'a',
    },client);
  }
  async run(msg: Message, args: string[] | any[], t: any) {
    let colc = new Collection()

    colc.set("oi","a")
    colc.set("SDKALDK","..")

    
  }
}