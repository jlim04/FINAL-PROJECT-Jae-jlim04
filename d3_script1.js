
let width = d3.select("#myChart").node().getBoundingClientRect().width
let height = 500
const sensitivity = 75
let topo;

// tooltip
var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);



let projection = d3.geoOrthographic()
  .scale(250)
  .center([0, 0])
  .rotate([0, -30])
  .translate([width / 2, height / 2])


const initialScale = projection.scale()
let path = d3.geoPath().projection(projection)

let svg = d3.select("#myChart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

let globe = svg.append("circle")
  .attr("fill", "#eeeeff")
  .attr("stroke", "#000")
  .attr("stroke-width", "0.2")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", initialScale)

svg.call(d3.drag().on('drag', () => {
  const rotate = projection.rotate()
  const k = sensitivity / projection.scale()
  projection.rotate([
    rotate[0] + d3.event.dx * k,
    rotate[1] - d3.event.dy * k
  ])
  path = d3.geoPath().projection(projection)
  svg.selectAll("path").attr("d", path)
}))
  .call(d3.zoom().on('zoom', () => {
    if (d3.event.transform.k > 0.3) {
      projection.scale(initialScale * d3.event.transform.k)
      path = d3.geoPath().projection(projection)
      svg.selectAll("path").attr("d", path)
      globe.attr("r", projection.scale())
    }
    else {
      d3.event.transform.k = 0.3
    }
  }))

let data = d3.map();
let map = svg.append("g")
let colorScale = d3.scaleLinear()
  .domain([0, 1, 30, 60])
  .range(["lightgray", "red", "green", "blue"]);


// Load external data and boot
d3.queue()
  .defer(d3.json, "data/world.json")
  .defer(d3.csv, "data/World Cup Data Visualization - Sheet1.csv", function(d) {
    data.set(d["Country Code"], d);
  })
  .await(drawGlobe);


function drawGlobe(error, topoData) {
  if (topoData) {
    topo = topoData;
  }


  let finalsCheckbox = document.getElementById("finals");

  let semifinalsCheckbox = document.getElementById("semifinals");

  let quarterfinalsCheckbox = document.getElementById("quarterfinals");

  let RO16Checkbox = document.getElementById("RO16");

  let groupstageCheckbox = document.getElementById("GroupStage");

  map.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(topo.features)
    .enter().append("path")
    .attr("class", d => "country_" + d.properties.name.replace(" ", "_"))
    .attr("d", path)
    .attr("fill", (d) => {
      return "white";
    })
    .style('stroke', 'black')
    .style('stroke-width', 0.3)
    // .style("opacity", 0.8)

    .attr("fill", function(d) {
      let country = data.get(d.id);

      if (!country) return colorScale(0);


      let stage = country["What Round Exit"];
      if (stage == "Group Stage" && groupstageCheckbox.checked) {
        return colorScale(10);
      }
      else if (stage == "Round of 16" && RO16Checkbox.checked) {
        return colorScale(20);
      }
      else if (stage == "Quarterfinals" && quarterfinalsCheckbox.checked) {
        return colorScale(30);
      }
      else if (stage == "Semi Finals" && semifinalsCheckbox.checked) {
        return colorScale(40);
      }
      else if (stage == "Finals" && finalsCheckbox.checked) {
        return colorScale(50);
      }
      else return colorScale(0);
    })

    .on('mouseenter', function(d) {
      let country = data.get(d.id);
      // console.log(country);
      if (!country) return;


      d3.select("#country").html(country.Country)
      d3.select("#country").html(country['Country Code'])


      // tooltip show
      div.transition()
        .duration(200)
        .style("opacity", .9);



      let newHTML = `
        <div><strong> ${country.Country}</strong></div>
        <div><strong>Country Code</strong>: ${country['Country Code']}</div>
        <div><strong>What Round Exit</strong>: ${country['What Round Exit']}</div>
        <div><strong>Total Goals</strong>: ${country['Total Goals']}</div>
        <div><strong>Total Conceded</strong>: ${country['Total Conceded']}</div>
        <div><strong>Win Ratio</strong>: ${country['Win Ratio']}</div>
        <div><strong>Average Possession Ratio</strong>: ${country['Average Possession Ratio']}</div>
        <div><strong>Average Goals Scored</strong>: ${country['Average Goals Scored:']}</div>
        <div><strong>Average Goals Conceded</strong>: ${country['Average Goals Conceded:']}</div>
      `

      // <br /> = break
      // <hr /> = line
      
      div.html(newHTML)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");

    })

    .on('mouseleave', function(d) {
      d3.select("#country").html(" ")

        div.transition()
        .duration(500)
        .style("opacity", 0);
    })
}





  // Optional rotate
//   d3.timer(function(elapsed) {
//     const rotate = projection.rotate()
//     const k = sensitivity / projection.scale()
//     projection.rotate([
//       rotate[0] - 1 * k,
//       rotate[1]
//     ])
//     path = d3.geoPath().projection(projection)
//     svg.selectAll("path").attr("d", path)
//   }, 200)

// ;