export const interactiveChart = () => {
  let margin = { left: 80, right: 20, top: 50, bottom: 100 };

  let width = 1300 - margin.left - margin.right;
  let height = 700 - margin.top - margin.bottom;

  let flag = true;

  var t = d3.transition().duration(750);

  let g = d3
    .select("#inter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var xAxisGroup = g
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  var yAxisGroup = g.append("g").attr("class", "y axis");

  //   // X Scale
  let x0 = d3
    .scaleBand()
    .range([0, width])
    .padding(0.1);

  let x1 = d3.scaleBand();

  let interval;
  let cleanData;

  //   // Y Scale
  let y = d3.scaleLinear().range([height, 0]);

  //   // X Label
  // var xLabel = g
  //   .append("text")
  //   .attr("y", height + 50)
  //   .attr("x", width / 2)
  //   .attr("font-size", "20px")
  //   .attr("text-anchor", "middle")
  //   .text("Round");

  // var xAxisCall = d3
  //   .axisBottom(x)
  //   .tickValues([400, 4000, 40000])
  //   .tickFormat(d3.format("$"));
  // g.append("g")
  //   .attr("class", "x axis")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(xAxisCall);

  let xAxis = d3.axisBottom(x0).tickSize(0);

  let yAxis = d3.axisLeft(y);

  let timeLabel = g
    .append("text")
    .attr("y", height + 50)
    .attr("x", width - 40)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text("2000");

  let sectors = ["mobile", "software", "web", "ecommerce", "medical"];
  let rounds = ["series-a", "series-b", "angel", "series-c+", "venture"];

  x0.domain(rounds);
  x1.domain(sectors).rangeRound([0, x0.bandwidth()]);

  // var xAxisGroup = g
  //     .append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")");

  //   var yAxisGroup = g.append("g").attr("class", "y axis");

  // var color = d3.scale
  //   .ordinal()
  //   .range(["#ca0020", "#f4a582", "#d5d5d5", "#92c5de", "#0571b0"]);

  var color = d3.scaleOrdinal(d3.schemePastel1);

  let time = 0;

  d3.json("../data/funding/new_funding.json").then(function(data) {
    //   //   //console.log(data);

    let rawData = data;

    cleanData = d3
      .nest()
      //     // .key(function(d) {
      //     //   return d.funded;
      //     // })
      .key(function(d) {
        return d.funded;
      })
      .sortKeys(d3.ascending)
      .key(function(d) {
        return d.round;
      })
      .key(function(d) {
        return d.sector;
      })
      .rollup(function(v) {
        return d3.sum(v, function(d) {
          return d.amountRaised;
        });
      })
      .entries(rawData);

    console.log(cleanData);

    // var rounds = cleanData.map(function(d) {
    //   return d.values
    //     .filter(ele => {
    //       if (ele.key) return ele.key;
    //     })
    //     .map(ele2 => {
    //       return ele2.key;
    //     });
    // });

    let elements = cleanData[0].values.map(ele => {
      return ele;
    });

    // x1.domain(sectors).rangeRound([0, x0.bandwidth()]);

    // x1.domain(
    //   cleanData[0].values[0].values.map(ele => {
    //     return ele.key;
    //   })
    // ).rangeRound([0, x0.bandwidth()]);

    // y.domain([
    //   0,
    //   d3.max(cleanData[0].values, function(rounds) {
    //     return d3.max(rounds.values, function(d) {
    //       return d.value;
    //     });
    //   })
    // ]);

    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // console.log("hello");

    // console.log(g.select(".y"));

    // d3.interval(function() {
    //   // At the end of our data, loop back
    //   time = time < 14 ? time + 1 : 0;
    //   update(cleanData[time]);
    // }, 5000);

    // First run of the visualization
    update(cleanData[0]);
  });

  // let button = d3.select("#play-button");
  // console.log(button);

  $("#play-button").on("click", function() {
    let button = $(this);
    if (button.text() == "Play") {
      button.text("Pause");
      interval = setInterval(step, 3000);
      step();
    } else {
      button.text("Play");
      clearInterval(interval);
    }
  });

  // document.getElementById("#reset-button").on("click", function() {
  //   time = 0;
  //   update(cleanData[0]);
  // });

  // $("#continent-select").on("change", function() {
  //   update(formattedData[time]);
  // });

  function step() {
    // At the end of our data, loop back
    time = time < 14 ? time + 1 : 0;
    update(cleanData[time]);
  }

  function update(data) {
    let elements = data.values.map(ele => {
      return ele;
    });

    y.domain([
      0,
      d3.max(data.values, function(rounds) {
        return d3.max(rounds.values, function(d) {
          return d.value;
        });
      })
    ]);
    // g.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(xAxis);

    g.append("g")
      .attr("class", "y axis")
      .style("opacity", "1")
      .call(yAxis);
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .text("Value");

    // g.selectAll(".y")
    //   .transition()
    //   .duration(500)
    //   .delay(100)
    //   .style("opacity", "1");

    //slice.exit().remove();

    g.selectAll("rect")
      .transition(t)
      .delay(function(d) {
        return Math.random() * 50;
      })
      .attr("height", function(d) {
        return 0;
      })
      .attr("y", function(d) {
        return y(0);
      })
      .remove();

    let slice2 = g
      .selectAll(".slice")
      .data(data.values)
      .enter()
      .append("g")
      .attr("class", "g")
      .attr("transform", function(d) {
        return "translate(" + x0(d.key) + ",0)";
      });

    //console.log(slice2);

    // slice
    //   .exit()
    //   .attr("class", "exit")
    //   .remove();

    // let rects = slice.selectAll("rect").data(function(d) {
    //   return d.values;
    // });

    // rects
    //   .exit()
    //   .attr("class", "exit")
    //   .remove();

    // slice
    //   .exit()
    //   .attr("y", y(0))
    //   .attr("height", 0)
    //   .remove();

    // slice2
    //   .transition()
    //   .duration(1200)
    //   .delay(1500)
    //   .selectAll("rect")
    //   .remove();

    // slice2.selectAll("g.rect").remove();

    let rects = slice2.selectAll("rect").data(function(d) {
      return d.values;
    });

    // slice.exit().remove();
    //rects.exit().remove();

    // rects
    //   .exit()
    //   .transition(t)
    //   .attr("height", 0)
    //   .remove();

    //rects.remove();
    // let button2 = d3.select("#play-button");
    // if (button2.text() === "Pause") {
    //   rects.remove();
    // }

    // slice2.selectAll("g.rect").remove();

    rects
      .enter()
      .append("rect")
      // .attr("class", "enter")
      .attr("width", x1.bandwidth)
      .attr("x", function(d) {
        //console.log(x1(d.key), d.key);
        return x1(d.key);
      })
      .style("fill", function(d) {
        return color(d.key);
      })
      .attr("y", function(d) {
        return y(0);
      })
      .attr("height", function(d) {
        return 0;
      })
      .on("mouseover", function(d) {
        d3.select(this).style("fill", d3.rgb(color(d.key)).darker(2));
      })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", color(d.key));
      })
      .on("click", function(d) {
        if (d3.select("#play-button").text() === "Play") {
          d3.selectAll("rect")
            .transition()
            .duration(100)
            .attr("y", function(d) {
              return y(d.value);
            })
            .attr("height", function(d) {
              return height - y(d.value);
            });
        }
      })

      // .merge(rects)
      .transition(t)
      .delay(function(d) {
        return Math.random() * 1000;
      })
      //.duration(500)
      .attr("y", function(d) {
        return y(d.value);
      })
      .attr("height", function(d) {
        return height - y(d.value);
      });
    // .end()
    // .then(function(d) {
    //   d3.selectAll("rect")
    //     .transition()
    //     .on("start", function() {
    //       if (d3.select("#play-button").text() === "Play") {
    //         d3.select(this).interrupt();
    //       }
    //     })
    //     .delay(function(d) {
    //       return 1000;
    //     })
    //     .duration(900)
    //     .attr("y", function(d) {
    //       return y(0);
    //     })
    //     .attr("height", function(d) {
    //       return 0;
    //     })
    //     .remove();
    // });

    let rects2 = slice2.selectAll("rect");
    let button2 = d3.select("#play-button");

    // if (time == 0) {
    //   rects2.transition().duration(0);
    // } else {
    //rects2;

    // rects2
    //   .exit()
    //   .transition(1500)
    //   .remove();

    // slice2
    //   .exit()
    //   .transition(2000)
    //   .remove();
    // rects
    //   .exit()
    //   .transition()
    //   .duration(2000)
    //   .attr("height", 0)
    //   .remove();

    // .transition(t)
    // .attr("height", 0)

    //rects.exit().remove();

    // console.log(button2.text());

    // if (button2.text() === "Pause" && cleanData.indexOf(data) === 0) {
    //   slice2
    //     // .transition()
    //     // // .duration(500)
    //     // .delay(500)
    //     .selectAll("rect")
    //     .remove();
    // }
    // if (button2.text() === "Pause") {
    //   slice2
    //     .transition()
    //     // .duration(500)
    //     .delay(500)
    //     .selectAll("rect")
    //     .remove();
    // }

    // slice2
    //   .transition()
    //   .duration(1200)
    //   .delay(1500)
    //   .selectAll("rect")
    //   .remove();
    g.selectAll("g.y.axis").call(yAxis);
    timeLabel.text(+(time + 2000));
  }
};

// var menu = d3.select("#menu select").on("change", change);

// function change() {
//   clearTimeout(timeout);

//   d3.transition()
//     .duration(altKey ? 7500 : 750)
//     .each(redraw);
// }

// slice2
//   .transition()
//   .duration(1500)
//   .delay(3000)
//   .selectAll("rect")
//   .remove();

// x0.domain(categoriesNames);
// x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
// y.domain([
//   0,
//   d3.max(data, function(categorie) {
//     return d3.max(categorie.values, function(d) {
//       return d.value;
//     });
//   })
// ]);
