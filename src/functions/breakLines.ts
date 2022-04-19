function breakLines(string: string, number: number) {
    let xy = number + 1

    let finalStr = ""
    for(let x = 0; x < string.length; x++) {
        if((x + 1) % xy == 0) {
            finalStr += `\n${string.split("")[x]}`
        } else {
            finalStr += string.split("")[x]
        }
    }

    return finalStr
}

export default breakLines