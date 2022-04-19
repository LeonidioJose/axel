import lib from 'node-schedule'

let startTime = new Date(Date.now())
let startTimestamp = startTime.getTime() + (10000 - 1)
let endTime = new Date( startTime.getTime() + 10000)

lib.scheduleJob({start: startTimestamp, end: endTime, rule: '*/1 * * * * *'},() => {
    console.log("HM")
})