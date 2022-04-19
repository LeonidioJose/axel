import Client from '../../Axel'

type controllers = {
    economy: {
        add: (id: string, amount: number, client: Client) => {},
        remove:  (id: string, amount: number, client: Client) => {}
    }
}

export default controllers