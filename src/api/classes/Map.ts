class newMap extends Map {
    constructor() {
        super()

    }

    objectValues() {
        let array = []

        let forOf = this

        for(let x in forOf) {
            array.push(
                {
                    value: x,
                    key: forOf[x]
                }                
            )
        }

        return array
    }
}

export default newMap