var svgWidth = 760;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("../data/data.csv")
  .then(function(data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
      //console.log(data.smokes);
      //console.log(data.age);
      
      //console.log("data.age");
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      //.domain([0, d3.max(data, d => d.smokes)])
      //.domain([8.3,30])
      .domain([29.3, 45])
      .range([0, width],2);

    var yLinearScale = d3.scaleLinear()
      //.domain([0, d3.max(data, d => d.age)])
      //.domain([24.3, 45])
      .domain([8.3,30])
      .range([height, 0],2);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================

    //wrapped your circles and texts inside a <g>
    //=============================================

    var circlesGroup = chartGroup.selectAll("g.dot")
    .data(data)
    .enter()
    .append("g");

    //circles
    //===========

    circlesGroup.append("circle")
    .attr("class", "dot")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "lightblue");
    // .append("text").text(function(d) { return d.state;})
    // .attr("opacity", ".5");
    //.attr("class", "circleText");

    //Adding state name inside the circles
    //=======================================
    circlesGroup.append("text").text(function(d){
      return d.abbr;
    })
    .attr("x",d => xLinearScale(d.age))
    .attr("y", d => yLinearScale(d.smokes))
    .attr("text-anchor", "middle")
    .attr('fill', 'white')
    .attr('font-size', 10);
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        //var state = d.abbr;
        return (`${d.state}<br>Smokes: ${d.smokes}<br>Age: ${d.age}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "5px")
      .attr("class", "axisText")
      .style("text-anchor", "middle")
      .text("Smokes(%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .style("text-anchor", "middle")
      .text("Age(Median)");
  });
