import Client from '../Axel'

const glob = require('../../node_modules/glob/glob')

class watchClient extends Client {
    constructor() {
        super({})
    }

    async loadMetaEvents() {
        let files = glob.sync("./src/.watchdog/.watchdog events/*.*")

        for(let x of files)  {
            let fileName = x.split("/").pop()

            console.log(fileName)
            let required = require(`./.watchdog events/${fileName}`)
            required = new required(this)

            this.on(required?.config.name,(...x) => required.run(...x))
        }
    }
}

export default  watchClient