import  Client  from '../../../../Axel'
import nodes from '../../Nodes'
import { GorilinkManager} from 'gorilink'
import Discord from 'discord.js'
import tApi from '../../../../../lib/i19Axel'
import { resolve } from 'path'
import fun from '../index'

export default (client: Client) => {
  
    //@ts-ignore
  client.musicManager = new GorilinkManager(client, nodes, {
    
    sendWS: (data) => {
      
      let guild = client.guilds.cache.get(data.d.guild_id)
      if(!guild) return

      return guild.shard.send(data)
    }
    
  })
  .on('nodeConnect', node => {
    
    console.log(`${node.tag} - Lavalink conectado com sucesso!`)
    
  })
  .on('trackStart', (player, track) => {

    let t = new tApi({
        preload: resolve(__dirname,"../../../../language"),
        lang: client.getGuildLang(player.textChannel.guild.id)
    })
    //@ts-ignore
    let embed = new Discord.MessageEmbed().setDescription(t.translate("events:Lavalink.start",{title: track.title, url: track.uri, requester: track.requester})).setColor("#4a9ecf")
    
    //@ts-ignore
    player.textChannel.send(embed)

    let vc = client.channels.cache.get(player.voiceChannel)

    console.log(player.guild)
    //@ts-ignore
    
  })
  .on('trackEnd', (player, track) => {

    let t = new tApi({
        preload: resolve(__dirname,"../../../../language"),
        lang: client.getGuildLang(player.textChannel.guild.id)
    })
    
    let embed = new Discord.MessageEmbed().setDescription(t.translate("events:Lavalink.end",{title: track.title})).setColor("#4a9ecf")
    //@ts-ignore
    player.textChannel.send(embed)
    let vc = client.channels.cache.get(player.voiceChannel);
    //@ts-ignore
    
  })  
}