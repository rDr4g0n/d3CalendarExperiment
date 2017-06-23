import * as d3 from "d3"
import CalendarView, {DAY, HOUR, WEEK} from "./Calendar"


// create an svg to put the calendar in
document.body.innerHTML = "<svg id='calendar' style='width: 90%; height: 150px; background-color: white;'></svg>"
document.body.style = "display: flex; align-items: center; justify-content: center; background-color: #CCC;"
let el = document.getElementById("calendar")

// create a calendar with some dummy data
new CalendarView({
    // DOM element to put stuff in 
	el: el,

    // start time. assumes its aligned to some sensible thing
    // (like the beginning of a day or something)
    start: new Date("2017-06-25T00:00:00Z").getTime(),

    // bucket size in ms
    unit: DAY,

    // number of buckets
    count: 3,

    // thingies to draw all up on
	events: [
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
    ]
})
