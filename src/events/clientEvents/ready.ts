import core from '../../core/events';
import Client from '../../Axel';
import guildModel from '../../database/models/guilds'
import usersModel from '../../database/models/users'
import wDog from '../../.watchdog/client'

class ready extends core {
  client: Client;
  constructor(client: Client) {
    super({
      name: 'ready',
    });

    this.client = client;
  }

  async run(any: any) {
    console.log(
      `[LOGGED] Logged with sucess was ${this.client.user?.username}`
    );

    process.on('uncaughtException',() => {
      console.log("OI DEU ERRO AQUI")
    })
    
    this.client.users.cache.forEach(async (u) => {

        let verify = await usersModel.model.findById(u.id)
        const money = {
          val: () => {
            //@ts-ignore
            return verify?.money
          }
        }

        this.client.moneyLb.set(u.id,{
          id: u.id,
          Money: money.val()
        })
        
      })
      

    this.client.guilds.cache.forEach(async (a) => {

      let verify = await guildModel.model.findById(a.id)
      //@ts-ignore
      let valor2 = verify?.lang || "pt"

      this.client.langGuilds.set(a.id, valor2);
    });
    
  }
}

export default ready;
