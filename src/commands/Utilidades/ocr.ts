import core from '../../core/commands';
import Client from '../../Axel';
import {  MessageAttachment, MessageEmbed, MessageOptions } from 'discord.js';
import {readImage} from 'the-simplifier'
import Message from '../../api/@types/Message'

export default class test extends core {
  constructor(client: Client) {
    super({
      name: 'ocr',
      usage: 'u',
      description: '',
      syntax: 'a',
      aliases: ['readtext']
    },client);
  }
  async run(msg: Message, args: string[] | any[], t: any) {
     let link
     let attachLast = msg.channel.messages.cache.sort((b, a) => a.createdTimestamp - b.createdTimestamp).first()

     let print = msg.attachments.first()

     /** 
     if(attachLast) {
       link = attachLast?.url
     } else if(print) {
       link = print?.url
     } else if(args[0] && !print && !attachLast && (/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i.test(args[0]))) {
      link = args[0]
     }
     */

    if(args[0] && !print && !attachLast  /**(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i.test(args[0])**/) {
      link = args[0]
    } else if(print) {
      link = print.url
    } else if(attachLast && !print) {
      link = attachLast?.url
    }

     console.log(link)

     if(!link) {
       let embed = await this.helpEmbed(t,msg,this.client)

       return msg.quote(embed)
     }

     let result = await readImage(link)

     msg.quote(result)
  }
}