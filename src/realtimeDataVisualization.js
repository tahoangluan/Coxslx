export function realTimeChartRender() {
    var datum, data,
        barId = 0,
        xAxisG, yAxisG,
        xAxis, yAxis

    var chart = function(s) {
        let height = 200 ;
        let width = 1400;
        let margin = { top: 20, bottom: 20, left: 100, right: 30}
        let svg = s.append("svg")
            .attr("width", 2000)
            .attr("height", 400)

        var main = svg.append("g")
            .attr("transform", "translate (" + margin.left + "," + margin.top + ")");

        main.append("defs").append("clipPath")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height);

        main.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("style","stroke: black;")
            .style("fill", "rgb(206, 206, 206)")

        var barG = main.append("g")
            .attr("class", "barGroup")
            .attr("transform", "translate(0, 0)")
            .append("g");

        xAxisG = main.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

        yAxisG = main.append("g")
            .attr("class", "y axis");

        let x = d3.scaleTime().range([0, width]);

        xAxis = d3.axisBottom().scale(x).tickSize(0);
        yAxis = d3.axisLeft();

        var endTime = new Date(new Date().getTime());
        var startTime = new Date(endTime.getTime() - 20000);

        var viewport = d3.brushX()
            .extent([startTime, endTime])
            .on("brush", function () {
                update();
            });
        data = [];
        update();

        function update() {

            data = data.filter(function(d) {
                if (d.time.getTime() > startTime.getTime()) return true;
            })

            var viewPoint = barG.selectAll(".bar")
                .data(data);
            viewPoint.exit().remove();

            viewPoint.enter()
                .append(function(d) {
                    var type = d.type || "circle";
                    var node = document.createElementNS("http://www.w3.org/2000/svg", type);
                    return node;
                })
                .attr("class", "bar")
                .attr("id", function() {
                    return "bar-" + barId++;
                });

            viewPoint
                .attr("cx", function(d) { return Math.round(x(d.time-1000));})
                .attr("cy", function(d) {return height/2;})
                .attr("r", function(d) {return d.size / 2;})
                .style("fill", function(d) { return d.color || "black"; })
                .style("fill-opacity", function(d) { return d.opacity || 1; });


        }
        setInterval(function() {
            endTime = new Date();
            startTime = new Date(endTime.getTime() - 150000);
            viewport.extent([startTime, endTime])
            x.domain([startTime, endTime]);
            xAxis.scale(x)(xAxisG);
            update();
        }, 200)

        return chart;
    }


    chart.render = function(e) {
        if (arguments.length == 0) return datum;
        datum = e;
        data.push(datum);
        return chart;
    }
    return chart;
}