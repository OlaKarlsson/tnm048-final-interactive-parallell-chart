function paralellChart() {


  // var data = [];
  // for (let i = 0; i < 20; i++) {
  //   data.push(mergedData[i]);
  // }
  var pcChartDiv = '#pc-chart';
  var svg;
  var x;
  var axes;
  var dimensions;
  var foreground, background, projection;

  var parentWidth = $(pcChartDiv).parent().width();
    var margin = { top: 40, right: 0, bottom: 10, left: 100 },
      width = parentWidth - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


  var line = d3.line()
    .defined(function (d) { return !isNaN(d[1]); });

  //Y axis orientation
  var yAxis = d3.axisLeft();




  this.init = function (initData) {

    console.log("PC Init");

    

    //dimensions for the axes.
    //Caution: Attributes in the function needs to be changed if  data file is changed
    dimensions = axesDims(height);
    dimensions.forEach(function (dim) {
      dim.scale.domain(dim.type === "number"
        ? d3.extent(initData, function (d) { return +d[dim.name]; })
        : initData.map(function (d) { return d[dim.name]; }).sort());
    });

    svg = d3.select(pcChartDiv).append("svg")
      .attr("id","pc_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x = d3.scaleBand()
      .domain(dimensions.map(function (d) { return d.name; }))
      //Domain set the input boundries, .map on the dimensions, runs it once for each in the array
      .range([0, width]);


    axes = svg.selectAll(".axes")
      .data(dimensions)//Feed in the data from dimensions
      .enter()
      .append("g").attr("class", "dimension")
      .attr("transform", function (d) {
        return "translate(" + x(d.name) + ")";
      });;
    //Set up the axes

    //add the text/numbers
    axes.append("g")
      .attr("class", "axis")
      .each(function (d) { d3.select(this).call(yAxis.scale(d.scale)); })
      .append("text")
      .attr("class", "title")
      .style('fill', 'black')
      .style('font-size', '9px')
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(function (d) { return d.name; });

      this.update(initData);

  }



  this.update = function (rawData, selected) {

    d3.select("#pc_svg").remove();
    console.log("PC update");

    let data=[];

    if (selected) {
      d3.select("#year-label").text(selected.year);

      var filteredData = [];
      for (let i = 0; i < rawData.length; i++) {
        const movie = rawData[i];
        if (movie.title_year === selected.year) {
          filteredData.push(movie);
        }
      }
      
      data = filteredData;
    }else{
      data = rawData;
    }
    

    dimensions = axesDims(height);
    dimensions.forEach(function (dim) {
      dim.scale.domain(dim.type === "number"
        ? d3.extent(data, function (d) { return +d[dim.name]; })
        : data.map(function (d) { return d[dim.name]; }).sort());
    });

    svg = d3.select(pcChartDiv).append("svg")
      .attr("id","pc_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x = d3.scaleBand()
      .domain(dimensions.map(function (d) { return d.name; }))
      //Domain set the input boundries, .map on the dimensions, runs it once for each in the array
      .range([0, width]);

    axes = svg.selectAll(".axes")
      .data(dimensions)//Feed in the data from dimensions
      .enter()
      .append("g").attr("class", "dimension")
      .attr("transform", function (d) {
        return "translate(" + x(d.name) + ")";
      });;
    //Set up the axes

    //add the text/numbers
    axes.append("g")
      .attr("class", "axis")
      .each(function (d) { d3.select(this).call(yAxis.scale(d.scale)); })
      .append("text")
      .attr("class", "title")
      .style('fill', 'black')
      .style('font-size', '9px')
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(function (d) { return d.name; });

    var colours = ["red", "yellow", "orange", "green"];
    //Add color here
    background = svg.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(data)
      .enter().append("path")
      .attr("d", draw);

    foreground = svg.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(data)
      .enter().append("path")
      .attr("d", draw)
      .style("stroke", function (d) {
        return colours[d["bechdel_rating"]];//Get the colour by using the bechdel rating as key
      })

      axes.append("g")
          .attr("class", "brush")
          /* ~~ Add brush here */
          .each(function (d) {
            d3.select(this).call(d.brush = d3.brushY()
                .extent([[-10, 0], [10, height]])
                .on("start", brushstart)
                .on("brush", brush)
                .on("end", brush))
          })
          .selectAll("rect")
          .attr("x", -10)
          .attr("width", 20);


            // //Select lines for mouseover and mouseout
      projection = svg.selectAll(".background path, .foreground path")
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);

  }





  //Tooltip
  var tooltip = d3.select(pcChartDiv).append("div")
       .attr("class", "tooltip")
       .style("opacity", 0);





  function mouseover(d) {

    //Only show then active..
    tooltip.transition().duration(200).style("opacity", .9);
    var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
    tooltip.attr(
      "style",
      "left:"+(mouse[0]+30)+
      "px;top:"+(mouse[1]+40)+"px")
      .html(d.movie_title);

    svg.classed("active", true);

    // this could be more elegant
    if (typeof d === "string") {
      projection.classed("inactive", function(p) { return p.name !== d; });
      projection.filter(function(p) { return p.name === d; }).each(moveToFront);

    } else {
      projection.classed("inactive", function(p) { return p !== d; });
      projection.filter(function(p) { return p === d; }).each(moveToFront);
    }
  }

  function mouseout(d) {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    svg.classed("active", false);
    projection.classed("inactive", false);
  }

  function moveToFront() {
    this.parentNode.appendChild(this);
  }

  function draw(d) {
    return line(dimensions.map(function(dim) {
      return [x(dim.name), dim.scale(d[dim.name])];
    }));
  }

  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush(d) {

    var actives = [];
    svg.selectAll(".dimension .brush")
    .filter(function(d) {
      return d3.brushSelection(this);
    })
    .each(function(d) {
      actives.push({
        dim: d,
        extent: d3.brushSelection(this)
      });
    });

    foreground.style("display", function (d) {
        return actives.every(function (active) {
           var dim = active.dim;
           var ext = active.extent;
           var l = within(d, ext, dim);
           return l;
        }) ? null : "none";
    });

    function within(d, extent, dim) {
      var w =  dim.scale(d[dim.name]) >= extent[0]  && dim.scale(d[dim.name]) <= extent[1];


      if(w){
          /* ~~ Call the other graphs functions to highlight the brushed.~~*/
          // sp.selectDots(w);
          // countriesArray.push(d);
          // console.log(countriesArray);
          // sp.selectDots(countriesArray);
      }

      return w;
    };


  } //Brush

  //Select all the foregrounds send in the function as value
  this.selectLine = function (value) {
    /* ~~ Select the lines ~~*/
  };

  function axesDims(height) {
    return [
      {
        name: "movie_title",
        scale: d3.scaleBand().range([0, height]),
        type: "string"
      },
      {
        name: "movie_facebook_likes",
        scale: d3.scaleLinear().range([height, 0]),
        type: "number"
      },
      {
        name: "director_facebook_likes",
        scale: d3.scaleLinear().range([height, 0]),
        type: "number"
      },
      {
        name: "num_voted_users",
        scale: d3.scaleLinear().range([height, 0]),
        type: "number"
      },
      {
        name: "imdb_score",
        scale: d3.scaleLinear().range([height, 0]),
        type: "number"
      },
      {
        name: "bechdel_rating",
        scale: d3.scaleLinear().range([height, 0]),
        type: "number"
      },

    ];
  }

}
