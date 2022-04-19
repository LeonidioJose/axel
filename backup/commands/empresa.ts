import core from '@src/core/commands';
import Client from '@src/Axel';
import { Message } from 'discord.js';
import firebase from 'firebase';

const db = firebase.database();

class Empresa extends core {
  public client: Client;

  constructor(client: Client) {
    super({
      name: 'empresa',
      aliases: ['company','cpy'],
      cooldown: '5s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:empresa.syntax',
      description: 'commandsConfig:empresa.description',
      usage: 'commandsConfig:empresa.usage',
     // category: 'commandsConfig:empresa.category',
    });

    this.client = client;
  }

  async run(msg: Message, args: Array<string>, t: any) {

    if(this.client.owners.includes(msg.author.id)) return (
      msg.channel.send(new this.client.embed()
      .setDescriptionFromBlockArray([[t.translate("commands:global.beta")]])
      )
    )

    let options = ['create', 'criar', 'info', 'sair', 'leave'];

    let option = args[0];

    if (!options.includes(option)) return msg.channel.send('Não compatível');

    if (option === options[0] || option === options[1]) {
      let empresa = await db
        .ref(`Usuarios/${msg.author.id}/Empresa`)
        .once('value');

      if (empresa.val() !== null)
        return msg.channel.send('Você já está em uma empresa!');

      let random = Math.floor(Math.random() * 100000);

      let empresaName = args[1];
      if (!empresaName) return msg.channel.send('Nenhum nome para a empresa!');

      let empresaToken = Buffer.from(msg.author.id + '@:&' + random).toString(
        'base64'
      );

      db.ref(`Usuarios/${msg.author.id}/Empresa`)
        .set({
          name: empresaName,
          token: empresaToken,
        })
        .then(() => {
          msg.channel.send(`Empresa ${empresaName} criada com sucesso!`);
        });
    }
  }
}

export default Empresa;
