import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';
import userModel from '../../database/models/users'

class store extends core {

  constructor(client: Client) {
    super({
      name: 'store',
      aliases: ['loja', 'lojinha'],
      cooldown: '5s',
      userPermissions: [],
      botPermissions: [],
      syntax: 'commandsConfig:store.syntax',
      description: 'commandsConfig:store.description',
      usage: 'commandsConfig:store.usage',
      category: 'commandsConfig:store.category',
    },client);
  }

  async run(msg: Message, args: string[], t: any) {

    let userSchema = await userModel.model.findById(msg.author.id)

    let loadingStore = new this.client.embed().setDescription(
      t.translate('commands:store.loading')
    );



    let storeEmbed = new this.client.embed()
      .setDescription(
        t.translate('commands:store.welcomeToStore', {
          user: msg.author.username,
        })
      )
      .addFields({
        name: t.translate('commands:store.itens.premium.title'),
        value: t.translate('commands:store.itens.premium.value'),
      })
      .setFooter(t.translate('commands:store.footer'));


      //@ts-ignore
      msg.channel.send(loadingStore)
      .then((_something: Message) => {
      setTimeout(() => {
        if (_something.editable) {
          _something.edit(storeEmbed);

          _something.react('768812768560021585');
        } else {
          //@ts-ignore
          msg.quote(t.translate('commands:store.editableErr'));
        }
      }, 5000);

      const collector = _something.createReactionCollector(
        (r: any, u: any) =>
          r.emoji.id === '768812768560021585' &&
          u.id !== this.client.user?.id &&
          u.id === msg.member?.id,
          {
            max:
              1
          }
      );

      collector.on('collect', async (r: any) => {
        switch (r.emoji.id) {
          case '768812768560021585':
            _something.reactions.removeAll();

            //@ts-ignore
            let premium = userSchema?.hasPremium || false

            if (premium) {
              return this.send(
                t.translate('commands:store.havePremium')
              );
            }
          
            //@ts-ignore
            let userCoins = userSchema?.money || 300

            if (Number(userCoins) === 10000) {
              return this.send(
                t.translate('commands:store.itens.premium.noCoins')
              );
            }

           this.client.controllers.economy.remove(msg.author.id,10000,this.client)
            if(userSchema) {
              //@ts-ignore
              userSchema.typePremium = "Comum"
              //@ts-ignore
              userSchema.hasPremium = true
              //@ts-ignore
              userSchema.timePremium = 604800000

              userSchema.save()
            } else {
              new userModel.model({
                typePremium:  "Comum",
                hasPremium: true,
                timePremium: 604800000
              }).save()
            }

            this.send(
              t.translate('commands:store.itens.premium.success')
            );
            break;
        }
      });
    });
  }
}

export default store;
