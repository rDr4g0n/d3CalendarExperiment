export const HOUR = 1000 * 60 * 60
export const DAY = HOUR * 24
export const WEEK = DAY * 7

/* TODO
 * - prevent events overlapping
 * - when an event spans buckets, show it in both places
 * - configurable / snappable gridlines
 * - resize events
 * - add new event
 * - preserve click position on drag (dont always snap to top)
 * - x/y grid
 */

// a helper to deal with d3 overriding `this`
function unwrapCallback(context, key){
    return function(e){
        context[key](this, e);
    }
}

export default class CalendarView {
    constructor(config){
		let {el, events, start, unit, count} = config

        this.start = start
        this.count = count
        this.unit = unit

        this.svg = d3.select(el);
        this.g = this.svg.append("g")

        // calculate size
        let rect = this.svg.node().getBoundingClientRect();
        this.w = rect.width
        this.h = rect.height

        // set size
        this.svg.attr("width", this.w).attr("height", this.h);

        this.createScales()

        // map colors to id list
        this.color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(events.map(d => d.name))

        // hang on to events for renderin
        this.events = events
        this.drawEvents();
    }

    createScales(){
        // this effectively subdivides the timeline into buckets
        // that are the size the user specifies (days, hours, weeks)
        let bucketWidth = this.w / this.count
        this.xScale = d3.scaleQuantize()
            .domain([this.start, this.start + (this.unit * this.count)])
            // let d3 generate equally spaces buckets
            .range(d3.range(0, this.w, bucketWidth))

        // since x axis is bucketed to the user specified duration,
        // the y axis is "sub" duration. that is, if the user specified
        // days, the y axis deals with values less than aday
        this.yScale = d3.scaleLinear()
            .range([0, this.h])
            .domain([0, this.unit])

        this.getY = d => {
            let remainder = (d.start - this.start) % this.unit
            return this.yScale(remainder)
        }
    }

    drawEvents(){
        // sort by start time, ascending
        this.events = this.events.sort((a, b) => a.start - b.start)

        let rect = this.g.selectAll("rect.event-rect")
            .data(this.events, d => d.id)

        rect.enter()
            .append("rect")
                .attr("class", "event-rect")
                .attr("fill", d => this.color(d.name))
                .call(d3.drag()
                    .on("start", unwrapCallback(this, "onDragStart"))
                    .on("drag", unwrapCallback(this, "onDrag"))
                )
            .merge(rect)
                .attr("x", d => this.xScale(d.start))
                .attr("y", d => this.getY(d))
                // TODO - look for overlaps and reduce width to fit
                .attr("width", this.bucketWidth)
                .attr("height", d => this.yScale(d.duration))

        rect.exit().remove();
    }

    onDragStart(context, e){
        d3.select(context)
            .raise()
    }

    onDrag(context, e){
        let {x, y} = d3.event

        d3.select(context)
            .each(d => {
                let nearestX = 0
                let range = this.xScale.range()
                // figure out which bucket the user's mouse is over
                // HACK - d3 has to provide an easy way
                // to get this... this is dumb
                for(let i = 0; i < range.length; i++){
                    if(x > range[i]){
                        nearestX = range[i]
                    }
                }

                // calculate a new start position, starting with the
                // start time of the bucket the user's mouse is over
                let newStart = this.xScale.invertExtent(nearestX)[0]

                // now add the y offset to the start time, which adds
                // the "sub-bucket" value. eg: if buckets are days, the y
                // value adds hours or minutes
                newStart += this.yScale.invert(y)
                
                d.start = newStart
            })

        // rerender the events, keeping in mind that only events
        // which has changed will cause a DOM update
        this.drawEvents()
    }
}



