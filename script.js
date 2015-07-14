window.onload = function() {
  Global = {}
  var file = "data.json"

  d3.json(file, ready)

  Global.margin = margin = {
    top: 10,
    right: 10,
    bottom: 40,
    left: 10
  };

  Global.width = width = 960 - margin.left - margin.right;
  Global.height = height = 600 - margin.top - margin.bottom;

  // Global.svg = svg = d3.select(".d3-container").append("svg")
  //   .attr("class", "main-svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  Global.xScale = d3.scale.linear()
    .range([0, width])

}

function donateMouseover() {
  d3.selectAll('.donate')
  .transition()
  .duration(200)
    .attr("fill", "red")
}

function donateMouseout() {
  d3.selectAll('.donate')
    .transition()
    .duration(100)
    .attr("fill", "black")
}

function redditMouseover() {
  d3.selectAll('.reddit')
    .transition()
    .duration(200)  
    .attr("fill", "red")
}

function redditMouseout() {
  d3.selectAll('.reddit')
    .transition()
    .duration(100)  
    .attr("fill", "black")
}

function addPanes() {
  var svg = d3.select('.main-svg')
  svg.append("rect")
    .attr("x", 100)
    .attr("y", 475)
    .attr("height", 100)
    .attr("width", 280)
    .attr("fill", "red")
    .attr("opacity", 0)
    .attr("cursor", "pointer")
    .on("mouseover", donateMouseover)
    .on("mouseout", donateMouseout)

  svg.append("rect")
    .attr("x", 580)
    .attr("y", 475)
    .attr("height", 100)
    .attr("width", 280)
    .attr("fill", "red")
    .attr("opacity", 0)
    .attr("cursor", "pointer")
    .on("mouseover", redditMouseover)
    .on("mouseout", redditMouseout)


}

function addLinkDescriptions() {
  var svg = d3.select('.main-svg')
  // d3.select('.bernie-link')
    // .attr("transform", "translate(100,50) scale(.5.5)")

  svg.append("text")
    .attr("class", "donate bottom-text")
    .attr("x", 110)
    .attr("y", 490)
    .text("Donate to Bernie")


  svg.append("text")
    .attr("class", "reddit bottom-text")
    .attr("x", 450 + 140)
    .attr("y", 490)
    .text("Get Your Bernie News")


}

function addRedditLink() {
  var svg = d3.select('.main-svg')

  var text = svg.append("text")
    .attr("class", "reddit")
    .attr("x", 500 + 180)
    .attr("y", 535)

  text.append("tspan")
    .attr("class", "reddit")
    .attr('font-family', 'FontAwesome')
    .attr('font-size', '48px')
    .text(function(d) {
      return '\uf1a1'
    })


  text.append("tspan")
    .attr("class", "reddit bottom-text")
    .attr("x", 500 + 100)
    .attr("dy", 30)
    .attr('font-size', '24px')
    .text("/r/SandersForPresident")

}

function loadSandersLogo() {
  d3.xml("sanders-logo.svg", "image/svg+xml", function(xml) {
    Global.test = d3.select(xml.documentElement).select(".logo")
    document.querySelector('.main-svg').appendChild(xml.documentElement);
    d3.select('.bernie-svg')
      .attr('x', 150)
      .attr('y', 490)
    d3.select('.logo')
      .attr("transform", "scale(.4,.4)")
    addPanes()
  });
}

