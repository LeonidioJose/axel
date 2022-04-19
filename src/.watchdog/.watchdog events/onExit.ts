import Client from '../../Axel'

export default class x {
    private client: Client
    public config: {name: string}
    constructor(clr: Client) {
        this.config = {
            name: "exited"
        }

        this.client = clr
    }

    async run(metaData: any) {
        console.log("foi desativado OOOOOOOONNN")
    }
}