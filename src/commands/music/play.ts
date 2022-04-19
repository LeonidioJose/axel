import core from '../../core/commands';
import Client from '../../Axel';
import { Message } from 'discord.js';

export default class play extends core {
    constructor(client: Client) {
        super(
            {
                name: "play",
                usage: 'commandsConfig:play.usage',
                description: "commandsConfig:play.description",
                syntax: "commandsConfig:play.syntax",
                category: "commandsConfig:play.category"
            },
            client
        )

    }
    async run(msg: Message, args: string[] | any[], t: any) {
        var player = this.client.musicManager.players.get(msg.guild?.id)
        const memberChannel = msg.member?.voice.channel

        if(!player) {
        if(!memberChannel) {
            return (
                this.send(
                    t.translate("commands:play.noVoice")
                )
            )
        }

        let arg = args.join(" ")
        if(!arg) {
            return (
                this.send(
                    t.translate("commands:play.noMusic")
                )
            )
        }

        if(msg.guild?.me?.voice.channel && msg.guild?.me?.voice.channel?.id != memberChannel.id) {
            return (
                this.send(
                    t.translate("commands:play.inChannel",{channel: msg.guild?.me?.voice.channel?.name})
                )
            )
        }

        const play = await this.client.musicManager.join({
            guild: msg.guild,
            voiceChannel: memberChannel,
            textChannel: msg.channel
        },{selfDeaf: true});

        const tracks = await this.client.musicManager.fetchTracks(arg)
        const adds = {
            size: 0,
            musicas: []
        }

        if(tracks.loadType === 'NO_MATCHES') {
            return (
                this.send(
                    t.translate("commands:play.noMatch",{track: arg})
                )
            );
        }
        if(tracks.loadType == "PLAYLIST_LOADED") {
            tracks.tracks.map(async (track: any) => {
                player.queue.add(track)
                player.queue[player.queue.length - 1].requester = msg.author.id
                ++adds.size
                //@ts-ignore
                adds.musicas.push(track)
                if(!player.playing) return player.play()
            })

            this.send(
                t.translate("commands:play.musicsAdded",{size: adds.size})
            )
        } else {
            tracks.tracks[0].requester = msg.author.id;
            this.client.musicManager.players.get(msg.guild?.id).queue.add(tracks.tracks[0])
      
            if(!this.client.musicManager.players.get(msg.guild?.id).playing) return this.client.musicManager.players.get(msg.guild?.id).play()
            
           this.send(
            t.translate("commands:play.musicAdded",{title: tracks.tracks[0].title, url: tracks.tracks[0].uri})
           )

        }
      } else {
        if(!memberChannel) {
            return (
               this.send(
                t.translate("commands:play.noVoice")
               )
            )
        }

        let arg = args.join(" ")
        if(!arg) {
            return (
                this.send(
                    t.translate("commands:play.noMusic")
                )
            )
        }

        if(msg.guild?.me?.voice.channel && msg.guild?.me?.voice.channel?.id != memberChannel.id) {
            return (
               this.send(
                t.translate("commands:play.inChannel",{channel: msg.guild?.me?.voice.channel?.name})
               )
            )
        }

        const tracks = await this.client.musicManager.fetchTracks(arg)
        const adds = {
            size: 0,
            musicas: []
        }

        if(tracks.loadType === 'NO_MATCHES') {
            return ( 
                this.send(
                    t.translate("commands:play.noMatch",{track: arg})
                )
            )
        }
        if(tracks.loadType == "PLAYLIST_LOADED") {
            tracks.tracks.map(async (track: any) => {
                player.queue.add(track)
                player.queue[player.queue.length - 1].requester = msg.author.id
                ++adds.size
                //@ts-ignore
                adds.musicas.push(track)
                if(!this.client.musicManager.players.get(msg.guild?.id).playing) return this.client.musicManager.players.get(msg.guild?.id).play()
            })

            this.send(
                t.translate("commands:play.musicsAdded",{size: adds.size})
            )
        } else {
            tracks.tracks[0].requester = msg.author.id;
            player.queue.add(tracks.tracks[0])
      
            if(!this.client.musicManager.players.get(msg.guild?.id).playing) return this.client.musicManager.players.get(msg.guild?.id).play()
            
            this.send(
                t.translate("commands:play.musicAdded",{title: tracks.tracks[0].title, url: tracks.tracks[0].uri})
            )
        }
      }
    }
}