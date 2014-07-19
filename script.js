
(function() {
 
  var width = 600;
  var height = 400;
 
   // Create a new object path that would 
   // allow to manipulate geographical data

   
  var path = d3.geo.path();
    //Define the properties for the projection
  var projection = d3.geo.conicConformal() // Lambert-93
          .center([2.454071, 47.279229]) // Centers the map on the center of France
          .scale(2000)
          .translate([width / 2, height / 2]);
 
  path.projection(projection); // Assign the projecttion to the path
 

    // Create a new svg element at the root of div #map, defined in the html
  var svg = d3.select('#map').append("svg")
      .attr("width", width)
      .attr("height", height);
 
    // Create a svg group that will contain all the French departments
  var deps = svg
        .append("g")
      .attr("id", "departements");
 
  
    // load all GeoJSON data
   
  d3.json('http://natachaS.github.io/france_D3_map/departements.json', function(error, geojson) {
    if (error) {
      console.log(error);
      return;
    }
 
    // We bind a svg element for each GeoJSON entry

    var features = deps
            .selectAll("path")
                .data(geojson.features);


    // Use a color scale 

    var colorScale = d3.scale.category20c();
 
    // For each "feature", we create a SVG path element with the following properties

    features.enter()
        .append("path")
            .attr('class', 'departement')
            .attr('fill', function(d) { 
                return colorScale(+d.properties.CODE_DEPT); 
            })
          .attr("d", path)
          .on('click', countyClickHandler);
 
  });
 
// Function that allows to center on the map when you click on it
  var centered;
  function countyClickHandler(d) {
    var x, y, k;
 
    if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 5;
            centered = d;
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
        }
 
        deps.selectAll("path")
            .classed("active", centered && function(d) { return d === centered; });
 
        var trStr = "translate(" + width / 2 + "," + height / 2 + ")" +
            "scale(" + k + ")translate(" + -x + "," + -y + ")";
         
        deps.transition()
            .duration(1000)
            .attr("transform", trStr);
 
    };
 
}());