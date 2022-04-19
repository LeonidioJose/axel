import { Guild } from "discord.js"

export default async (guild: Guild) => {
  
    const database = require('firebase').database()
    
    let guilds = await database.ref(`Músicas/Servers/Ids/Guilds`).once("value")
        guilds = guilds.val()


        console.log(guilds)
    
        database.ref(`Músicas/Servers/Ids/Guilds`).update(guilds.splice(guilds.indexOf(guild), 1))
    
    database.ref(`Músicas/Servers/${guild}`).remove();
    
  }