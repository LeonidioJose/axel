function msTimer(num: string) {
    let x = parseFloat(num.substr(0,num.length-1))
    let unit = num.split("").filter((b: string) => /[\D]/g.test(b)).join("")

    let multipliers = {
        s: 1000,
        m: 60000,
        h: 3600000,
        d: 86400000,
        w: 604800000,
        mm: 2628000000,
        y: 31536000000
    }

    if(!Object.keys(multipliers).includes(unit)) return parseFloat(num)

    //@ts-ignore
    return x * multipliers[unit]
}

export default msTimer