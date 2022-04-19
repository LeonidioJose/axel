import Client from '../../Axel'
import userModel from '../../database/models/users'

export default async function add(id: string,amount: number, client: Client) : Promise<void> {

    let us = await userModel.model.findById(id)
    //@ts-ignore
    let newVal = us?.money || 300
    newVal-=amount
    if(us) {
        //@ts-ignore
        us.money = newVal
        us.save()
    } else {
        new userModel.model({
            _id: id,
            money: newVal
        }).save()
    }
    client.moneyLb.set(id,{
        id: id,
        Money: newVal
    })

}