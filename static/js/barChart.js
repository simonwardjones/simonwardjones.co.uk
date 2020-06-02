// Line chart in es6
//import 'd3'

class SimpleBarChart {
    /*
    Simple because it doesn't implement 
    any stacking - just one bar
    */
    constructor(element, data, options = {}) {
        this.element = element
        this.data = data
        this.options = { ...this.defaultOptions(), ...options }

        this.chart_id = this.randomClass();
        this.hasData = false
        this.colorIterator = this.colorIteratorGenerator()
        this.setResizeEventListener()
        this.update(data)
    }

    defaultOptions() {
        return {
            height: 400,
            width: 400,
            responsive: true,

            /* set the following to undefined for no min/max
             on the responsive behaviour */
            minHeight: 200,
            maxHeight: 400, // change to 400

            marginTop: 10,
            marginBottom: 40,
            marginLeft: 40,
            marginRight: 10,

            lineColor: "#007bff",

            duration: 2000,
            debug: false,
        }
    }

    update(data) {
        // Called to update objects with data
        this.data = data || this.data
        if (this.data == undefined) {
            this.log('No data yet')
            this.updateSVG()
            this.updateStyles()
            return
        }
        this.hasData = true
        this.updateSVG()
        this.updateStyles()
        this.updateScales()
        this.updateAxis()
        this.updateBars()
        this.updateLegend()
    }

    getWidthHeight() {
        this.svg = d3.select(this.element)
            .selectAll('svg')
            .data(['svg'])
            .join("svg")
            .attr("class", `${this.chart_id}`)
            .attr("id", d => d)
        this.plot = this.svg
            .selectAll("g#plot")
            .data(['plot'])
            .join("g")
            .attr("class", `${this.chart_id}`)
            .attr("id", d => d)
        var width, height
        if (this.options.responsive) {
            width = this.element.offsetWidth;
            height = d3.min([
                this.options.maxHeight,
                d3.max([this.options.minHeight, width / 2])])
        } else {
            width = this.options.width
            height = this.options.height
        }
        return [width, height]
    }

    updateSVG() {
        // Set chart height, width and margins
        let [width, height] = this.getWidthHeight()
        this.width = width
        this.height = height
        this.margin = {
            top: this.options.marginTop,
            bottom: this.options.marginBottom,
            left: this.options.marginLeft,
            right: this.options.marginRight,
        };
        // now the sizes are correct resize
        this.log(`Resizing: width ${width} and height ${height}`)
        this.svg
            .attr("width", this.width)
            .attr("height", this.height)
        this.plot
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    }

    setResizeEventListener() {
        if (this.options.responsive) {
            d3.select(window).on(`resize.${this.chart_id}`, () => {
                var duration = this.options.duration
                this.options.duration = 0
                this.update()
                this.options.duration = duration
            });
        }
    }

    updateStyles(styleOptions = {}) {
        styleOptions = { ...this.options, ...styleOptions }
        this.svg
            .style("background", styleOptions.svgBackground)
    }

    updateScales() {
        const { top, bottom, right, left } = this.margin;

        this.xScale = d3.scaleBand()
            .domain(this.data.values.map(d => d[0]))
            .range([0, this.width - (left + right)])
            .padding(0.1);

        const yMax = d3.max(this.data.values.map(d => d[1])) * 1.1
        this.yScale = d3.scaleLinear()
            .range([this.height - (top + bottom), 0])
            .domain([0, yMax]);
    }

    getAxis() {
        let n = this.data.values.length
        let step = Math.ceil(n / 10)
        let nTicks = Math.floor(n / step)
        const tickValues = [...Array(nTicks).keys()].map(i => {
            let step = Math.ceil(n / nTicks)
            return this.data.values[i * step][0]
        })

        const xAxis = d3.axisBottom()
            .scale(this.xScale)
            .tickValues(tickValues)
            .tickFormat(d3.format(".0f"))

        const yAxis = d3.axisLeft()
            .scale(this.yScale)
            .tickFormat(d3.format(".2f"));

        return [xAxis, yAxis]
    }

    updateAxis() {
        const { top, bottom } = this.margin;
        const [xAxis, yAxis] = this.getAxis()
        this.plot
            .selectAll("#x-axis")
            .data(['x-axis'])
            .join(
                enter => enter.append("g")
                    .attr("class", `${this.chart_id}`)
                    .attr("id", d => d)
                    .attr("transform", `translate(0,${this.height - (bottom + top)})`)
                    .call(xAxis),
                update => update
                    .attr("transform", `translate(0,${this.height - (bottom + top)})`)
                    .call(update => {
                        update.transition()
                            .duration(this.options.duration)
                            .call(xAxis)
                    })
            )
        this.plot
            .selectAll("#y-axis")
            .data(['y-axis'])
            .join(
                enter => enter.append("g")
                    .attr("class", `${this.chart_id}`)
                    .attr("id", d => d)
                    .call(yAxis),
                update => update.call(update =>
                    update.transition()
                        .duration(this.options.duration)
                        .call(yAxis))
            )
    }

