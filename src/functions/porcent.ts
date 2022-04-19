

function porcent(percent: string, callback: () => void) {
    let porcentNumber = Number(percent.replace(/%/g,''))
    //@ts-ignore
    return Math.random(1 / porcentNumber) <= porcentNumber * 1 / 100 ? callback() : null;
}
export default porcent