function ready(error, raw) {
  var svg = d3.select('.main-svg')
  var height = Global.height
  var width = Global.width
  var margin = Global.margin
  var xScale = Global.xScale
  loadSandersLogo()



  // svg.append(Global.test)

  data = raw.map(function(o) {
    var newObj = o,
      month = o.date.split(" ")[0],
      year = o.date.split(" ")[1],
      dateValue = getMonthFromString(month) + ((year - 1981) * 12)
    newObj.dateValue = dateValue
    newObj.blurb = newObj.date + " -- " + newObj.blurb
    return newObj
  })
  data.forEach(function(o) {
    if (o.dateValue == 119) o.dateValue = 118
    if (o.dateValue == 121) o.dateValue = 123
    if (o.dateValue == 223) o.dateValue = 219
    if (o.dateValue == 121) o.dateValue = 123
    if (o.dateValue == 227) o.dateValue = 230
    if (o.dateValue == 348) o.dateValue = 345
    if (o.dateValue == 351) o.dateValue = 350
    if (o.dateValue == 384) o.dateValue = 378
    if (o.dateValue == 387) o.dateValue = 383
    if (o.dateValue == 409) o.dateValue = 408
  })
  console.log(data.map(function(o) {
    return o.dateValue
  }))
  console.log(data)

  Global.xScale
    .domain(d3.extent(data, ƒ("dateValue")))

  // ********** Background Text ***************
  // ******************************************

  var allText = Global.allText = data.map(function(o, i) {
    return "~" + o.blurb
  }).join(' ')

  var currentBlurb = -1
  var lineData = d3.wordwrap(Global.allText, 125)
    .map(function(str) {
      var returnArray = str.split("~").map(function(str, i) {
        return [i + currentBlurb, str]
      })
      currentBlurb += returnArray.length - 1
      return returnArray
        // return "filler filler filler " + str + "filler filler filler"
    })

  // var allText = allTextArray
  var text = svg.append('g.text-group')
    .append('text.all-text')
    .attr("transform", "scale(1,1)")

  // .attr('opacity',.5)

  //Each line will have an array of arrays eg. [[1,"asdfsdf"],[2"sdfsdfsdf"]]
  var lineTspan = text.selectAll(".line-tspan")
    .data(lineData)
    .enter()
    .append("tspan")
    .attr("class", "line-tspan")
    .attr("x", 470)
    .attr("dy", 15)
    .attr("text-anchor", "middle")
    // .append("tspan")
    // .text("asdsadasdasdasd")

  lineTspan.selectAll(".blurb-tspan")
    .data(function(d) {
      return d
    })
    .enter()
    .append("tspan")
    .attr("class", function(d) {
      return "blurb-tspan blurb-" + d[0]
    })
    .text(function(d) {
      return d[1]
    })

  var swishY = 370


  // Timeline

  var swishString = "m958,47.174446c0,0 -3.763794,-0.836388 -10.664063,-2.300102c-3.554626,-0.83638 -7.736633,-1.463684 -12.755066,-2.509178c-5.018372,-0.83638 -10.873108,-1.881874 -17.355164,-2.927368c-12.964172,-2.300102 -28.855591,-4.181984 -47.047241,-6.272972c-18.19165,-2.090988 -38.892395,-3.763779 -61.26593,-5.018387c-22.373596,-1.254574 -46.838196,-2.090988 -72.557312,-2.718262c-12.964172,-0.20911 -26.13739,-0.20911 -39.728821,-0.20911c-13.59137,0 -27.391907,0.20911 -41.401489,0.41819c-28.019348,0.627304 -57.084045,1.463688 -86.567017,3.136486c-29.482849,1.463684 -59.384033,3.345589 -89.285156,5.64566c-15.055145,1.254608 -29.901123,2.509209 -44.747162,3.763786c-14.846008,1.254608 -29.692017,2.718292 -44.538055,4.181976c-7.318451,0.836411 -14.636932,1.463684 -21.955383,2.300102c-7.318451,0.83638 -14.427795,1.463684 -21.746277,2.300064c-7.318451,0.836418 -14.427795,1.672798 -21.53717,2.509216c-7.109344,0.83638 -14.218719,1.67276 -21.328094,2.300064c-28.228333,2.718292 -55.620285,4.80928 -81.548538,5.64566c-12.964111,0.418228 -25.719162,0.836418 -37.846878,0.836418c-12.336838,0.209076 -24.046371,0 -35.337708,-0.209114c-22.791779,-0.627304 -43.492569,-2.090988 -61.893257,-3.972862c-18.400703,-2.300102 -34.501308,-4.80928 -47.465439,-8.154877c-6.482067,-1.672768 -12.336834,-3.345558 -17.355202,-5.018356c-5.018375,-1.672798 -9.200352,-3.554672 -12.545934,-5.018364c-3.345582,-1.672798 -5.854766,-2.927399 -7.31846,-3.972893c-1.672789,-1.045494 -2.509184,-1.672798 -2.509184,-1.672798s0.836394,0.418221 2.718283,1.045494c1.672789,0.627304 4.391077,1.463715 7.736659,2.509209c3.345578,0.836388 7.736655,1.881882 12.755027,2.509186c5.018375,0.83638 10.873142,1.463684 17.355202,2.090988c6.482067,0.41819 13.800529,0.83638 21.537186,1.045494c7.945759,0.209076 16.309711,0.209076 25.510052,0.209076c18.191612,-0.209076 38.89238,-1.045494 61.265961,-2.300064c11.291351,-0.627304 22.791779,-1.463692 34.91951,-2.509186c12.127731,-1.045494 24.67366,-2.090988 37.428696,-3.136482c25.719162,-2.300095 52.692902,-5.22747 80.712158,-8.573063c14.009613,-1.672798 28.228333,-3.345592 42.656158,-5.22747c14.427795,-1.672798 29.273834,-3.345596 43.910767,-4.60017c14.846008,-1.463684 29.692017,-2.718288 44.747131,-3.972897c15.055145,-1.254574 30.11026,-2.300068 45.165344,-3.136467c30.110229,-1.881893 60.429535,-3.136482 90.121552,-3.763783c29.692078,-0.627289 58.965881,-0.627289 87.403381,0c14.218689,0.418205 28.019226,0.836395 41.819763,1.463699c13.591431,0.627289 26.973694,1.463684 39.937866,2.509178c25.928284,1.881893 50.392761,4.39109 72.975464,7.318462c22.582764,3.136482 43.074402,6.482075 61.266052,10.036751c18.191528,3.554672 33.873962,7.318455 46.838013,10.873135c6.482117,1.672798 12.127808,3.554672 17.146179,5.018356c5.018311,1.672798 9.200317,2.927406 12.545898,3.9729c6.272949,2.300064 9.827698,3.554672 9.827698,3.554672z"

  // console.log(swishString)
  var defaultSwishX = -21.700031280517578
  var scaleTo960 = 2.0946979914797152

  var bigSwish = svg.append("path")
    .attr("class", "big-swish")
    // .attr("y",100)
    .attr("d", swishString)
    // .attr("transform"," translate(-55,"+0+") scale("+scaleTo960+","+scaleTo960+")")
    .attr("transform", " translate(0," + swishY + ")")
    .attr("fill", "url(#solids)")

  // console.log(bigSwish.getBBox())
  var bbox = d3.select(".big-swish")[0][0].getBBox()
  console.log(bbox)
  var timeline = {
      y: swishY + 40,
      height: 15
    }
    // svg.append(swish)

  // svg.append('rect')
  //   .attr('x', 0)
  //   .attr('y', timeline.y)
  //   .attr('height', timeline.height)
  //   .attr('width', xScale(414))
  //   .attr("fill", "green")

  // svg.append('rect')
  //   .attr('x', 0)
  //   .attr('y', timeline.y)
  //   .attr('height', timeline.height)
  //   .attr('width', xScale(312))
  //   .attr("fill", "blue")

  // svg.append('rect')
  //   .attr('x', 0)
  //   .attr('y', timeline.y)
  //   .attr('height', timeline.height)
  //   .attr('width', xScale(120))
  //   .attr("fill", "red")



  var items = svg.selectAll('.items')
    .data(data)
    .enter()
    .append('g')

  items.append('circle')
    // items.append('rect')
    .attr('cx', function(d) {
      return margin.left + Global.xScale(d.dateValue)
    })
    .attr('cy', timeline.y)
    .attr('r', 5)

    .on("mouseover", itemMouseover)
    .on("mouseout", itemMouseout)

  addLinkDescriptions()
  addRedditLink()

}



