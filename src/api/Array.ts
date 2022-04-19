export default () =>
//@ts-ignore
Array.prototype.advancedPush = (array: any[], element: any) => {
    let newArray = array
    newArray.push(element)

    return newArray
}

//@ts-ignore
Array.prototype.advancedSplice = (array: any[], index: number, repeat: number) => {
    let newArray = array
    newArray.splice(index,repeat)

    return newArray
}