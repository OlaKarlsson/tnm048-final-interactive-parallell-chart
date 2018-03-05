function stackedBar(imdb, bechdel){
    console.log("StackedBar");
    this.imdb = imdb;
    this.bechdel = bechdel;


  console.log(imdb);
  console.log(bechdel);


  var barDiv = '#stacked-bar';
  var parentWidth = $(barDiv).parent().width();
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = parentWidth - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;


    var svg = d3.select(barDiv).append("svg")
    .attr("width", width)
    .attr("height", height);
    //           .call(zoom);
      
    var g = svg.append("g");


    var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);
    
    var y = d3.scaleLinear().rangeRound([height, 0]);
    
    var z = d3.scaleOrdinal(d3.schemeCategory20);

    var stack = d3.stack();

    //data.sort(function(a, b) { return b.total - a.total; });

  x.domain(bechdel.map(function(d) { return d.year; }));
//   y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
//   z.domain(data.columns.slice(1));

  g.selectAll(".serie")
    .data(stack.keys(bechdel.columns.slice(1))(bechdel))
    .enter().append("g")
      .attr("class", "serie")
    //   .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.year); })
    //   .attr("y", function(d) { return y(d[1]); })
    //   .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

//   g.append("g")
//       .attr("class", "axis axis--y")
//       .call(d3.axisLeft(y).ticks(10, "s"))
//     .append("text")
//       .attr("x", 2)
//       .attr("y", y(y.ticks(10).pop()))
//       .attr("dy", "0.35em")
//       .attr("text-anchor", "start")
//       .attr("fill", "#000")
//       .text("Population");

//   var legend = g.selectAll(".legend")
//     .data(data.columns.slice(1).reverse())
//     .enter().append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
//       .style("font", "10px sans-serif");

//   legend.append("rect")
//       .attr("x", width + 18)
//       .attr("width", 18)
//       .attr("height", 18)
//       .attr("fill", z);

//   legend.append("text")
//       .attr("x", width + 44)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .attr("text-anchor", "start")
//       .text(function(d) { return d; });




}

function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  }