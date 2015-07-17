window.onload = function() {
  Global = {}
  Global.navyBlue = "#001F3F"
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
  .duration(250)
    .attr("fill", "#7F7F7F")
}

function donateMouseout() {
  d3.selectAll('.donate')
    .transition()
    .duration(100)
    .attr("fill", "#001F3F")
}

function redditMouseover() {
  d3.selectAll('.reddit')
    .transition()
    .duration(250)  
    .attr("fill", "#7F7F7F")
}

function redditMouseout() {
  d3.selectAll('.reddit')
    .transition()
    .duration(100)  
    .attr("fill", "#001F3F")
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
    .on("click",function(d){
      var url = "https://berniesanders.com/"
      window.location.href = url
    })

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
    .on("click",function(d){
      var url = "https://www.reddit.com/r/sandersforpresident"
      window.location.href = url
    })
}

function addLinkDescriptions() {
  var svg = d3.select('.main-svg')
  // d3.select('.bernie-link')
    // .attr("transform", "translate(100,50) scale(.5.5)")

  svg.append("text")
    .attr("class", "donate bottom-text")
    .attr("x", 110)
    .attr("y", 490)
    .attr("fill","#001F3F")
    .text("Donate to Bernie")


  svg.append("text")
    .attr("fill", "#001F3F")
    .attr("class", "reddit bottom-text")
    .attr("x", 450 + 140)
    .attr("y", 490)
    .text("Get Bernie News")


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
    .attr("fill", "#001F3F")
    .text(function(d) {
      return '\uf1a1'
    })


  text.append("tspan")
    .attr("class", "reddit bottom-text")
    .attr("x", 500 + 100)
    .attr("dy", 30)
    .attr('font-size', '24px')
    .attr("fill", "#001F3F")
    .text("/r/SandersForPresident")

}

