
class RegressionExample {
    constructor(element, data, options = {}) {
        this.element = element
        this.data = data
        this.options = { ...this.defaultOptions(), ...options }
        this.X = [508.61115057, 1198.08008362, 1161.75711837, 1104.85702007,
            1231.23559394, 536.13678177, 1017.83263422, 968.3797697,
            972.11614135, 1240.81003384, 842.76964254, 1026.95566596,
            1269.59270905, 966.27518453, 660.02325357, 771.55916762,
            770.45860788, 736.21210819, 1444.86123946, 810.62003301]
        this.Y = [626959.65607979, 1129946.67272542, 992072.80162306,
            1067678.90743027, 1286403.11000961, 652411.25911178,
            1012154.20715036, 1051531.34645414, 861581.01235994,
            1223473.70980439, 1089188.4840377, 1269155.39760372,
            1422681.34120847, 940690.26073101, 806487.032751,
            687943.40712721, 644192.84255111, 544357.04316407,
            1436155.05615286, 914218.39969812]

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

            lineWidth: "0.15em",
            errorlineWidth: "0.1em",
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
        const xExtent = [500, 1400]
        const yExtent = [300, 1600000]

        yExtent[1] *= 1.1

        if (this.options.startYAtZero && yExtent[0] > 0) {
            yExtent[0] = 0;
        };

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
            .tickFormat(d3.format(".0f"));

        const yAxis = d3.axisLeft()
            .scale(this.yScale)
            .tickFormat(d => {
                var format = d3.format(".2s");
                return '£ ' + format(d)
            })

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
        this.svg.selectAll('#x-axis-label')
            .data(['x-axis-label'])
            .join('text')
            .attr("id", d => d)
            .attr("transform", `translate(${this.width / 2},${this.height - (bottom) + 35})`)
            .style("text-anchor", "middle")
            .text("Square feet")
            .attr('font-size', "0.8em")
    }

    updateLines() {
        var line
        if (this.options.curveLine) {
            this.log('Using curve mode')
            line = d3.line()
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
        this.plot.selectAll("circle.error-data")
            .data(d3.zip(this.X, this.Y))
            .join('circle')
            .transition()
            .duration(this.options.duration)
            .attr("class", `error-data`)
            .attr('cx', d => this.xScale(d[0]))
            .attr('cy', d => this.yScale(d[1]))
            .attr('r', 3)
            .attr('fill', "#28a745")
        const modelY = this.X.map(x => x * this.data[0].gradient)
        const errorLinePoints = d3.zip(this.X, modelY)
        const errorLines = d3.zip(errorLinePoints, d3.zip(this.X, this.Y))
        this.error = 0
        d3.zip(this.Y, modelY).forEach(ys => {
            this.error += Math.abs(ys[1] - ys[0]) / this.X.length
        })
        this.updateError(this.error)

        this.plot.selectAll("circle.error-model")
            .data(errorLinePoints)
            .join('circle')
            .transition()
            .duration(this.options.duration)
            .attr("class", `error-model`)
            .attr('cx', d => this.xScale(d[0]))
            .attr('cy', d => this.yScale(d[1]))
            .attr('r', 3)
        const errorLine = d3.line()
            .x(d => this.xScale(d[0]))
            .y(d => this.yScale(d[1]))
        this.plot.selectAll("path.error")
            .data(errorLines)
            .join('path')
            .attr("class", `error ${this.chart_id}`)
            .attr("d", d => errorLine(d))
            .attr("stroke-width", this.options.errorlineWidth)
            .attr("stroke", '#dc3545')
    }
    updateError(){
        var format = d3.format(".3s");
        const errorLabel = document.querySelector('#errorLabel')
        errorLabel.innerHTML = '£ ' + format(this.error)
        console.log()
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

    updateDataColors() {
        const dataColors = { ...this.dataColors }
        this.data.forEach((d) => {
            if (dataColors[d.id] === undefined) {
                dataColors[d.id] = this.colorIterator.next()
            }
            this.dataColors = dataColors
        })
    }

    getLineColor(d) {
        return d.lineColor || this.dataColors[d.id] || this.options.lineColor
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
            .data(this.data, d => d.id)
            .join(
                enter => enter.append("div")
                    .attr("class", `legendItem ${this.chart_id}`)
                    .style("display", "flex")
                    .style("padding", "4px")
                    .call(legendItem => {
                        legendItem.append("div")
                            .style("background", d => this.getLineColor(d))
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
