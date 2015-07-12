window.onload = function(){
Global = {}
var file = "data.json"

d3.json(file,ready)

Global.margin = margin = {top: 20, right: 10, bottom: 40, left: 10};

Global.width = width = 960 - margin.left - margin.right;
Global.height = height = 900 - margin.top - margin.bottom;

Global.svg = d3.select(".d3-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

Global.xScale = d3.scale.linear()
    .range([0, width])

var timeline = svg.append("line")
  .attr("x1", 0)
  .attr("y1", height/2)
  .attr("x2", width)
  .attr("y2", height/2)
  .attr("stroke-width", 2)
  .attr("stroke", "black");
}

function ready(error,raw){
  var svg = Global.svg
  var height =Global.height
  var width =Global.width
  var margin =Global.margin

  console.log("ready")
  data = raw.map(function(o){
    var newObj = o,
      month = o.date.split(" ")[0],
      year = o.date.split(" ")[1],
      dateValue = getMonthFromString(month)+((year-1981)*12)
    newObj.dateValue = dateValue
    return newObj
  })
  console.log(data)

  Global.xScale
  .domain(d3.extent(data,ƒ("dateValue")))




  // ********** Background Text ***************
  // ******************************************

  var allText = Global.allText = data.map(function(o,i){return "~"+o.blurb}).join(' ')

  var currentBlurb = -1
  var lineData = d3.wordwrap(Global.allText,100)
  .map(function(str){
    console.log(str)
    var returnArray = str.split("~").map(function(str,i){return [i+currentBlurb,str]})
    currentBlurb += returnArray.length - 1
    return returnArray
    // return "filler filler filler " + str + "filler filler filler"
  })

  // console.log(lineData)
  // var allText = allTextArray
  var text = svg.append('g.text-group')
  .append('text.all-text')
  // .attr('opacity',.5)

//Each line will have an array of arrays eg. [[1,"asdfsdf"],[2"sdfsdfsdf"]]
  var lineTspan = text.selectAll(".line-tspan")
  .data(lineData)
  .enter()
  .append("tspan")
  .attr("class","line-tspan")
  .attr("x",470)
  .attr("dy",15)
  .attr("text-anchor","middle")
  // .append("tspan")
  // .text("asdsadasdasdasd")

  lineTspan.selectAll(".blurb-tspan")
  .data(function(d){return d})
  .enter()
  .append("tspan")
  .attr("class",function(d){ return "blurb-tspan blurb-"+d[0]})
  .text(function(d){
    return d[1]

  })

  // d3.selectAll(".line-tspan")
  // .append("tspan")
  // .text("asadasdasdasdas")
  
  // .append()
  // .tspans(function(d){
  //   return d3.wordwrap(allText, 100);
  // });

  // d3.selectAll('.all-text tspan')
  // .attr("text-anchor","middle")
  // .attr('x',width/2)
  // addTspans()
  // ******************************************

  var items = svg.selectAll('.items')
    .data(data)
    .enter()
    .append('g')

  items.append('circle')
    .attr('cx',function(d){return Global.xScale(d.dateValue)})
    .attr('cy',height/2)
    .attr('r',10)
    .on("mouseover", itemMouseover)
    .on("mouseout", itemMouseout)
}



function itemMouseover(d,i){

  var scaleFactor = 1.45
  var translateFactor = (scaleFactor - 1) * -470

  var howFarDownToShift = 250 - (i * 53)
  d3.select('.text-group')
  .transition().duration(750)
  .attr("transform","translate("+translateFactor+","+howFarDownToShift+") scale("+scaleFactor+","+scaleFactor+")")

  d3.selectAll('.blurb-tspan:not(.blurb-'+i+')')
  .transition().duration(750)
  .attr('fill','blue')

  d3.selectAll('.blurb-'+i)
  .transition().duration(750)
  // .attr('opacity',1)
  .attr('fill',"red")
}

function itemMouseout(d,i){
  var dur = 1500
  d3.select('.text-group').transition().duration(dur).attr("transform","translate(0,0) scale(1,1)")

  // d3.selectAll('.blurb-tspan').transition()

  // d3.selectAll('.blurb-tspan:not(.blurb-'+i+')')
  // .transition().duration(dur)
  // .attr('fill',"blue")

  d3.selectAll('.blurb-tspan')
  .transition().duration(dur)
  // .attr('opacity',.5)
  .attr('fill',"grey")
  // d3.select('.text-group').transition().attr("transform","scale(1,1)")
}

function getMonthFromString(mon){
   var d = Date.parse(mon + "1, 2012");
   if(!isNaN(d)){
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


function addTspans(){
  var blurbCounter = -1
  originalHtml = d3.selectAll('.all-text tspan')[0].map(function(o){
    var tildes = 0
    var newTextContent = ""
    var html = "<tspan x='470' dy='15' text-anchor='middle'>filler filler<tspan class='blurb-"+blurbCounter+"'>"

    // console.log(o.textContent[i-1])
    for (var i = 0, len = o.textContent.length; i < len; i++) {
      if (o.textContent[i] === "~"){
        blurbCounter ++
        tildes ++
        newTextContent += "</tspan><tspan class='blurb-"+blurbCounter+"'>"
      } else {
        newTextContent += o.textContent[i]
      }
    }
    html += newTextContent
    // html += repeat("</tspan>",tildes+1)
    html += "</tspan>"
    html += "filler filler</tspan>"
    // console.log("html",html)
    return html

  }).join('')
  // console.log("originalHtml",originalHtml)
  d3.select('.all-text').html(originalHtml)
}