function loadSandersLogo() {
  d3.xml("sanders-logo.svg", "image/svg+xml", function(xml) {
    Global.test = d3.select(xml.documentElement).select(".logo")
    document.querySelector('.main-svg').appendChild(xml.documentElement);
    d3.select('.bernie-svg')
      .attr('x', 150)
      .attr('y', 490)
      .attr("fill", "#001F3F")
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
    newObj.blurb = newObj.date + " — " + newObj.blurb
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
    if (o.dateValue == 404) o.dateValue = 403
    if (o.dateValue == 409) o.dateValue = 408
  })


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


  

  // addTimelineRect()

  var swishString = "m958,47.174446c0,0 -3.763794,-0.836388 -10.664063,-2.300102c-3.554626,-0.83638 -7.736633,-1.463684 -12.755066,-2.509178c-5.018372,-0.83638 -10.873108,-1.881874 -17.355164,-2.927368c-12.964172,-2.300102 -28.855591,-4.181984 -47.047241,-6.272972c-18.19165,-2.090988 -38.892395,-3.763779 -61.26593,-5.018387c-22.373596,-1.254574 -46.838196,-2.090988 -72.557312,-2.718262c-12.964172,-0.20911 -26.13739,-0.20911 -39.728821,-0.20911c-13.59137,0 -27.391907,0.20911 -41.401489,0.41819c-28.019348,0.627304 -57.084045,1.463688 -86.567017,3.136486c-29.482849,1.463684 -59.384033,3.345589 -89.285156,5.64566c-15.055145,1.254608 -29.901123,2.509209 -44.747162,3.763786c-14.846008,1.254608 -29.692017,2.718292 -44.538055,4.181976c-7.318451,0.836411 -14.636932,1.463684 -21.955383,2.300102c-7.318451,0.83638 -14.427795,1.463684 -21.746277,2.300064c-7.318451,0.836418 -14.427795,1.672798 -21.53717,2.509216c-7.109344,0.83638 -14.218719,1.67276 -21.328094,2.300064c-28.228333,2.718292 -55.620285,4.80928 -81.548538,5.64566c-12.964111,0.418228 -25.719162,0.836418 -37.846878,0.836418c-12.336838,0.209076 -24.046371,0 -35.337708,-0.209114c-22.791779,-0.627304 -43.492569,-2.090988 -61.893257,-3.972862c-18.400703,-2.300102 -34.501308,-4.80928 -47.465439,-8.154877c-6.482067,-1.672768 -12.336834,-3.345558 -17.355202,-5.018356c-5.018375,-1.672798 -9.200352,-3.554672 -12.545934,-5.018364c-3.345582,-1.672798 -5.854766,-2.927399 -7.31846,-3.972893c-1.672789,-1.045494 -2.509184,-1.672798 -2.509184,-1.672798s0.836394,0.418221 2.718283,1.045494c1.672789,0.627304 4.391077,1.463715 7.736659,2.509209c3.345578,0.836388 7.736655,1.881882 12.755027,2.509186c5.018375,0.83638 10.873142,1.463684 17.355202,2.090988c6.482067,0.41819 13.800529,0.83638 21.537186,1.045494c7.945759,0.209076 16.309711,0.209076 25.510052,0.209076c18.191612,-0.209076 38.89238,-1.045494 61.265961,-2.300064c11.291351,-0.627304 22.791779,-1.463692 34.91951,-2.509186c12.127731,-1.045494 24.67366,-2.090988 37.428696,-3.136482c25.719162,-2.300095 52.692902,-5.22747 80.712158,-8.573063c14.009613,-1.672798 28.228333,-3.345592 42.656158,-5.22747c14.427795,-1.672798 29.273834,-3.345596 43.910767,-4.60017c14.846008,-1.463684 29.692017,-2.718288 44.747131,-3.972897c15.055145,-1.254574 30.11026,-2.300068 45.165344,-3.136467c30.110229,-1.881893 60.429535,-3.136482 90.121552,-3.763783c29.692078,-0.627289 58.965881,-0.627289 87.403381,0c14.218689,0.418205 28.019226,0.836395 41.819763,1.463699c13.591431,0.627289 26.973694,1.463684 39.937866,2.509178c25.928284,1.881893 50.392761,4.39109 72.975464,7.318462c22.582764,3.136482 43.074402,6.482075 61.266052,10.036751c18.191528,3.554672 33.873962,7.318455 46.838013,10.873135c6.482117,1.672798 12.127808,3.554672 17.146179,5.018356c5.018311,1.672798 9.200317,2.927406 12.545898,3.9729c6.272949,2.300064 9.827698,3.554672 9.827698,3.554672z"

  var defaultSwishX = -21.700031280517578
  var scaleTo960 = 2.0946979914797152

  var bigRect = svg.append("rect")
  .attr("fill", "url(#solids)")
  .attr("stroke", "black")
  .attr("stroke-opacity", .2)
  .attr("x", "0")
  .attr("y", "0")
  .attr("rx", 0)
  .attr("ry", 3)
  .attr("height", "10")
  .attr("width",width+20)
  .attr("transform", " translate(0," + 405+ ")")

  

  svg.append("text").attr("x",0).attr("y",400).attr("class","position")
  .attr("fill","black")
  .attr("stroke","black")
  .attr("stroke-width",.5)  
  .text("1981")

  var x1990 = Global.xScale(108)
  var x2000 = Global.xScale(228)
  var x2010 = Global.xScale(348)
  var x2015 = Global.xScale(408)
  // svg.append("text").attr("x",x1990).attr("y",400).attr("class","position")
  // .attr("fill","black")
  // .attr("stroke","black")
  // .attr("stroke-width",.5)  
  // .text("1990")

  // svg.append("text").attr("x",x2000).attr("y",400).attr("class","position")
  // .attr("fill","black")
  // .attr("stroke","black")
  // .attr("stroke-width",.5)  
  // .text("2000")

  // svg.append("text").attr("x",x2010).attr("y",400).attr("class","position")
  // .attr("fill","black")
  // .attr("stroke","black")
  // .attr("stroke-width",.5)  
  // .text("2010")

  svg.append("text").attr("x",x2015).attr("y",400).attr("class","position")
  .attr("fill","black")
  .attr("stroke","black")
  .attr("stroke-width",.5)  
  .text("2015")  

  svg.append("text").attr("x",60).attr("y",430).attr("class","position")
  .attr("fill","#A3D6F5")
  .attr("stroke","black")
  .attr("stroke-width",.5)  
  .text("Mayor of Burlington, VT")


  svg.append("text").attr("x",375).attr("y",430).attr("class","position")
  .attr("fill","#EE3233")
  .attr("stroke","black")
  .attr("stroke-width",.5)  
  .text("Representative of VT's At-large District")

  svg.append("text").attr("x",750).attr("y",430).attr("class","position")
  .attr("fill","#BCBDDC")
  .attr("stroke","black")
  .attr("stroke-width",.5)
  .text("United States Senator from VT")
  // var bigSwish = svg.append("path")
  //   .attr("class", "big-swish")
  //   .attr("d", swishString)
  //   .attr("transform", " translate(0," + swishY + ")")
  //   .attr("fill", "url(#solids)")

  // var bbox = d3.select(".big-swish")[0][0].getBBox()
  var timeline = {
      y: swishY + 40,
      height: 15
    }


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
    .attr("fill","white")
    .attr("stroke","black")

    .on("mouseover", itemMouseover)
    .on("mouseout", itemMouseout)

  addLinkDescriptions()
  addRedditLink()
  addArrows()

}