function itemMouseover(d, i) {
  console.log(i)
    // d3.select(".large-date").text(d.date)
    // d3.select(".large-date").transition().duration(750).attr('opacity', 1)

  var scaleFactor = 1.2
  var translateFactor = (scaleFactor - 1) * -470

  var howFarDownToShift = i * -25
  d3.select('.text-group')
    .transition().duration(750)
    .attr("transform", "translate(" + translateFactor + "," + howFarDownToShift + ") scale(" + scaleFactor + "," + scaleFactor + ")")
    // .attr("transform", "translate(0," + howFarDownToShift + ") scale(1," + scaleFactor + ")")


  d3.selectAll('.blurb-tspan').attr('fill', '#DFDFDF')

  d3.selectAll('.blurb-tspan:not(.blurb-' + i + ')')
    .transition().duration(750)
    .attr('fill', '#EFEFEF') //Light Grey

  d3.selectAll('.blurb-' + i)
    .transition().duration(750)
    // .attr('opacity',1)
    .attr('fill', "red")
}

function itemMouseout(d, i) {
  var dur = 2500

  d3.select('.text-group').transition().duration(dur).delay(750).attr("transform", "translate(0,0) scale(1,1)")
  d3.selectAll('.blurb-tspan')
    .transition().delay(750).duration(dur)
    .attr('fill', "#EFEFEF")
}

function getMonthFromString(mon) {
  var d = Date.parse(mon + "1, 2012");
  if (!isNaN(d)) {
    return new Date(d).getMonth() + 1;
  }
  return -1;
}

function repeat(pattern, count) {
  if (count < 1) return '';
  var result = '';
  while (count > 1) {
    if (count & 1) result += pattern;
    count >>= 1, pattern += pattern;
  }
  return result + pattern;
}