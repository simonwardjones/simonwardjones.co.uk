// Line chart in es6
//import 'd3'

class LineChart {
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

            // svgBackground: "salmon",
            startYAtZero: false,
            minY: null,
            maxY: null,

            lineWidth: "0.2em",
            curveLine: true,
            lineColor: "blue",

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
        this.updateDataColors()
        this.updateSVG()
        this.updateStyles()
        this.updateScales()
        this.updateConfidenceIntervals()
        this.updateAxis()
        this.updateLines()
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

        // find extents for each line then find overall extent
        const extents = [0, 1].map(i => {
            let axisExtents = []
            this.data.forEach(line => {
                d3.extent(line.values, d => d[i]).forEach(x => axisExtents.push(x))
            })
            return axisExtents
        }).map(axis => d3.extent(axis))
        const [xExtent, yExtent] = extents

        yExtent[1] *= 1.1

        if (this.options.startYAtZero && yExtent[0] > 0) {
            yExtent[0] = 0;
        };

        if (this.options.minY !== null) {
            yExtent[0] = this.options.minY
        }
        if (this.options.maxY !== null) {
            yExtent[1] = this.options.maxY
        }

        this.xScale = d3.scaleLinear()
            .range([0, this.width - (left + right)])
            .domain(xExtent);

        this.yScale = d3.scaleLinear()
            .range([this.height - (top + bottom), 0])
            .domain(yExtent);
    }

    getAxis() {
        const xAxis = d3.axisBottom()
            .scale(this.xScale)
            .tickFormat(d3.format(".1f"));

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

    updateLines() {
        var line
        if (this.options.curveLine) {
            this.log('Using curve mode')
            line = d3.line().curve(d3['curveNatural'])
                .x(d => this.xScale(d[0]))
                .y(d => this.yScale(d[1]))
        } else {
            line = d3.line()
                .x(d => this.xScale(d[0]))
                .y(d => this.yScale(d[1]))
        }
        this.plot.selectAll("path.series")
            .data(this.data, d => {
                return d.id
            })
            .join(
                enter => enter.append("path")
                    .attr("class", `series ${this.chart_id}`)
                    .attr("id", d => d.id)
                    .attr("d", d => line(d.values))
                    .attr("stroke", d => this.getLineColor(d))
                    .attr("fill", "none")
                    .attr("stroke-width", this.options.lineWidth)
                    .attr("stroke-dasharray", d => d.dashArray ? "5,5" : "0")
                    .attr("opacity", 0)
                    .call(enter =>
                        enter.transition()
                            .duration(this.options.duration)
                            .attr("opacity", 1))
                ,
                update => update.call(update =>
                    update.transition()
                        .duration(this.options.duration)
                        .attrTween("d", d => {
                            // Warning! selection.select propagates data so don't do
                            // this.plot.select !
                            var previous = d3.select(`.${this.chart_id}#${d.id}`).attr("d")
                            var current = line(d.values)
                            return d3.interpolatePath(previous, current);
                        })
                )
                ,
                exit => exit
                    .call(exit =>
                        exit.transition()
                            .duration(this.options.duration)
                            .attr("opacity", 0)
                            .remove(),
                    )
            )
    }
    updateConfidenceIntervals() {
        // if confidenceIntervals key in data then we plot confidence intervals
        var area
        if (this.options.curveLine) {
            this.log('Using curve mode')
            area = d3.area().curve(d3['curveNatural'])
                .x(d => this.xScale(d[0]))
                .y0(d => this.yScale(d[1]))
                .y1(d => this.yScale(d[2]))
        } else {
            area = d3.area()
                .x(d => this.xScale(d[0]))
                .y0(d => this.yScale(d[1]))
                .y1(d => this.yScale(d[2]))
        }
        this.plot.selectAll("path.confidence")
            .data(this.data.filter(d => d.confidenceIntervals !== undefined), d => d.id)
            .join(
                enter => enter.append("path")
                    .attr("class", `confidence ${this.chart_id}`)
                    .attr("id", d => `confidence-${d.id}`)
                    .attr("fill", d => this.getLineColor(d, true))
                    .attr("opacity", 0.3)
                    .attr("stroke", "none")
                    .attr("d", d => area(d.confidenceIntervals)
                    )
                ,
                update => update.call(update =>
                    update.transition()
                        .duration(this.options.duration)
                        .attrTween("d", d => {
                            var previous = d3.select(`.${this.chart_id}#confidence-${d.id}`)
                            previous = previous.attr("d")
                            var current = area(d.confidenceIntervals)
                            return d3.interpolatePath(previous, current);
                        })
                ),
                exit => exit
                    .call(exit =>
                        exit.transition()
                            .duration(this.options.duration)
                            .attr("opacity", 0)
                            .remove(),
                    )

            )

    }


    /* Create color wheel*/
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

    updateDataColors() {
        const dataColors = { ...this.dataColors }
        this.data.forEach((d) => {
            if (dataColors[d.id] === undefined) {
                dataColors[d.id] = this.colorIterator.next()
            }
            this.dataColors = dataColors
        })
    }
    // lighten the color for interval
    getLighterColor(color) {
        return d3.color(color).brighter(1).hex()
    }

    getLineColor(d, interval = false) {
        let color = d.lineColor || this.dataColors[d.id] || this.options.lineColor
        if (interval) {
            return this.getLighterColor(color)
        }
        return color
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

        // note we condense data to unique legend items based on legendGroup or id if no legendGroup
        let legendData = this.data.reduce((acc, d) => {
            let key = d.legendGroup || d.id
            if (!acc.find(x => x.id === key)) {
                acc.push({ id: key, legendGroup: d.legendGroup, lineColor: d.lineColor })
            }
            return acc
        }, [])

        let legendItems = legend.selectAll("div.legendItem")
            .data(legendData, d => d.id)
            .join(
                enter => enter.append("div")
                    .attr("class", `legendItem ${this.chart_id}`)
                    .style("display", "flex")
                    .style("padding", "4px")
                    .call(legendItem => {
                        legendItem.append("div")
                            .style("background", d => this.getLineColor(d))
                            .style("height", "100%")
                            .attr('id', d => d.legendGroup || d.id)
                            .style("width", "1em")
                            .style("margin-right", "0.5em")
                            .style("clip-path", "circle(0)")
                            .transition()
                            .duration(this.options.duration)
                            .style("clip-path", "circle(0.5em)")

                        legendItem.append("div")
                            .style("opacity", "0")
                            .text(d => d.legendGroup || d.id)
                            .transition()
                            .duration(this.options.duration)
                            .style("opacity", "1")
                    })
            )
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

}

// For a next version create base chart and
// then extend to other chart types e.g.
// class LineChart extends Chart { }