function addArrows(){
  var svg = d3.select('.main-svg')
  var arrowData1 = "m178.61995,74.45496c-1.12671,1.28741 -2.29224,2.54189 -3.38013,3.8623c-1.58911,1.9288 -3.09601,3.92395 -4.64841,5.88245c-10.64856,13.43399 -21.09245,27.0051 -31.45738,40.65945c-15.99654,21.81946 -33.41106,42.56458 -49.20676,64.52814c-3.93378,5.94672 -8.25975,11.69647 -11.61659,18.01025c-0.64124,1.20612 -1.8586,3.78162 -2.1133,5.37885c-0.0195,0.12366 0.15247,0.19849 0.22868,0.29779c0.29465,-2.88458 1.94606,-3.19031 4.59108,-3.8573c1.52863,-0.3855 3.07034,-0.71875 4.61446,-1.03656c4.64778,-0.9566 10.41557,-1.94629 14.97403,-2.75964c3.79562,-0.4796 7.57953,-1.06342 11.38687,-1.43889c10.80692,-1.06572 20.79662,-1.48988 31.70148,-1.78314c21.08203,-0.56703 42.13545,-0.23683 63.21521,0.1848c20.51335,0.47107 41.0166,1.1714 61.53075,1.60101c0,0 -28.74747,14.03601 -28.74747,14.03601l0,0c-19.48738,-1.41046 -38.9859,-2.82513 -58.53592,-2.96698c-7.44397,-0.07831 -14.88754,-0.26636 -22.33188,-0.23474c-30.83572,0.1308 -61.89294,1.80719 -92.12032,8.23309c-8.88686,2.12604 -9.69635,2.25085 -17.79517,4.41223c-1.87392,0.50012 -3.72751,1.07617 -5.60779,1.55188c-2.20781,0.55853 -5.21103,1.7926 -7.4614,0.159c-0.87732,-0.6369 -1.16547,-1.82837 -1.74818,-2.74255c0.0387,-0.84082 -0.14177,-1.72124 0.11609,-2.52246c0.43294,-1.34528 3.86528,-6.09752 4.31339,-6.70331c4.82704,-6.52515 10.23705,-12.59215 15.11526,-19.07805c17.49657,-21.63226 36.51256,-42.07129 52.16693,-65.1526c8.05037,-11.63525 7.84068,-11.15862 15.29019,-22.56551c2.54552,-3.89774 7.85654,-12.11369 10.36699,-16.49931c2.26007,-3.94815 2.72868,-5.18436 4.37904,-8.88132c0,0 42.7802,-10.57486 42.7802,-10.57486l0.00003,0l-0.00003,-0.00001l0.00003,0l0.00002,-0.00001l0,-0.00001z"
  var arrowData2 = "m216.80315,134.1174c11.54861,-3.41785 23.0368,-7.02405 34.63861,-10.25781c33.08061,-10.82678 67.19353,-18.02524 101.24666,-25.00671c8.00494,-1.43826 15.99866,-2.94022 24.01477,-4.31474c18.24658,-3.12868 32.25012,-5.32626 50.63336,-7.69226c24.54211,-3.1586 49.16537,-5.45615 73.81229,-7.59073c29.40659,-2.3721 58.93503,-2.79227 88.42392,-2.97339c0,0 -68.1037,32.99615 -68.1037,32.99615l0,0c-2.84412,-0.563 -5.66864,-1.23615 -8.53235,-1.68896c-20.927,-3.3091 -42.21017,-3.04282 -63.3197,-2.44281c-7.08005,0.34357 -14.16681,0.56784 -21.24005,1.0307c-41.95801,2.74573 -83.62564,9.05695 -124.65363,18.21368c-8.20551,1.97229 -16.43561,3.84503 -24.61652,5.91687c-31.14796,7.88837 -61.82671,17.47974 -92.20038,27.93469c-11.09906,3.86835 -22.16684,7.79828 -33.1821,11.89972c-1.49948,0.55835 -10.56439,4.00853 -12.75664,4.78589c-1.19374,0.42328 -2.40681,0.78986 -3.61021,1.1848c0,0 79.44563,-41.99512 79.44563,-41.99512l0.00003,0l0,0.00002l0,0.00003l0,-0.00002z"

  //Arrow 1
  var arrow1 = svg.append("g")
  .attr("transform","translate(475,340) scale(-.3,.3) rotate(-35)")
  arrow1.append("path.arrow").attr("d",arrowData1).attr("fill-opacity",1).attr("fill",Global.navyBlue)
  arrow1.append("path.arrow").attr("d",arrowData2).attr("fill-opacity",1).attr("fill",Global.navyBlue)

  svg.append("text")
  .attr("class","arrow-text")
  .attr("opacity",1)
  .attr("x",115)
  .attr("y",175)
  .attr("font-size",24)
  .append("tspan")
  .text("July 1996 —")
  .append("tspan")
  .attr("x",120)
  .attr("dy",35)
  .text("Sanders votes against the")
  .append("tspan")
  .attr("x",120)
  .attr("dy",35)
  .text("Defense of Marriage Act")


  var arrow2 = svg.append("g")
  .attr("transform","translate(595,370) scale(-.3,.4) rotate(-65)")
  arrow2.append("path.arrow").attr("d",arrowData1).attr("fill-opacity",1).attr("fill",Global.navyBlue)
  arrow2.append("path.arrow").attr("d",arrowData2).attr("fill-opacity",1).attr("fill",Global.navyBlue)

  svg.append("text")
  .attr("class","arrow-text")
  .attr("opacity",1)
  .attr("x",300)
  .attr("y",80)
  .attr("font-size",24)
  .append("tspan")
  .text("November 1999 —")
  .append("tspan")
  .attr("x",300)
  .attr("dy",35)
  .text("Sanders votes against")
  .append("tspan")
  .attr("x",300)
  .attr("dy",35)
  .text("repealing Glass-Steagall")


  var arrow3 = svg.append("g")
  .attr("transform","translate(695,405) scale(-.2,-.2) rotate(90)")
  arrow3.append("path.arrow").attr("d",arrowData1).attr("fill-opacity",1).attr("fill",Global.navyBlue)
  arrow3.append("path.arrow").attr("d",arrowData2).attr("fill-opacity",1).attr("fill",Global.navyBlue)

  svg.append("text")
  .attr("class","arrow-text")
  .attr("opacity",1)
  .attr("x",600)
  .attr("y",165)
  .attr("font-size",24)
  .append("tspan")
  .text("December 2007 —")
  .append("tspan")
  .attr("x",600)
  .attr("dy",35)
  .text("Sanders’ authored energy")
  .append("tspan")
  .attr("x",600)
  .attr("dy",35)
  .text("efficiency and conservation")
  .append("tspan")
  .attr("x",600)
  .attr("dy",35)
  .text("grant program passes into law")  


}

