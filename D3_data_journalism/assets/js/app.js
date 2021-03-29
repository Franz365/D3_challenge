// SVG wrapper dimensions
var svgWidth = 1200;
var svgHeight = 660;

// Margins
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

// chart area minus margins
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// create svg wrapper
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

// shift everything over by the margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
    
    // Parsing data
    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // create scale function
    // x scale
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.obesity) * 0.8, d3.max(censusData, d => d.obesity) * 1.1])
      .range([0, width]);

    // y scale
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.poverty) * 0.8, d3.max(censusData, d => d.poverty) * 1.1])
      .range([height, 0]);

    // function used for updating Axis var upon click on axis label
    // xAxis
    var bottomAxis = d3.axisBottom(xLinearScale);
    // yAxis
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".7");

    // Create label for data points
    chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(lifeData)
    .enter()
    .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.poverty - 0);
      })
      .attr("y", function(data) {
          return yLinearScale(data.healthcare - 0.2);
      })
      .text(function(data) {
          return data.abbr
      });

    // Create labels for axis

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (svgHeight / 2))
        .attr("dy", "1em")  
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
}).catch(function(error) {
    console.log(error);
});