import {realTimeChartRender} from "./realtimeDataVisualization.js"
export class RealtimeGenerator {
    constructor(divId) {
        this.divId = divId
    }
    divGenerator(){
        let divId = this.divId
        var chart = realTimeChartRender()

        d3.select("#"+divId).append("div")
            .attr("id", "chartDiv")
            .call(chart);
        return chart
    }
    dataGenerator(data, chart) {
        var timeScale = d3.scaleLinear()
            .domain([4000, 18000])
            .range([4000, 18000])
            .clamp(true);
        var normal = d3.randomNormal(10000, 2000);
        var timeout = Math.round(timeScale(normal()));
        setTimeout(function() {
            if (data!=null){
                let jsonData = JSON.parse(data)
                var now = new Date(new Date().getTime());
                console.log("jsonData ",jsonData)
                console.log("now ",now)
                let color = '#' + Math.floor(Math.random() * Math.pow(2, 32) ^ 0xffffff).toString(16).substr(-6);
                var point = {
                    time: now,
                    color: color,
                    opacity: 1,
                    type: "circle",
                    size: 20,
                };
                chart.render(point);
            }
            new RealtimeGenerator().dataGenerator();
        }, timeout);
    }
}


