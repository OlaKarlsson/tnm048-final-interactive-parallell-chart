queue()
// .defer(d3.csv,'static/data/IMDB_movies/imdb_movie_metadata.csv')
// .defer(d3.csv,'static/data/Bechdel_dataset/bechdel_allmovies.csv')
// .defer(d3.csv,'static/data/data.csv')
.defer(d3.csv,'static/data/merged_all_imdb_bechdel.csv')
.await(draw);

var bar, 
stackedBar, 
pc, 
brushBar;

// var timeFmt = d3.timeParse("%Y");


function draw(error, data) {
  if (error) throw error;
  bar = new bar(data);

  pc = new paralellChart();
  pc.init(data);
  

  // // format the data to numbers
  // mergedData.forEach(function (d) {
  //   d.title_year = +d.title_year;
  //   d.bechdel_rating = Number(d[" bechdel_rating "]);
  // });


  // //Using the Crossfilter library
  // var cfData = crossfilter(mergedData);
  // // We create dimensions for each attribute we want to filter by
  // cfData.dimYear = cfData.dimension(function (d) { return d.title_year; });
  // cfData.dimYear.filter(function(d) {return d > 2015});//Filer by movies after 1990
  // cfData.dimBechdel = cfData.dimension(function (d) { return d.bechdel_rating; });
  // // cfData.years = cfData.dimYear.filterFunction(function(d) { return d.value > 100; })
  // cfData.bechdel = cfData.dimBechdel.group(function(d) {return d.title_year;});

  // var test = cfData.dimYear.filter(function(d) {return d > 2015});//Filer by movies after 1990

  // //cfData.dimYear.filter(function(d) {return d > 1990}).group().top(Infinity)

  // brushBar = barChart()
  // .width(1300)
  // .x(function (d) { return d.key;})
  // .y(function (d) { return d.value;});

  // d3.select("#brush-bar-chart")
  //     .datum(test.group().all())
  //     .call(brushBar);

  

}
