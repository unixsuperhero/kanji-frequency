function chartWrapper(t,a){var e=$("<div/>",{"class":a}),n=$("<div/>",{"class":"chart-wrapper"});e.append(n),n.append($("<div/>",{"class":"chart-title"}).text(t));var r=$("<div/>",{"class":"chart"});return n.append(r),e}function freqCoverChart(t,a,e){var n={top:20,right:40,bottom:30,left:40},r=Math.max(t.innerWidth(),1100)-n.left-n.right,i=300-n.top-n.bottom,o=d3.scale.ordinal().rangeRoundBands([0,r],.1),l=d3.scale.linear().range([i,0]),s=d3.scale.linear().range([i,0]),c=d3.svg.axis().scale(o).orient("bottom"),d=d3.svg.axis().scale(l).orient("left").ticks(10,"%"),p=d3.svg.axis().scale(s).orient("right").ticks(10,"%"),f=d3.svg.line().x(function(t){return o.rangeBand()/2+o(t[0])}).y(function(t){return s(t[3])}),m=d3.select(t.get()[0]).append("svg").attr("width",r+n.left+n.right).attr("height",i+n.top+n.bottom).append("g").attr("transform","translate("+n.left+","+n.top+")"),u=_(e.table).tail().take(100),h=0;u.forEach(function(t){t.push(h+t[2]),h+=t[2]}),o.domain(u.map(function(t){return t[0]}).value()),l.domain([0,u.map(function(t){return t[2]}).max()]),s.domain([0,u.map(function(t){return t[3]}).max()]),m.append("g").attr("class","x axis").attr("transform","translate(0,"+i+")").call(c),m.append("g").attr("class","y axis left").call(d).append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy",".7em").style("text-anchor","end").text("Frequency"),m.append("g").attr("class","y axis right").attr("transform","translate("+r+" ,0)").call(p).append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy","-1.2em").style("text-anchor","end").text("Coverage"),m.selectAll(".bar").data(u.value()).enter().append("rect").attr("class","bar").attr("x",function(t){return o(t[0])}).attr("width",o.rangeBand()).attr("y",function(t){return l(t[2])}).attr("height",function(t){return i-l(t[2])}),m.append("path").attr("class","secondary").attr("d",f(u.value()))}var kanjiData={aozora:{fileName:"aozora.json",description:'Books from <a href="http://www.aozora.gr.jp/">Aozora Bunko</a>'},news:{fileName:"news.json",description:"Online news articles"},twitter:{fileName:"twitter.json",description:'Twitter messages collected by a <a href="https://github.com/scriptin/twitter-kanji-frequency">bot</a>'},wikipedia:{fileName:"wikipedia.json",description:'Wikipedia articles and pages from <a href="https://dumps.wikimedia.org/jawiki/">dumps<a/>'}},getJson=Promise.promisify(d3.json);$(".templates").html('<div class="col-xs-12 loading"><em>Loading...</em></div>'),Promise.all(_.map(_.toPairs(kanjiData),function(t){var a=t[0],e=kanjiData[a];return getJson(t[1].fileName).then(function(t){e=_.merge(e,{name:_.upperFirst(a),table:t,kanjiTotalCount:t[0][1],kanjiDistinctCount:t.length-1})})})).then(function(){function t(t){return t==parseInt(t,10)}function a(a){var e=100*a;return(t(e)?e:e.toFixed(6))+"%"}$(".templates .loading").remove(),_.forEach(kanjiData,function(t,a){var e=$("<div/>",{"class":"col-md-6 col-lg-3"}).html(generalInfo(t));$("#general-info .templates").append(e)});var e=$("<select/>",{"class":"form-control input-sm"});_(kanjiData).keys().forEach(function(t,a){var n=$("<option/>").val(t).text(kanjiData[t].name);e.append(n),0==a&&n.attr("selected",!0)});var n=$("#table").DataTable({dom:'<"#table-toolbar">fti',data:kanjiData[e.val()].table.map(function(t,a){return[a].concat(t)}),columns:[{title:"#"},{title:"Kanji"},{title:"Count",searchable:!1},{title:"Percent",render:a,type:"num-fmt",searchable:!1}],deferRender:!0,scroller:!0,scrollY:300});$("#table-toolbar").append(e),e.change(function(t){t.preventDefault(),n.clear(),n.rows.add(kanjiData[$(this).val()].table.map(function(t,a){return[a].concat(t)})),n.draw()}),_.forEach(kanjiData,function(t,a){var e=chartWrapper(t.name,"col-xs-12");$("#zipf-law .templates").append(e),freqCoverChart(e.find(".chart"),a,t)})});var generalInfo=_.template('<dl><dt><%- name %></dt><dd><%= description %><ul class="list-unstyled"><li>kanji total: <code><%- kanjiTotalCount %></code> &asymp; <% print((kanjiTotalCount / 1000000).toFixed(1) + "M") %></li><li>kanji distinct: <code><%- kanjiDistinctCount %></code></li></ul></dd></dl>');