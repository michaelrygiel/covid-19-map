
// Variables for global use
var currentStateID = 0;
var stateView = true;
var country;
var showActualData = true;

var margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right:10
}, width = parseInt(d3.select('.us-map-visualization').style('width'))
    , width = width - margin.left - margin.right
    , mapRatio = 0.5
    , height = width * mapRatio
    , active = d3.select(null);

var svg = d3.select('.us-map-visualization').append('svg')
    .attr('class', 'center-container')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right);

svg.append('rect')
    .attr('class', 'background center-container')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .on('click', clicked);

const usMapDataPromise = Promise.resolve(d3.json('data/us-counties.topojson'));
const usPopulationDataPromise = Promise.resolve(d3.csv('data/co-est2019-alldata.csv'));
const coronavirusDataPromise = Promise.resolve(d3.csv('data/coronavirusCountyData.csv'));
const statesDataPromise = Promise.resolve(d3.dsv('|', 'data/states.txt'));
const countiesDataPromise = Promise.resolve(d3.csv('data/counties.csv'));
Promise.all([
    usMapDataPromise,
    usPopulationDataPromise,
    coronavirusDataPromise,
    statesDataPromise,
    countiesDataPromise])
    .then(ready);

var projection = d3.geoAlbersUsa()
    .translate([width /2 , height / 2])
    .scale(width);

var path = d3.geoPath()
    .projection(projection);

var g = svg.append("g")
    .attr('class', 'center-container center-items us-state')
    .attr('transform', 'translate('+margin.left+','+margin.top+')')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

function ready(promiseData) {
    let usMapData = promiseData[0];
    country = generateCountry(promiseData);

    g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(topojson.feature(usMapData, usMapData.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "county-boundary")
        .attr("id", d => { return d.id; })
        .on("click", reset)
        .on('mouseenter', function(d) {
            return hoverCounties(d.id);
        })
        .on('mouseleave', hoverStates);

    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(topojson.feature(usMapData, usMapData.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "state")
        .attr("id", d => { return d.id; })
        .on("click", clicked)
        .on('mouseenter', function(d) {
            return hoverStates(d.id);
        })
        .on('mouseleave', hoverShowUS);


    g.append("path")
        .datum(topojson.mesh(usMapData, usMapData.objects.states, function(a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", path);

    initialize();
}

function initialize() {
    hoverShowUS();
    changeColors();
}

function clicked(d) {
    stateView = true;

    // If the background is clicked, return to full size
    if (d3.select('.background').node() === this) return reset();

    // If clicked on the active state, return to full size
    if (active.node() === this) return reset();

    // Else, zoom in to state
    stateView = false;
    currentStateID = d.id;
    changeColors();

    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.transition()
        .duration(1000)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    stateView = true;
    currentStateID = 0;

    g.transition()
        .delay(100)
        .duration(1000)
        .style("stroke-width", "1.5px")
        .attr('transform', 'translate('+margin.left+','+margin.top+')');
}
