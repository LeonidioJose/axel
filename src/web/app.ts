import express from 'express'
import glob from 'glob'
import path from 'path'

const app = express();

app.use((req: any, res: any, next: any) => {

    let cmdObj = {}

    glob.sync("./src/commands/**/*.ts").forEach((rs) => {
        let requiriment = new (require(`../commands/${rs.split("/")[3]}/${rs.split("/")[4]}`)).default()

        //@ts-ignore
        cmdObj[requiriment.help.name] = {
            description: requiriment.help.description,
            usage: requiriment.help.usage,
            botPermissions: requiriment.help.botPermissions,
            userPermissions:  requiriment.help.userPermissions,
            syntax: requiriment.help.syntax,
            aliases: requiriment.help.aliases,
            cooldown: requiriment.help.cooldown
        }
    })


    res.status(200).json(cmdObj)
})

export default app;
