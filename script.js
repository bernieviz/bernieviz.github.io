window.onload = function() {
  Global = {}
  var file = "data.json"

  d3.json(file, ready)

  Global.margin = margin = {
    top: 20,
    right: 10,
    bottom: 40,
    left: 10
  };

  Global.width = width = 960 - margin.left - margin.right;
  Global.height = height = 500 - margin.top - margin.bottom;

  // Global.svg = svg = d3.select(".d3-container").append("svg")
  //   .attr("class", "main-svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  Global.xScale = d3.scale.linear()
    .range([0, width])

  modifyBernieLink()
  addRedditLink()
}

function modifyBernieLink(){
  var svg = d3.select('.link-svg')
  d3.select('.bernie-link')
  .attr("transform","translate(100,50) scale(.6.6)")

  svg.append("text")
  .attr("x", 100)
  .attr("y", 30)
  .text("Donate to Bernie")

  svg.append("text")
  .attr("x",450 + 100)
  .attr("y", 30)
  .text("Best place for Bernie news")  

}

function addRedditLink() {
  var svg = d3.select('.link-svg')

  var text = svg.append("text")
    .attr("x", 450 + 280)
    .attr("y", 100)

    text.append("tspan")
    .attr('font-family', 'FontAwesome')
    .attr('font-size', '48px')
    .text(function(d) { return  '\uf1a1' })


    text.append("tspan")
    .attr("x", 450 + 200)
    .attr("dy",40)
    .attr('font-size', '24px')
    .text("/r/SandersForPresident")
    
}

