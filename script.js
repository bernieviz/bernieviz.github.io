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

  Global.svg = svg = d3.select(".d3-container").append("svg")
    .attr("class", "main-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    .attr("dy",30)
    .attr('font-size', '24px')
    .text("/r/SandersForPresident")
    
}

function ready(error, raw) {
  var svg = Global.svg
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
  svg.append('rect')
    .attr('x', 0)
    .attr('y', timeline.y)
    .attr('height', timeline.height)
    .attr('width', xScale(414))
    .attr("fill", "green")

  svg.append('rect')
    .attr('x', 0)
    .attr('y', timeline.y)
    .attr('height', timeline.height)
    .attr('width', xScale(312))
    .attr("fill", "blue")

  svg.append('rect')
    .attr('x', 0)
    .attr('y', timeline.y)
    .attr('height', timeline.height)
    .attr('width', xScale(120))
    .attr("fill", "red")



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
  // console.log("wtf")
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