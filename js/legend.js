function updateLegend(scale) {
    let w = $(".map-legend").width() * 0.80;
    let h = 50;
    legend({
        color: scale,
        width: w,
        height: h,
        title: CoronavirusCasesRadioButton.getTitle() + ' ' + PopulationRadioButton.getTitle()
    })
}

function scaleDoesNotExist() {
    return $(".map-legend-gradient").length === 0;
}

function createTicks(svg, height, marginBottom, x, ticks, tickFormat, tickSize, tickValues, tickAdjust, marginLeft, marginTop, title) {
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 16)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "regular")
            .attr("font-size", "1rem")
            .text(title));
}

function createColorGradient(svg, width, height) {
    var legend = svg.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "beige")
        .attr("stop-opacity", 1);

    legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "red")
        .attr("stop-opacity", 1);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height - 30)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0,10)");
}

/*
Code From:
https://observablehq.com/@d3/color-legend
https://bl.ocks.org/duspviz-mit/9b6dce37101c30ab80d0bf378fe5e583
 */
function legend({
                    color,
                    title,
                    tickSize = 6,
                    width = 320,
                    height = 44 + tickSize,
                    marginTop = 18,
                    marginRight = 0,
                    marginBottom = 16 + tickSize,
                    marginLeft = 0,
                    ticks = width / 96,
                    tickFormat,
                    tickValues
                } = {}) {

    const n = Math.min(color.domain().length, color.range().length);
    let x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);

    if (scaleDoesNotExist()) {
        const svg = d3.select(".map-legend").append("svg")
            .attr("class", "map-legend-gradient")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .style("overflow", "visible")
            .style("display", "block");

        createColorGradient(svg, width, height);

        createTicks(svg, height, marginBottom, x, ticks, tickFormat, tickSize, tickValues, tickAdjust, marginLeft, marginTop, title);
    }

    else {
        const svg = d3.select(".map-legend").select("svg");

        svg.selectAll("g").remove();

        createTicks(svg, height, marginBottom, x, ticks, tickFormat, tickSize, tickValues, tickAdjust, marginLeft, marginTop, title);
    }

}
