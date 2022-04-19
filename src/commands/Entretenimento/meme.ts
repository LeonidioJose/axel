import core from '../../core/commands';
import Client from '../../Axel';
import { Message, MessageAttachment } from 'discord.js';
import superagent from 'superagent'
import {KSoftClient} from '@ksoft/api'

const tJ = require("../../../config/config.json")

export default class test extends core {
  constructor(client: Client) {
    super({
      name: 'meme',
      usage: 'u',
      description: '',
      syntax: 'a',
      botPermissions: ["ATTACH_FILES"]
    },client);
  }
  async run(msg: Message, args: string[] | any[], t: any) {
   if(this.client.getGuildLang(String(msg.guild?.id)) == 'en') {
        const apiRequest = await superagent.get("https://meme-api.herokuapp.com/gimme")

        
        msg.channel.send({
            files: [apiRequest.body.url]
        })
   } else {
       
   }
  }
}