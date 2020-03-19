// @TODO: YOUR CODE HERE!
// automatically resize the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select('body').select('svg');

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Set up svg Margins
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 20,
        bottom: 60,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create SVG wrapper, append SVG group to hold chart, shift the latter by margins
    var svg = d3.select('#scatter')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


    d3.csv('./assets/data/data.csv').then(function(data) {

        // Step 1: Gather necessary data elements from csv and cast as numbers
    var age = data.map(data => +data.age);
    var income = data.map(data => +data.income);
    var healthcare = data.map(data => +data.healthcare);
    var poverty = data.map(data => +data.poverty);
    var stateAbv = data.map(data => data.abbr);

        // Step 2: Create Scale Functions
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(poverty), d3.max(poverty)])
            .range([0,width]);

        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(healthcare), d3.max(healthcare)])
            .range([height,0])

        // Step 3: Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to Chart
        chartGroup.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append('g')
            .call(leftAxis);

        // Step 5: Create Circles
        var circlesGroup = chartGroup.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xLinearScale(d.poverty))
            .attr('cy', d => yLinearScale(d.healthcare))
            .attr('r', '10')
            .attr('fill', 'skyblue')
           

        var textGroup = chartGroup.selectAll('text')
            .exit()
            .data(data)
            .enter()
            .append('text')
            .text(function (d) {
                return `${d.abbr}`
            })
            .attr('x', d => xLinearScale(d.poverty))
            .attr('y', d => yLinearScale(d.healthcare) + 3)
            .attr('text-anchor', 'middle')
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "white");

        textGroup

        // Step 9: Create Axes Labels
        chartGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left + 40)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .attr('class', 'axisText')
            .text('Lacks Healthcare (%)');

        chartGroup.append('text')
            .attr('transform', `translate(${width/ 2}, ${height + margin.top + 30})`)
            .attr('class', 'axisText')
            .text('In Poverty (%)')



    }).catch(function(error) {
        console.log(error);
    });
}

// When the browser loads, call MakeResponsive
makeResponsive();

d3.select(window).on('resize', makeResponsive);