    updateBars() {
        var tooltip = d3.select('body').selectAll('div.toolTip')
            .data([true])
            .join("div")
            .attr("class", "toolTip")
            .style("position", "absolute")
            .style("display", "none")
            .style("height", "auto")
            .style("min-width", "80px")
            .style("border", "1px solid #6F257F")
            .style("padding", "14px")
            .style("text-align", "center")
            .style("background","#ffffff")
            .style("pointer-events","none")

        this.plot
            .selectAll("rect")
            .data(this.data.values)
            .join(
                enter => enter
                    .append("rect")
                    .attr("x", d => this.xScale(d[0]))
                    .attr("y", this.yScale(0))
                    .attr("width", this.xScale.bandwidth())
                    .attr("width", this.xScale.bandwidth())
                    .attr("height", 0)
                    .attr("fill", this.options.lineColor)
                    .call(enter => enter.transition()
                        .duration(this.options.duration)
                        .attr("y", d => this.yScale(d[1]))
                        .attr("height", d => this.yScale(0) - this.yScale(d[1]))
                    )
                    .on("mousemove", function (d) {
                        tooltip
                            .style("left", d3.event.pageX - 50 + "px")
                            .style("top", d3.event.pageY - 70 + "px")
                            .style("display", "inline-block")
                            .text(`p(X=${d[0]}) = ${d[1].toFixed(4)}`);
                    })
                    .on("mouseout", function (d) { tooltip.style("display", "none"); }),
                update => update
                    .call(update => update.transition()
                        .duration(this.options.duration)
                        .attr("x", d => this.xScale(d[0]))
                        .attr("y", d => this.yScale(d[1]))
                        .attr("width", this.xScale.bandwidth())
                        .attr("height", d => this.yScale(0) - this.yScale(d[1]))
                    ),
                exit => exit
                    .call(exit => exit.transition()
                        .duration(this.options.duration)
                        .attr("y", this.yScale(0))
                        .attr("height", 0)
                        .remove()
                    )
            )
    }

    /* Creat color wheel*/
    defaultColors() {
        return {
            blue: "#007bff",
            red: "#dc3545",
            green: "#28a745",
            purple: "#6f42c1",
            orange: "#fd7e14",
            pink: "#e83e8c",
            indigo: "#6610f2",
            teal: "#20c997",
            yellow: "#ffc107",
            cyan: "#17a2b8",
        }
    }

    colorIteratorGenerator() {
        let keys = Object.keys(this.defaultColors())
        let n = keys.length
        let iteration = 0
        const iterator = {
            next: () => {
                let index = iteration % n
                iteration += 1
                return this.defaultColors()[keys[index]]
            }
        }
        return iterator
    }

    /* helper functions below*/
    log(message = "") {
        if (this.options.debug) {
            console.log(`[${this.constructor.name}] `, message)
        }
    }

    randomClass() {
        return [...Array(5)]
            .map(_ => Math.floor(Math.random() * 26))
            .map(x => 'abcdefghijklmnopqrstuvwxyz'[x]).join("")
    }

    updateLegend() {
        let legend = d3.select(this.element)
            .selectAll('div#legend')
            .data(['legend'])
            .join("div")
            .attr("id", 'legend')
            .style("display", "flex")
            .style("flex-flow", "row wrap")
            .style("justify-content", "space-evenly")
            .style("background", this.options.svgBackground)

        let legendItems = legend.selectAll("div.legendItem")
            .data([this.data], d => d.id)
            .join(
                enter => enter.append("div")
                    .attr("class", `legendItem ${this.chart_id}`)
                    .style("display", "flex")
                    .style("padding", "4px")
                    .call(legendItem => {
                        legendItem.append("div")
                            .style("background", this.options.lineColor)
                            .style("height", "100%")
                            .attr('id', d => d)
                            .style("width", "1em")
                            .style("margin-right", "0.5em")
                            .style("clip-path", "circle(0)")
                            .transition()
                            .duration(this.options.duration)
                            .style("clip-path", "circle(0.5em)")

                        legendItem.append("div")
                            .style("opacity", "0")
                            .text(d => d.id)
                            .transition()
                            .duration(this.options.duration)
                            .style("opacity", "1")
                    })
            )
    }
}