function ready(error, raw) {
  var svg = d3.select('.main-svg')
  var height = Global.height
  var width = Global.width
  var margin = Global.margin
  var xScale = Global.xScale

  data = raw.map(function(o) {
    var newObj = o,
      month = o.date.split(" ")[0],
      year = o.date.split(" ")[1],
      dateValue = getMonthFromString(month) + ((year - 1981) * 12)
    newObj.dateValue = dateValue
    return newObj
  })
  console.log(data)

  Global.xScale
    .domain(d3.extent(data, ƒ("dateValue")))

  // ********** Background Text ***************
  // ******************************************

  var allText = Global.allText = data.map(function(o, i) {
    return "~" + o.blurb
  }).join(' ')

  var currentBlurb = -1
  var lineData = d3.wordwrap(Global.allText, 150)
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
    .attr("transform", "scale(1,.8)")

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

  var timeline = {
      y: 2 * (height / 3),
      height: 15
    }
    // Timeline

  var swishString = "M480,146.5c0,0-1.8-0.4-5.1-1.1c-1.7-0.4-3.7-0.7-6.1-1.2c-2.4-0.4-5.2-0.9-8.3-1.4"
  +    "c-6.2-1.1-13.8-2-22.5-3c-8.7-1-18.6-1.8-29.3-2.4c-10.7-0.6-22.4-1-34.7-1.3c-6.2-0.1-12.5-0.1-19-0.1c-6.5,0-13.1,0.1-19.8,0.2"
  +    "c-13.4,0.3-27.3,0.7-41.4,1.5c-14.1,0.7-28.4,1.6-42.7,2.7c-7.2,0.6-14.3,1.2-21.4,1.8c-7.1,0.6-14.2,1.3-21.3,2"
  +    "c-3.5,0.4-7,0.7-10.5,1.1c-3.5,0.4-6.9,0.7-10.4,1.1c-3.5,0.4-6.9,0.8-10.3,1.2c-3.4,0.4-6.8,0.8-10.2,1.1"
  +    "c-13.5,1.3-26.6,2.3-39,2.7c-6.2,0.2-12.3,0.4-18.1,0.4c-5.9,0.1-11.5,0-16.9-0.1c-10.9-0.3-20.8-1-29.6-1.9"
  +    "c-8.8-1.1-16.5-2.3-22.7-3.9c-3.1-0.8-5.9-1.6-8.3-2.4c-2.4-0.8-4.4-1.7-6-2.4c-1.6-0.8-2.8-1.4-3.5-1.9c-0.8-0.5-1.2-0.8-1.2-0.8"
  +    "s0.4,0.2,1.3,0.5c0.8,0.3,2.1,0.7,3.7,1.2c1.6,0.4,3.7,0.9,6.1,1.2c2.4,0.4,5.2,0.7,8.3,1c3.1,0.2,6.6,0.4,10.3,0.5"
  +    "c3.8,0.1,7.8,0.1,12.2,0.1c8.7-0.1,18.6-0.5,29.3-1.1c5.4-0.3,10.9-0.7,16.7-1.2c5.8-0.5,11.8-1,17.9-1.5"
  +    "c12.3-1.1,25.2-2.5,38.6-4.1c6.7-0.8,13.5-1.6,20.4-2.5c6.9-0.8,14-1.6,21-2.2c7.1-0.7,14.2-1.3,21.4-1.9"
  +    "c7.2-0.6,14.4-1.1,21.6-1.5c14.4-0.9,28.9-1.5,43.1-1.8c14.2-0.3,28.2-0.3,41.8,0c6.8,0.2,13.4,0.4,20,0.7"
  +    "c6.5,0.3,12.9,0.7,19.1,1.2c12.4,0.9,24.1,2.1,34.9,3.5c10.8,1.5,20.6,3.1,29.3,4.8c8.7,1.7,16.2,3.5,22.4,5.2"
  +    "c3.1,0.8,5.8,1.7,8.2,2.4c2.4,0.8,4.4,1.4,6,1.9C478.3,145.9,480,146.5,480,146.5z"

  // console.log(swishString)
  var defaultSwishX = -21.700031280517578
  var scaleTo960 = 2.0946979914797152

  var bigSwish = svg.append("path")
  .attr("class","big-swish")
  // .attr("y",100)
  .attr("d",swishString)
  .attr("transform"," translate(-55,"+0+") scale("+scaleTo960+","+scaleTo960+")")
  .attr("fill","url(#solids)")

  // console.log(bigSwish.getBBox())
  var bbox = d3.select(".big-swish")[0][0].getBBox()
  console.log(bbox)

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

  items.append('rect')
    .attr('x', function(d) {
      return Global.xScale(d.dateValue)
    })
    .attr('y', timeline.y)
    .attr('height', timeline.height)
    .attr('width', 2)
    // .attr('r',10)
    .on("mouseover", itemMouseover)
    .on("mouseout", itemMouseout)

  svg.append("text")
    .attr("class", "large-date")
    .attr("x", 200)
    .attr("y", 200)
    .attr("opacity", 0)
    .text("")



}



function itemMouseover(d, i) {
  console.log(i)
  d3.select(".large-date").text(d.date)
  d3.select(".large-date").transition().duration(750).attr('opacity', 1)

  var scaleFactor = 1.45
  var translateFactor = (scaleFactor - 1) * -470

  var howFarDownToShift = 100 - (i * 27)
  d3.select('.text-group')
    .transition().duration(750)
    // .attr("transform","translate("+translateFactor+","+howFarDownToShift+") scale("+scaleFactor+","+scaleFactor+")")
    .attr("transform", "translate(0," + howFarDownToShift + ") scale(1," + scaleFactor + ")")


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
  var dur = 1500

  d3.select(".large-date").transition().duration(dur).attr('opacity', 0)
  d3.select('.text-group').transition().duration(dur).attr("transform", "translate(0,0) scale(1,1)")

  // d3.selectAll('.blurb-tspan').transition()

  // d3.selectAll('.blurb-tspan:not(.blurb-'+i+')')
  // .transition().duration(dur)
  // .attr('fill',"blue")

  d3.selectAll('.blurb-tspan')
    .transition().duration(dur)
    // .attr('opacity',.5)
    .attr('fill', "#DFDFDF")
    // d3.select('.text-group').transition().attr("transform","scale(1,1)")
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