function makeRing(selector,xVal){

  var attrs = {
    cx: xVal+10,
    cy: 410,
    r: 5,
    fill:"black",
    stroke: "black",
    "opacity": 0.4,
    "fill-opacity":0.8,
  }  

  // selector.select("circle")
  // .attr("fill","red")

  selector
  .insert("circle",":first-child")
  .attr(attrs)
  .transition()
  .duration(750)
  .attr("r",10)
  .attr("opacity", 0)
  .remove()

}


function itemMouseover(d, i) {
  d3.select(this).attr("fill","#85144B") // maroon 
  var xVal  = Global.xScale(d.dateValue) 
  var selector = d3.select(this.parentNode)
  makeRing(selector,xVal)

  var dur = 750

  var scaleFactor = 1.2
  var translateFactor = (scaleFactor - 1) * -470

  var howFarDownToShift = i * -25
  d3.select('.text-group')
    .transition().duration(dur)
    .attr("transform", "translate(" + translateFactor + "," + howFarDownToShift + ") scale(" + scaleFactor + "," + scaleFactor + ")")
    // .attr("transform", "translate(0," + howFarDownToShift + ") scale(1," + scaleFactor + ")")


  d3.selectAll('.arrow').transition().duration(dur).attr("fill-opacity",0)
  d3.selectAll('.arrow-text').transition().duration(dur).attr("opacity",0)

  d3.selectAll('.blurb-tspan').attr('fill', '#EFEFEF')

  d3.selectAll('.blurb-tspan:not(.blurb-' + i + ')')
    .transition().duration(dur)
    .attr('fill', '#EFEFEF') //Light Grey

  d3.selectAll('.blurb-' + i)
    .transition().duration(dur)
    // .attr('opacity',1)
    .attr('fill', "#85144B") //maroon

}

function itemMouseout(d, i) {
  d3.select(this).attr("fill","white")
  var dur = 2500

  d3.select('.text-group').transition().duration(dur).delay(750).attr("transform", "translate(0,0) scale(1,1)")
  d3.selectAll('.blurb-tspan')
    .transition().delay(750).duration(dur)
    .attr('fill', "#EFEFEF")

  d3.selectAll('.arrow').transition().delay(2000).duration(750).attr('fill-opacity', 1)    
  d3.selectAll('.arrow-text').transition().delay(2000).duration(750).attr('opacity', 1)    
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