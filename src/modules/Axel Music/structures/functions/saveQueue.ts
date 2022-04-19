 export default async (client: any, guild: any, channel: any, channelVoice:any, queue:any) => {


  
    let data = await client.db.ref(`Músicas/Servers/${guild}/Musicas`).once("value")
        data = data.val()
    
    let guilds = await client.db.ref(`Músicas/Servers/Ids/Guilds`).once("value")
        guilds = guilds.val()
    
    let chanels = await client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Text`).once("value")
        chanels = chanels.val()
    
    let chanelsvoice = await client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Voz`).once("value")
        chanelsvoice = chanelsvoice.val()
   
    if(!data) {
      
      if(!guilds) {
        
        client.db.ref(`Músicas/Servers/Ids/Guilds`).set([guild])
        
      } else {
          //@ts-ignore
        let array = []
        if(guilds.includes(guild)) { } else { array.push(guild) }
        
        for(let i = 0; i < guilds.length; i++) {
          
          array.push(guilds[i])
          
        }      
          //@ts-ignore
        setTimeout(() => { client.db.ref(`Músicas/Servers/Ids/Guilds`).set(array) }, 3000)
        
      }
      
      if(!chanels) {
        
        client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Text`).set([channel])
        
      } else {
          //@ts-ignore
        let array = []
        if(chanels.includes(channel)) { } else { array.push(channel) }
        
        for(let i = 0; i < chanels.length; i++) {
          
          array.push(chanels[i])
          
        }      
          //@ts-ignore
        setTimeout(() => { client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Text`).set(array) }, 3000)
        
      }
      
      if(!chanelsvoice) {
        
        client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Voz`).set([channelVoice])
        
      } else {
          //@ts-ignore
        let array = []
        if(chanelsvoice.includes(channelVoice)) { } else { array.push(channelVoice) }
        
        for(let i = 0; i < chanelsvoice.length; i++) {
          
          array.push(chanelsvoice[i])
          
        }      
          //@ts-ignore
        setTimeout(() => { client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Voz`).set(array) }, 3000)
        
      }
      //@ts-ignore
      let musicsArray = []
      queue.map((a: any) => { musicsArray.push(a) })
        //@ts-ignore
      setTimeout(() => client.db.ref(`Músicas/Servers/${guild}/Musicas`).set(musicsArray) , 5000)
      
    } else {
      
      if(!guilds) {
        
        client.db.ref(`Músicas/Servers/Ids/Guilds`).set([guild])
        
      } else {
          //@ts-ignore
        let array = []
        
        if(guilds.includes(guild)) { } else { array.push(guild) }
        
        for(let i = 0; i < guilds.length; i++) {
          
          array.push(guilds[i])
          
        }
          //@ts-ignore
        setTimeout(() => { client.db.ref(`Músicas/Servers/Ids/Guilds`).set(array) }, 3000)
        
      }
      
      if(!chanels) {
        
        client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Text`).set([channel])
        
      } else {
          //@ts-ignore
        let array = []
        if(chanels.includes(channel)) { } else { array.push(channel) }
        
        for(let i = 0; i < chanels.length; i++) {
          
          array.push(chanels[i])
          
        }      
          //@ts-ignore
        setTimeout(() => { client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Text`).set(array) }, 3000)
        
      }
      
      if(!chanelsvoice) {
        
        client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Voz`).set([channelVoice])
        
      } else {
          //@ts-ignore
        let array = []
        if(chanelsvoice.includes(channelVoice)) { } else { array.push(channelVoice) }
        
        for(let i = 0; i < chanelsvoice.length; i++) {
          
          array.push(chanelsvoice[i])
          
        }      
          //@ts-ignore
        setTimeout(() => { client.db.ref(`Músicas/Servers/${guild}/Ids/Channels/Voz`).set(array) }, 3000)
        
      }
        //@ts-ignore
      let musicsArray = []
      queue.map((a: any) => { musicsArray.push(a) })
        //@ts-ignore
      setTimeout(() => client.db.ref(`Músicas/Servers/${guild}/Musicas`).set(musicsArray) , 5000)
      
    }
    
  }