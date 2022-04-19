import util from 'util'

export default function ev(str: string) {
    var input

    if(str.includes("../") || str.includes("./")) return "undefined"
    try {
    if(str.includes("for(")) return 'Internal Error: My API can\'t run this script.'    
    let evaled = eval(str)

    input = util.inspect(evaled).toString().substr(0,1480)
    if(input.includes(require("../../../config/config.json").token)) return 'undefined'


    } catch(err) {
        input = err
    }



    return input
}