import guildModel from '../database/models/guilds'
import {Guild} from 'discord.js'

export default async () => {
    Object.defineProperties(Guild.prototype,{
        dbCache: {
            'get': async () => {
                let x = await guildModel.model.findOne({_id: this?.id})

                if(x) {
                    return x
                } else {
                    return null
                }
            }
        }
    })
}