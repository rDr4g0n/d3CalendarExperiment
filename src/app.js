import * as d3 from "d3"
import CalendarView, {DAY, HOUR, WEEK} from "./Calendar"


// create an svg to put the calendar in
document.body.innerHTML = `
    <svg id='cal1' style='width: 60%; height: 150px; background-color: white;'></svg>
    <svg id='cal2' style='width: 20%; height: 200px; background-color: white;'></svg>`
document.body.style = "display: flex; align-items: center; justify-content: space-around; background-color: #CCC;"

let cal1El = document.getElementById("cal1")
let cal2El = document.getElementById("cal2")

let events = [
    {
        start: new Date("2017-06-26T10:00:00Z").getTime(),
        duration: HOUR,
        name: "hot yoga",
        id: Math.floor(Math.random() * 10000)
    },{
        start: new Date("2017-06-26T11:30:00Z").getTime(),
        duration: HOUR,
        name: "cold yoga",
        id: Math.floor(Math.random() * 10000)
    },{
        start: new Date("2017-06-27T09:00:00Z").getTime(),
        duration: (2*HOUR),
        name: "cold yoga",
        id: Math.floor(Math.random() * 10000)
    },{
        start: new Date("2017-06-27T13:00:00Z").getTime(),
        duration: (5*HOUR),
        name: "cold yoga",
        id: Math.floor(Math.random() * 10000)
    }
].sort((a, b) => a.start - b.start)

// create a calendar with some dummy data
let cal1 = new CalendarView({
    // DOM element to put stuff in 
	el: cal1El,

    // start time. assumes its aligned to some sensible thing
    // (like the beginning of a day or something)
    start: new Date("2017-06-25T00:00:00Z").getTime(),

    // bucket size in ms
    unit: DAY,

    // number of buckets
    // NOTE - only does one row with `count` buckets
    // TODO - grid of buckets
    count: 3,

    // thingies to draw all up on
	events: events
})

// create a calendar with some dummy data
let cal2 = new CalendarView({
    // DOM element to put stuff in 
	el: cal2El,

    // start time. assumes its aligned to some sensible thing
    // (like the beginning of a day or something)
    start: new Date("2017-06-26T00:00:00Z").getTime(),

    // bucket size in ms
    unit: DAY,

    // number of buckets
    // NOTE - only does one row with `count` buckets
    // TODO - grid of buckets
    count: 1,

    // thingies to draw all up on
	events: events,

})


// update one calendars if the other changes
cal1.dispatch.on("change", () => {
    cal2.render()
})
cal2.dispatch.on("change", () => {
    cal1.render()
})
