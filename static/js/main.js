var bar, 
stackedBar, 
pc;

queue()
.defer(d3.json,'static/data/merged_all_imdb_bechdel.json')
.await(draw);





function draw(error, data) {
  if (error) throw error;
  bar = new bar(data);

  pc = new paralellChart(data);
  pc.update();
   

}

document.getElementById("reset-pc").addEventListener("click", function( event ) {
   
  //Reset the PC
  pc.update();

  //Remove the selected class from bar chart
  if (document.getElementsByClassName('selected').length > 0) {
    document.getElementsByClassName('selected').item(0).classList.remove("selected");
   }
 }, false);
