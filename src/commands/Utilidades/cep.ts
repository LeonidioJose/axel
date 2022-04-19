import core from '@src/core/commands';
import Client from '@src/Axel';
import { Message } from 'discord.js';
import axios from 'axios';
import AxelEmbed from '@src/services/AxelEmbed';
import Axel from '@src/Axel';

class Cep extends core {

  constructor(client: Client) {
    super({
      name: 'cep',
      aliases: [],
      cooldown: '3s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:cep.syntax',
      description: 'commandsConfig:cep.description',
      usage: 'commandsConfig:cep.usage',
      category: 'commandsConfig:cep.category',
    },client);
  }

  async run(msg: Message, args: Array<string>, t: any) {
    let data;

    if(this.client.getGuildLang(msg.guild?.id) != 'pt') throw new Error("Unknown Error")

    try {
      let cep = args.join(' ');

      if (!cep) return msg.channel.send('Nenhum cep!');

      cep = cep.replace(/[^a-zA-Z 0-9]+/g, '');

      try {
        const { data: d } = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );

        data = d;
      } catch (tryError) {
        this.client.logger.error(tryError);
        console.log(tryError);

        let embed = new AxelEmbed(msg.author)
          .setTitle('Erro')
          .setDescriptionFromBlockArray([
            [
              'Um erro desconhecido ocorreu durante a busca pelo cep informado, por favor, tente novamente.',
              `\`\`\`${tryError}\`\`\``,
            ],
          ]);

        return msg.channel.send(embed);
      }

      let embed = new AxelEmbed(msg.author)
        .setAuthor('Consulta de Cep')
        .setDescriptionFromBlockArray([
          [`CEP: `, data.cep],
          [`Estado: `, data.localidade],
          [`Cidade: `, data.uf],
          [`Bairro: `, data.bairro],
          [`DDD: `, data.ddd],
        ])
        .setImage(
          'https://viacep.com.br/estatico/images/viacep.png.pagespeed.ce.I80LiA6qpr.png'
        );

      msg.channel.send(embed);
    } catch (tryError) {
      if (data.error === true) {
        let embed = new AxelEmbed(msg.author)
          .setTitle('Error')
          .setDescriptionFromBlockArray([
            [
              'Error:',
              `\`\`\`${tryError}\`\`\``,
            ],
          ]);

        return msg.channel.send(embed);
      }
    }
  }
}

export default Cep;
