import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import userM from '../../database/models/users'

export default class bio extends core {
  constructor(client: Client) {
    super({
      name: 'bio',
      aliases: ['biografia', 'setbio', 'sobremim','desc','setdesc'],
      description: 'commandsConfig:bio.description',
      syntax: 'commandsConfig:bio.syntax',
      usage: 'commandsConfig:bio.usage',
      category: 'commandsConfig:bio.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {
    let bio = args.join(' ');
    bio = bio.replace(/\s{2,}/g, ' ');
    if (!bio) return msg.reply(t.translate('commands:bio.noBio'));

    if (bio.length > 180) return msg.reply(t.translate('commands:bio.length'));

    let verify = await userM.model.findById(msg.author.id)

    this.send(
      t.translate('commands:bio.success', { bio })
    )

    if(verify) {
      //@ts-ignore
      verify.biography = bio
      verify.save()
    } else {
      new userM.model({
        _id: msg.guild?.id,
        biography: bio
      }).save()
    }
  }
}
