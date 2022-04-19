import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import util from 'util';
import deleteString from '../../functions/deleteFromString';
import ms from 'pretty-ms';
const userModel = require('../../database/models/users')


const { Collection } = require("discord.js")

export default class evalCommand extends core {
  constructor(client: Client) {
    super({
      name: 'eval',
      aliases: ['ev', 'code'],
      syntax: 'commandsConfig:eval.syntax',
      description: 'commandsConfig:eval.description',
      usage: 'commandsConfig:eval.usage',
    },client);

  }

  async run(msg: Message, args: string[], t: any,{users, members}: any) {
    if (!this.client.owners.includes(msg.author.id))
      return msg.channel.send(t.translate('commands:devOnly'));

    if (!args.join(' ')) {
      return msg.channel.send('Digite algum code!');
    }

    let code = args.join(" ").replace(/^`{3}(ts)?`{3}$/g,'')

    try {
      const start = process.hrtime();

      let ev = eval(code);
      let ins = util.inspect(ev);

      if (ins.length > 1000) {
        ins = ins.substr(1, 1000);
      }

      const stop = process.hrtime(start);
      let emb = new this.client.embed()
        .addField('📥 Entrada', `\`\`\`ts\n${code}\`\`\``)
        .addField('📤 Saída', '```ts\n' + ins + '```');
      emb.addField('📡 Tipo de saída', typeof ev, true);
      emb.addField(
        '<:cooldown:775054742401319003> Tempo de execução',
        `${ms((stop[0] * 1e9 + stop[1]) / 1e6)}`,
        true
      );

      //@ts-ignore
      msg.quote(emb);
    } catch (e) {
      let erEmb = new this.client.embed()
        .setTitle('Err...')
        .setDescription(`\`\`\`ts\n${e}\`\`\``);

        console.log(e)
      //@ts-ignore
      msg.quote(erEmb);
    }
  }
}
