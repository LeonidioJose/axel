export default async (timer: string | number) => {
    let x = Number(timer)

    let rgx =/\.[\w]/g
    let s = (!rgx.test(String(x)))  ? Math.floor(x/1000) : x
    
    let d = 0
    let h = 0
    let m = 0

    while(x >= 60) {m++; s-=60}
    while(m >= 60) {h++; m-=60}
    while(h >= 24) {d++,h-=24}
   
    let obj = {dias:0,horas:0,minutos:0,segundos:0}
    
    if(d >= 1) obj.dias = d
    if(h >= 1) obj.horas = h
    if(m >= 1) obj.minutos = m
    if(s >= 1) obj.segundos = s

    return obj
}