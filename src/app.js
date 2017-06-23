import * as d3 from "d3"

const MARGINS = {top: 10, right: 10, bottom: 10, left: 10};

function applyPaddingToScale(scale, multiplier){
    let [start, end] = scale.domain(),
        range = end - start,
        val = range * multiplier;
    start -= val;
    end += val;
    scale.domain([start, end]);
}

const HOUR = 1000 * 60 * 60
const DAY = HOUR * 24

class CalendarView {
    constructor(config){
		let {el, data, start, days} = config

        // build container with margins
        let svg = d3.select(el);
        let g = svg.append("g")
            .attr("transform", `translate(${MARGINS.left},${MARGINS.top})`);

        this.svg = svg;
        this.g = g;
        this.visG = g.append("g").attr("class", "vis-group");
        this.margins = MARGINS;

        // calculate size
        let rect = this.svg.node().getBoundingClientRect();
        this.w = rect.width - this.margins.left - this.margins.right;
        this.h = rect.height - this.margins.top - this.margins.bottom;

        // set size
        this.svg.attr("width", this.w).attr("height", this.h);

        // create scales
        this.xScale = d3.scaleTime()
            .range([0, this.w])
            .domain([start, start + (DAY * days)])

        // relative xscale for distance between points of
        // time but not location on the timeline
        // TODO - theres definitely a d3 way to do this
        this.xScale2 = this.xScale.copy()
        let domain = this.xScale2.domain().map(d => d.getTime())
        let inverseDomain0 = domain[0] * -1
        this.xScale2.domain([domain[0] + inverseDomain0, domain[1] + inverseDomain0]);

        this.yScale = d3.scaleLinear()
            .range([0 + this.margins.top, this.h])

        // maps colors to ids
        this.color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(data.map(d => d.id))

        this.data = data
        this.drawEvents();
    }

    drawEvents(){
        // sort by start time, ascending
        this.data = this.data.sort((a, b) => a.start - b.start)

        let rect = this.visG.selectAll("rect.event-rect")
            .data(this.data, d => d.id)

        // :(
        let self = this;

        rect.enter().append("rect")
                .attr("class", "event-rect")
                .attr("fill", d => this.color(d.id))
                .call(d3.drag()
                    .on("start", function(e){ 
                        self.onDragStart(this, e);
                    })
                    .on("drag", function(e){ 
                        self.onDrag(this, e);
                    })
                    .on("end", function(e){ 
                        self.onDragEnd(this, e);
                    })
                )
            .merge(rect)
                .attr("x", d => this.xScale(d.start))
                .attr("y", d => 0)
                .attr("width", d => this.xScale2(d.duration))
                .attr("height", this.yScale(1))

        rect.exit().remove();
    }

    onDragStart(context, e){
        d3.select(context)
            .raise()
    }
    onDrag(context, e){
        // commit new value to dataset
        d3.select(context)
            .attr("x", d => {
                // TODO - dont use side effect here?
                d.start = this.xScale.invert(d3.event.x)
                return d3.event.x
            })
        // TODO - spensive?
        this.drawEvents()
    }
    onDragEnd(context, e){
        // aint no thang
    }
}



document.body.innerHTML = "<svg id='calendar' style='width: 90%; height: 150px; background-color: white;'></svg>"
document.body.style = "display: flex; align-items: center; justify-content: center; background-color: #CCC;"
let el = document.getElementById("calendar")
// week start 1497830400
// 2017-06-25T00:00:00Z
let calendar = new CalendarView({
	el: el,
    start: new Date("2017-06-25T00:00:00Z").getTime(),
    days: 3,
	data: [
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
        }
    ]
})
console.log(calendar)

