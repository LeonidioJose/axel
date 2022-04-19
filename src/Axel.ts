import winston from 'winston';
import { Logger } from 'winston';
import moment from 'moment';
import { Client, Collection, Guild, User } from 'discord.js';
import './util/module-alias';

import glob from 'glob';
import path from 'path';
import firebase from 'firebase';
import AxelEmbed from './services/AxelEmbed';
import CollectionP from './services/PaginateCollection';
import getDimensionsService from './services/getDimensions';
import controllersType from './controllers/typings/controllers'
import controllers from './controllers/core'
import guildModel from './database/models/guilds'
import libs from '../lib/connectLibs'

export type libsT = {
  formatter: any,
  i19Axel: any,
  intents: any
}

moment.locale('pt-br');

class Axel extends Client {
  public logger: Logger;
  public client: Client
  public commands: Map<string,any>
  public aliases: Map<string,string>
  public db: any
  public embed: any
  public langGuilds: Map<any,any>
  public owners: Array<any>
  public Collection:  any
  public commandsArray: Array<any>
  public API: any
  public musicManager: any
  public moneyLb: Collection<any,any>
  public controllers: controllersType
  public libs: libsT
  constructor(...args : any) {
    super(...args)

    this.logger = winston.createLogger()

    this.client = this

    this.commands = new Map()
    this.aliases = new Map()
    this.db = 'ponto'
    this.embed = AxelEmbed
    
    this.langGuilds = new Map()
    this.owners = [
      "360834865639325697",
      "682203061606678534"
    ]

    this.Collection =  CollectionP 
    this.commandsArray = []
    this.API = true
    this.moneyLb = new Collection()
    this.controllers = controllers
    this.libs = libs
  }
  async initWinston() {
    if (process.env.NODE_ENV === 'production') {
      this.logger.add(
        new winston.transports.Console({
          level: process.env.LOGGIN_LEVEL || 'silly',
        })
      );
    } else {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(
              (info) =>
                `[${moment(info.timestamp).format('DD/MM/YYYY hh:mm:ss')}] ${
                  info.level
                }: ${info.message}`
            )
          ),
        })
      );
    }
  }

  getUser(id: string) {
    if(!isNaN(Number(id))) {
      return this.users.cache.get(id)
    } else {
      return this.users.cache.filter((b: User) => b.username.includes(id?.toLowerCase())).array()[0]
    }
  }

  async initCommands(): Promise<void> {
    glob.sync(path.resolve(__dirname, './commands/**/*.ts')).forEach((a) => {
      let requiriment = new (require(a).default)(this);

      this.logger.debug(`[LOADERS] Loading command ${requiriment.help.name}`);

      this.commands.set(requiriment.help.name, requiriment);
      this.commandsArray.push(requiriment.help.name);

      requiriment.help.aliases.forEach((key: string) => {
        this.aliases.set(key, requiriment.help.name);
      });
    });
  }

  async initEvents(): Promise<void> {
    glob.sync(path.resolve(__dirname, './events/**/*.ts')).forEach((key) => {
      let requiriment = new (require(key).default)(this);

      this.logger.debug(`[LOADERS] Loading event ${requiriment.help.name}`);

      super.on(requiriment.help.name, (...args) => requiriment.run(...args));
    });
  }

  getDimensions(url: string) {
    return getDimensionsService(url);
  }

  async initDatabase(userId: string): Promise<void> {
    require("./database/mongoose").default()
  }


  async guildCache(g: string | Guild) {
    if(g instanceof Guild) {
      g = g?.id
    }

    let x = await guildModel.model.findOne({_id: g})
    if(x) { return x }; return null
  }

  checkDm(user: User) {
    let x = true
    try {

        user.createDM()
    } catch (error) {
        x = false
    }

    return x

  }

  getGuildLang(guildId: string | Guild) {
    if(guildId instanceof Guild) guildId = guildId?.id
    let verify = this.langGuilds.get(guildId)

    if(verify) {
      return verify
    } else {
      return 'pt'
    }
  }

  async initCustomAPI(): Promise<void> {
    glob.sync(path.resolve(__dirname, './api/*.ts')).forEach((x) => {
      require(x).default();
    });

        //@ts-ignore
  }

  getToken(options: { from: Guild | User | string; data?: { id?: number } }) {
    //@ts-ignore
    if (options.from instanceof Guild) {
      const pass = Buffer.from(
        options.from.id +
          ':' +
          Math.floor(
            Math.random() * (options.data?.id || super.guilds.cache.size)
          )
      ).toString('base64');

      return pass;
    } else if (options.from instanceof User) {
      const pass = Buffer.from(
        options.from.id +
          ':' +
          Math.floor(
            Math.random() * (options.data?.id || super.users.cache.size)
          )
      ).toString('base64');

      return pass;
    }

    const pass = Buffer.from(
      //@ts-ignore
      options.from +
      "_."
      + Math.floor(
        Math.random() * (options.data?.id || super.users.cache.size)
      )
    )

    return pass
  }

  getCategoryID(category: string) {
    if (['Moderação', 'Moderation'].includes(category)) {
      return '0';
    } else if (['Configuração', 'Configuration'].includes(category)) {
      return '1';
    } else if (['Economia', 'Economy'].includes(category)) {
      return '2';
    } else if (['Entretenimento', 'Entertainment'].includes(category)) {
      return '3';
    } else if (
      ['Manipulação de imagem', 'Image manipulation'].includes(category)
    ) {
      return '4';
    } else if (['Information', 'Informação'].includes(category)) {
      return '5';
    } else if (category == 'Social') {
      return '6';
    } else if (['Utility', 'Utilidades'].includes(category)) {
      return '7';
    } else if(["Música","Music"].includes(category)) {
      return '8'
    }
  }

  async getPrefix(guildID: string) {
    let prefix = await guildModel.model.findById(guildID)
    //@ts-ignore
    let result = prefix ? prefix.prefix : "a?"

    return result
  }
}

export default Axel;
