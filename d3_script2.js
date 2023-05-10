
let width2 = d3.select("#myChart2").node().getBoundingClientRect().width
let height2 = 500
const sensitivity2 = 75
let topo2;

// tooltip
var div2 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);



let projection2 = d3.geoOrthographic()
  .scale(250)
  .center([0, 0])
  .rotate([0, -30])
  .translate([width2 / 2, height2 / 2])


const initialScale2 = projection2.scale()
let path2 = d3.geoPath().projection(projection2)

let svg2 = d3.select("#myChart2")
  .append("svg")
  .attr("width", width2)
  .attr("height", height2)

let globe2 = svg2.append("circle")
  .attr("fill", "#eeeeff")
  .attr("stroke", "#000")
  .attr("stroke-width", "0.2")
  .attr("cx", width2 / 2)
  .attr("cy", height2 / 2)
  .attr("r", initialScale2)

svg2.call(d3.drag().on('drag', () => {
  const rotate = projection2.rotate()
  const k = sensitivity2 / projection2.scale()
  projection2.rotate([
    rotate[0] + d3.event.dx * k,
    rotate[1] - d3.event.dy * k
  ])
  path2 = d3.geoPath().projection(projection2)
  svg2.selectAll("path").attr("d", path2)
}))
  .call(d3.zoom().on('zoom', () => {
    if (d3.event.transform.k > 0.3) {
      projection2.scale(initialScale2 * d3.event.transform.k)
      path2 = d3.geoPath().projection(projection2)
      svg2.selectAll("path").attr("d", path2)
      globe2.attr("r", projection2.scale())
    }
    else {
      d3.event.transform.k = 0.3
    }
  }))

let data2 = d3.map();
let map2 = svg2.append("g")
let colorScale2 = d3.scaleLinear()
  .domain([0, 1, 30, 60])
  .range(["lightgray", "red", "green", "blue"]);


// Load external data and boot
d3.queue()
  .defer(d3.json, "data/world.json")
  .defer(d3.csv, "data/World Cup Data Visualization 2 - Sheet1.csv", function(d) {
    data2.set(d["Country Code"], d);
  })
  .await(drawGlobe2);


function drawGlobe2(error, topoData) {
  if (topoData) {
    topo2 = topoData;
  }

  
  let FiveTrophiesCheckBox = document.getElementById("FiveTrophiesCheckBox");

  let FourTrophiesCheckBox = document.getElementById("FourTrophiesCheckBox");

  let ThreeTrophiesCheckBox = document.getElementById("ThreeTrophiesCheckBox");

  let TwoTrophiesCheckBox = document.getElementById("TwoTrophiesCheckBox");

  let OneTrophyCheckBox = document.getElementById("OneTrophyCheckBox");

  map2.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(topo2.features)
    .enter().append("path")
    .attr("class", d => "country_" + d.properties.name.replace(" ", "_"))
    .attr("d", path2)
    .attr("fill", (d) => {
      return "white";
    })
    .style('stroke', 'black')
    .style('stroke-width', 0.3)
    // .style("opacity", 0.8)

    .attr("fill", function(d) {
      let country = data2.get(d.id);

      if (!country) return colorScale2(0);


      let wins = country["Amount of Wins in the WC"];
      if (wins == "1" && OneTrophyCheckBox.checked) {
        return colorScale2(10);
      }
      else if (wins == "2" && TwoTrophiesCheckBox.checked) {
        return colorScale2(20);
      }
      else if (wins == "3" && ThreeTrophiesCheckBox.checked) {
        return colorScale2(30);
      }
      else if (wins == "4" && FourTrophiesCheckBox.checked) {
        return colorScale2(40);
      }
      else if (wins == "5" && FiveTrophiesCheckBox.checked) {
        return colorScale2(50);
      }
      else return colorScale2(0);
    })

    .on('mouseenter', function(d) {
      let country = data2.get(d.id);
      // console.log(country);
      if (!country) return;


      d3.select("#country").html(country.Country)
      d3.select("#country").html(country['Country Code'])


      // tooltip show
      div2.transition()
        .duration(200)
        .style("opacity", .9);


  
      let newHTML2 = `
        <div><strong> ${country.Country}</strong></div>
        <div><strong>Country Code</strong>: ${country['Country Code']}</div>
        <div><strong>Amount of Wins in the WC</strong>: ${country['Amount of Wins in the WC']}</div>
        <div><strong>Top Scorer for Team</strong>: ${country['Top Scorer for Team']}</div>
        <div><strong>Amount of Goals by Top Scorer</strong>: ${country['Amount of Goals by Top Scorer']}</div>
        <div><strong>What Years Did They Win The WC</strong>: ${country['What Years Did They Win The WC']}</div>
        <div><strong>Current Captain</strong>: ${country['Current Captain ']}</div>
      `

      // <br /> = break
      // <hr /> = line
      
      div2.html(newHTML2)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");

    })

    .on('mouseleave', function(d) {
      d3.select("#country2").html(" ")

        div2.transition()
        .duration(500)
        .style("opacity", 0);
    })
}





//   //Optional rotate
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