import core from '../../core/events';
import Client from '../../Axel';
import { Message, MessageMentions, Collection } from 'discord.js';
import firebase from 'firebase';
import i19Axel from '../../../lib/i19Axel';
import { resolve } from 'path';
import parse from 'parse-ms';
import ms from 'ms';
import guildModel from '../../database/models/guilds'
import userModel from '../../database/models/users'

class message extends core {
  public client: Client;
  constructor(client: Client) {
    super({
      name: 'message',
    });

    this.client = client;
  }

  async run(msg: Message) {
    if (msg.author.bot) return;
    if (msg.channel.type !== 'text') return;

    //@ts-ignore
    let prefix = await guildModel.model.findById(msg.guild?.id) ? (await guildModel.model.findById(msg.guild?.id))?.prefix : "a?"

    let lang = this.client.getGuildLang(String(msg.guild?.id))

    if (
      msg.content == (`<@${this.client.user?.id}>`) ||
      msg.content == (`<@!${this.client.user?.id}>`)
    ) {
      let tApi = new i19Axel({
        preload: resolve(__dirname, `../../language/`),
        lang: lang,
      });

      let embedMention = new this.client.embed()
        .setAuthor(`${msg.author.tag}`)
        .setDescription(
          tApi.translate('events:message.mention', {
            author: msg.author,
            prefix: prefix,
          })
        )
        .setThumbnail(this.client.user?.avatarURL())
        .setColor(require('../../util/colours.json').main);

      return msg.channel.send(embedMention);
    }

    //if (!msg.content.startsWith(prefix) || msg.mentions.users.first() != this.client.user) return;

    let args = msg.content.replace(/\s{2}/g,'').split(/\s+/g)

    var mentions 
    var guildMemberMentions

    if([this.client.user?.toString(),`<@!${this.client.user?.id}>`].includes(args[0])) {
      args = args.slice(1)
      //@ts-ignore
      msg.mentions.users.delete(msg.mentions.users.firstKey())
      //@ts-ignore
      msg.mentions.members?.delete(msg.mentions.members.firstKey())

      mentions = msg.mentions.users
      guildMemberMentions = msg.mentions.members
    } else {
      mentions = msg.mentions.users
      guildMemberMentions = msg.mentions.members

    }

    let command = args.shift()?.replace(String(prefix),'')?.toLowerCase();

    if (command?.length === 0) return;
    let getAlias = this.client.aliases.get(String(command));
    let cmd =
      this.client.commands.get(String(command)) ||
      this.client.commands.get(String(getAlias));
      if(!cmd) return

    if (cmd) {
      let tApi = new i19Axel({
        preload: resolve(__dirname, `../../language`),
        lang: lang,
      });

      let userDB = await userModel.model.findById(msg.author.id)
      
      //@ts-ignore
      if (userDB?.blacklisted) {
        let blacklistedEmb = new this.client.embed()
          .setTitle('Blacklist!')
          .setDescription(
            tApi.translate('events:message.blacklisted', { author: msg.author })
          )
          .setColor(require('../../util/colours.json').main);

        return msg.channel.send(blacklistedEmb);
      
      }
      /** 
      let _database = await db
        .ref(`Commands/Cooldown/${msg.author.id}/${cmd.help.name}/Timestamp`)
        .once('value');

      let timestampCooldown = ms(cmd.help.cooldown);

      if (
        _database.val() !== null &&
        Number(timestampCooldown) - (Date.now() - _database.val()) > 0
      ) {
        let time = parse(
          Number(timestampCooldown) - (Date.now() - _database.val())
        );

        let message =
          time.seconds > 0
            ? `${require('../../util/emojis.json').check_no.mention}` +
              tApi.translate('events:message.secondsCooldown', {
                command: command,
                seconds: time.seconds,
              })
            : `${require('../../util/emojis.json').check_no.mention}` +
              tApi.translate('events:message.secondsMs', { command: command });

        return msg.reply(message);
      }
      */
      

      if (
        cmd.help.userPermissions.length > 0 &&
        !this.client.owners.includes(msg.author.id)
      ) {
        let perms = [];
        for (let x of cmd.help.userPermissions) {
          if (!msg.member?.hasPermission(x)) perms.push(x);
        }
        if (perms.length <= cmd.help.userPermissions.length) {
          let permTrad = [];
          for (let x of perms) {
            permTrad.push(tApi.translate(`permissions:user.${x}`));
          }

          if (permTrad.length === 1) {
            let embed = new this.client.embed().setDescription(
              require('../../util/emojis.json').check_no.mention +
                ' ' +
                tApi.translate('events:message.noUserPermSingular', {
                  perm: permTrad[0].toUpperCase(),
                })
            );

            return msg.reply(embed);
          } else if (permTrad.length > 1) {
            let embed = new this.client.embed().setDescription(
              require('../../util/emojis.json').check_no.mention +
                ' ' +
                tApi.translate('events:message.noUserPermPlural', {
                  perm: permTrad.join(', ').toUpperCase(),
                })
            );

            return msg.reply(embed);
          }
        }
      }

      if (
        cmd.help.botPermissions.length >
        0 /*&& !this.client.owners.includes(msg.author.id)*/
      ) {
        let perms = [];
        for (let x of cmd.help.botPermissions) {
          if (!msg.guild?.me?.hasPermission(x)) perms.push(x);
        }
        if (perms.length <= cmd.help.botPermissions.length) {
          let permTrad = [];
          for (let x of perms) {
            permTrad.push(tApi.translate(`permissions:bot.${x}`));
          }

          if (permTrad.length === 1) {
            let embed = new this.client.embed().setDescription(
              require('../../util/emojis.json').check_no.mention +
                ' ' +
                tApi.translate('events:message.noBotPermSingular', {
                  perm: permTrad[0].toUpperCase(),
                })
            );

            return msg.reply(embed);
          } else if (permTrad.length > 1) {
            let embed = new this.client.embed().setDescription(
              require('../../util/emojis.json').check_no.mention +
                ' ' +
                tApi.translate('events:message.noBotPermPlural', {
                  perm: permTrad.join(', ').toUpperCase(),
                })
            );

            return msg.reply(embed);
          }
        }
      }

      if (cmd) {
        console.log("ponto")
        cmd.s(msg,args)
        cmd.run(msg, args, tApi,{mentions, guildMemberMentions}).catch((err: any): any => {
          msg.channel.send(
            `${
              require('../../util/emojis.json').check_no.mention
            } **»** ${tApi.translate('events:message.error', {
              error: err,
              authorID: msg.author.id,
            })}`
          );
          console.log(err);
        });
          //@ts-ignore

          function save() {
            //@ts-ignore
            if(userDB) {
              //@ts-ignore
            userDB.commandsExec += 1
            userDB?.save()
            } else {
              new userModel.model({
                _id: msg.author.id,
                commandsExec: 1
              })?.save()
            }
          }

        setTimeout(save,3200)
        /** 

        db.ref(`Usuarios/${msg.author.id}/commandsExec`).transaction(
          (now) => now + 1
        );

        cmd.setCooldown(msg.author);
        */
      }
    } else { console.log("nao deu cmd" )}
  }
}

export default message;
