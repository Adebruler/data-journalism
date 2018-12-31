
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select paragraphs to change visibilty with selected x-axis
// var p_poverty = d3.selectall("p_poverty");
// var p_age = d3.selectall("#p_age");
// var p_income = d3.selectall("#p_income");

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(newsData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(newsData, d => d[chosenXAxis]) * 0.8,
      d3.max(newsData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating x-scale var upon click on axis label
function yScale(newsData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.max(newsData, d => d[chosenYAxis]) * 1.1, 0])
    .range([0, height]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderText(circlesText, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  circlesText.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]) - 6)
    .attr("dy", d => newYScale(d[chosenYAxis]) + 3);

  return circlesText;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAXis, elemEnter) {

  switch (chosenXAxis){
    case "poverty":
      var xlabel = "Poverty (%):"
      break;
    case "age":
      var xlabel = "Age (Median):"
      break;
    case "income":
      var xlabel = "Median Houselhold Income (USD):"
      break;
  }
  switch (chosenYAxis){
    case "obesity":
      var ylabel = "Obesity (%):"
      break;
    case "smokes":
      var ylabel = "Smokes (%)):"
      break;
    case "healthcare":
      var ylabel = "Lacks Healthcare (%):"
      break;
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<hr>
        ${xlabel} ${d[chosenXAxis]}<br>
        ${ylabel} ${d[chosenYAxis]}`);
    });

  elemEnter.call(toolTip);

  elemEnter.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return elemEnter;
}

// Retrieve data from the CSV file and execute everything below
const csv = "../../data/data_2.csv"

d3.csv(csv).then(function(newsData) {

  console.log(newsData);

  // parse data
  newsData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.obesity = +data.obesity;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(newsData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(newsData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append x axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);


        /* Define the data for the circles */
        var elem = svg.selectAll(".blockg")
            .data(newsData)

        /*Create and place the "blocks" containing the circle and the text */
        var elemEnter = elem.enter()
            .append("g")
            .attr("class","blockg")
            .attr("transform", d => `translate(${margin.left},0)`)

        /*Create the circle for each block */
        var circlesGroup = elemEnter.append("circle")
          .attr("cx", d => xLinearScale(d[chosenXAxis]))
          .attr("cy", d => yLinearScale(d[chosenYAxis]))
          .attr("r", 10)
          .attr("stroke", "white")
          .attr("stroke-width", "1")
          .attr("fill", "darkseagreen")
          .attr("opacity", "1")

        /* Create the text for each block */
        var circlesText = elemEnter.append("text")
          .text(d => d.abbr)
          .attr("dx", d => xLinearScale(d[chosenXAxis]) - 6)
          .attr("dy", d => yLinearScale(d[chosenYAxis]) + 3)
          .attr("fill", "white")
          .attr("id","abbr");

  // append initial circles
  // var circlesGroup = chartGroup.selectAll("circle")
  //   .data(newsData)
  //   .enter()
  //   .append("circle")
  //     .attr("cx", d => xLinearScale(d[chosenXAxis]))
  //     .attr("cy", d => yLinearScale(d[chosenYAxis]))
  //     .attr("r", 10)
  //     .attr("stroke", "white")
  //     .attr("stroke-width", "1")
  //     .attr("fill", "lightseagreen")
  //     .attr("opacity", "1")

  // Create group for  3 x- axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Household Income (USD)");

  // Create group for  3 y-axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var obesityLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height/2))
    .attr("y", 20 - margin.left)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obesity (%)");

  var smokesLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height/2))
    .attr("y", 40 - margin.left)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height/2))
    .attr("y", 60 - margin.left)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");


  // updateToolTip function above csv import
  var elemEnter = updateToolTip(chosenXAxis, chosenYAxis, elemEnter);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(newsData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circlesText = renderText(circlesText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        elemEnter = updateToolTip(chosenXAxis, chosenYAxis, elemEnter);

        // changes classes to change bold text
        switch(chosenXAxis){
          case 'age':
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            p_age
              .classed("invisible", true);
            p_poverty
              .classed("invisible", false);
            p_income
              .classed("invisible", false);
            break;
          case 'poverty':
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            p_age
              .classed("invisible", false);
            p_poverty
              .classed("invisible", true);
            p_income
              .classed("invisible", false);
            break;
          case 'income':
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            p_age
              .classed("invisible", false);
            p_poverty
              .classed("invisible", false);
            p_income
              .classed("invisible", true);
            break;

        }
      }
    });

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

          // replaces chosenXAxis with value
          chosenYAxis = value;


          // functions here found above csv import
          // updates y scale for new data
          yLinearScale = yScale(newsData, chosenYAxis);

          // updates y axis with transition
          yAxis = renderYAxis(yLinearScale, yAxis);

          // updates circles with new y values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          circlesText = renderText(circlesText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // updates tooltips with new info
          elemEnter = updateToolTip(chosenXAxis, chosenYAxis, elemEnter);

          // changes classes to change bold text
          switch(chosenYAxis){
            case 'obesity':
              obesityLabel
                .classed("active", true)
                .classed("inactive", false);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case 'smokes':
              obesityLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesLabel
                .classed("active", true)
                .classed("inactive", false);
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case 'healthcare':
              obesityLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
              break;
          }
        }
      }

  );
});
