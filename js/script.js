
d3.select("input[value=\"total\"]").property("checked", true);

datasetTotal = [
    {label:"Cohort 1", value:10},
    {label:"Cohort 2", value:20},
    {label:"Cohort 3", value:26},
    {label:"Cohort 4", value:22},
    {label:"Cohort 5", value:19},
    {label:"Cohort 6", value:1},
    {label:"Cohort 7", value:0},
    {label:"Cohort 8", value:1},
    {label:"Cohort 9", value:0},
    {label:"Cohort 10", value:1}
];

datasetOption1 = [
    {label:"Cohort 1", value:22},
    {label:"Cohort 2", value:33},
    {label:"Cohort 3", value:4},
    {label:"Cohort 4", value:15},
    {label:"Cohort 5", value:36},
    {label:"Cohort 6", value:0},
    {label:"Cohort 7", value:7},
    {label:"Cohort 8", value:17},
    {label:"Cohort 9", value:20},
    {label:"Cohort 10", value:7}
];

datasetOption2 = [
    {label:"Cohort 1", value:10},
    {label:"Cohort 2", value:20},
    {label:"Cohort 3", value:30},
    {label:"Cohort 4", value:5},
    {label:"Cohort 5", value:12},
    {label:"Cohort 6", value:20},
    {label:"Cohort 7", value:2},
    {label:"Cohort 8", value:20},
    {label:"Cohort 9", value:6},
    {label:"Cohort 10", value:50}
];

d3.selectAll("input").on("change", selectDataset);

function selectDataset() {
    var value = this.value;
    if (value == "total") {
        change(datasetTotal);
    }
    else if (value == "option1"){
        change(datasetOption1);
    }
    else if (value == "option2") {
        change(datasetOption2);
    }
}

var margin = {top: (parseInt(d3.select('body').style('height'), 10)/10), right: (parseInt(d3.select('body').style('width'), 10)/20), bottom: (parseInt(d3.select('body').style('height'), 10)/10), left: (parseInt(d3.select('body').style('width'), 10)/20)},
width = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right,
height = parseInt(d3.select('body').style('height'), 10) - margin.top - margin.bottom;

var div = d3.select("body").append("div").attr("class", "toolTip");
var formatPercent = d3.format("");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2, .5);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    change(datasetTotal);

function change(dataset) {

    x.domain(dataset.map(function(d) { return d.label; }));
    y.domain([0, d3.max(dataset, function(d) { return d.value; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.select(".y.axis").remove();
    svg.select(".x.axis").remove();

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Contacts #");

var bar = svg.selectAll(".bar")
    .data(dataset, function(d) { return d.label; });
    // new data:
    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.label); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand());

    bar.on("mousemove", function(d){
        div.style("left", d3.event.pageX+10+"px");
        div.style("top", d3.event.pageY-25+"px");
        div.style("display", "inline-block");
        div.html((d.label)+"<br>"+(d.value)+"%");
    });
    bar.on("mouseout", function(d){
        div.style("display", "none");
    });

    // removed data:
    bar.exit().remove();
    // updated data:
    bar.transition()
        .duration(1500)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value);
    });
};
