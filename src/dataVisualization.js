import "./main.css"
require("bootstrap")
const d3 = require("d3")
const $ = require("jquery")
/* eslint-disable */
export class Helper {
    wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1,
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
            while (word = words.pop()) {
                line.push(word)
                tspan.text(line.join(" "))
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop()
                    tspan.text(line.join(" "))
                    line = [word]
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
                }
            }
        })
    }
    setInputFilter(textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
            textbox.addEventListener(event, function () {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    this.value = "";
                }
            });
        });
    }
    tooltipFunction(divId) {
        var Tooltip = d3.select("#" + divId)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        return Tooltip
    }
    removeAllNanValue(headers, data, xAxis) {
        let newData = headers.map(function (d) {

            for (let i = 0; i < data.length; i++) {
                if (!isNaN(data[i][d])) {
                    return d
                }
            }

        })

        newData = newData.filter(function (el) {
            return (el != null || typeof el != "undefined") && el !== String(xAxis);
        });
        return newData
    }
}
class Grid {
    gridVisualization(input, headers, divId) {
        var table = d3.select("#" + divId)
                .append("div").attr("id", "gridVisualization").attr("style","margin-left: 20px;")
                .append("table").attr("id", "tblVis").attr("style",  "table-layout:fixed;width:100%"),
            thead = table.append("thead"),
            tbody = table.append("tbody"),
            tfoot = table.append("tfoot");

        thead.append("tr")
            .selectAll("th")
            .data(headers)
            .enter()
            .append("th")
            .attr("id", function (d) {
                return "th_" + d;
            })
            .attr("style","word-wrap: break-word")
            .text(function (column) {
                return column;
            }).append("button")
            .attr("class", "pull-right btnEyeSlash")
            .attr("data-toggle", "tooltip")
            .attr("title", "Hide Column")
            .append("i").on("click", function (d) {
            // eslint-disable-next-line no-undef
            let $el = $(this);
            let $cell = $el.closest('th,td')
            let $table = $cell.closest('table')
            let colIndex = $cell[0].cellIndex + 1;

            $table.find("tbody tr, thead tr")
                .children(":nth-child(" + colIndex + ")")
                .addClass('hide-col');
            $table.find(".footerRestoreColumn").show()
        })
            .attr("class", "fa fa-eye-slash eyeSlash");
        let rows = tbody.selectAll("tr")
            .data(input)
            .enter()
            .append("tr")
            .on("click", function (d) {
                let row = document.getElementById("tr_" + input.indexOf(d))

            }).attr("id", function (d) {
                return "tr_" + input.indexOf(d);
            });

        rows.selectAll("td")
            .data(function (row) {
                return headers.map(function (column) {
                    return {
                        column: column,
                        value: row[column]
                    };
                });
            })
            .enter()
            .append("td")
            .text(function (d) {
                return d.value;
            });

        tfoot.append("tr").attr("class", "footer-columns")
            .append("th")
            .attr("class", "footerRestoreColumn")
            .attr("colspan", headers.length)
            .append("a")
            .attr("class", "restore-columns")
            .attr("href", "#").text("Some columns hidden - click to show all");

        // eslint-disable-next-line no-undef
        $(".restore-columns").click(function (e) {
            var $table = $(this).closest('table')
            $table.find(".footerRestoreColumn").hide()
            $table.find("th, td")
                .removeClass('hide-col');

        })
        return table;
    }
}
class Graph {
    lineChart(data, allGroup, divId, xAxis,selectedValue) {

        var margin = {top: 10, right: 100, bottom: 30, left: 30},
            width = 1400 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;


        var svg = d3.select("#" + divId)
            .append("svg").attr("id","svgLineChartId")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var groups = d3.map(data, function (d) {
            return (d[xAxis])
        }).keys()

        var x = d3.scalePoint()
            .round(true)
            .range([0, width], 3)
            .padding(0.3)

        x.domain(groups)
        var y = d3.scaleLinear()
            .range([height - 50, 0]);
        let min = d3.min(data, d => Number(d[selectedValue])) < 0 ? d3.min(data, d => Number(d[selectedValue])) : 0
        y.domain([min, d3.max(data, d => Math.abs(d[selectedValue])+50)])


        svg.append("g").attr("id", "gxId")
            .attr("class", "axis")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x).ticks(10)).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.9em")
            .attr("dy", "-1.6em")
            .attr("transform", "rotate(-90)")
            .call(new Helper().wrap, x.bandwidth())

        let formatValue = d3.format(".2s");
        svg.append("g")
            .attr("class", "y axis").attr("id", "gyId")
            .call(d3.axisLeft(y).ticks(10).tickSize(5).tickFormat(function(d) { return formatValue(d)}));

        let colorArray = []
        for (let i in allGroup) {
            colorArray.push('#' + Math.floor(Math.random() * Math.pow(2, 32) ^ 0xffffff).toString(16).substr(-6))
        }
        let color = '#' + Math.floor(Math.random() * Math.pow(2, 32) ^ 0xffffff).toString(16).substr(-6);

        var lineColors = d3.scaleOrdinal()
            .domain(allGroup)
            .range(colorArray);


        var Tooltip = new Helper().tooltipFunction(divId)
        var mouseover = function (d) {
            Tooltip
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            Tooltip
                .html("Name: " + d[xAxis] + "<br>" + "Value: " + d[selectedValue])
                .style("top", (d3.event.pageY + 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }
        var mouseleave = function (d) {
            Tooltip
                .style("opacity", 0)
        }
        var line = svg
            .append('g')
            .append("path")
            .datum(data)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d[xAxis])
                })
                .y(function (d) {
                    return y(d[selectedValue])
                })
            )
            .attr("stroke", function (d) {
                return lineColors(d[selectedValue])

            })
            .style("stroke-width", 2)
            .style("fill", "none")

        var dot = svg
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr("class", "dot")
            .attr("cx", function (d) {
                return x(d[xAxis])
            })
            .attr("cy", function (d) {
                return y(d[selectedValue])
            })
            .attr("r", 4)
            .style("fill", color)
            .attr("stroke", "white")
        dot.on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


        function update(selectedGroup) {

            var dataFilter = data.map(function (d) {
                return {xAxis: d[xAxis], value: d[selectedGroup]}
            })
            let minUpdate = d3.min(dataFilter, d =>
                Number(d.value)) < 0 ? d3.min(dataFilter, d =>
                Number(d.value)) : 0

            y.domain([minUpdate, d3.max(dataFilter, d => Math.abs(d.value)+50)])
            document.getElementById("gyId").remove()
            document.getElementById("gxId").remove()
            svg.append("g").attr("id", "gxId")
                .attr("class", "axis")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(d3.axisBottom(x).ticks(10)).selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.9em")
                .attr("dy", "-1.6em")
                .attr("transform", "rotate(-90)")
                .call(new Helper().wrap, x.bandwidth())

            svg.append("g")
                .attr("class", "y axis").attr("id", "gyId")
                .call(d3.axisLeft(y).ticks(10).tickSize(5).tickFormat(function(d) { return formatValue(d)}));
            line
                .datum(dataFilter)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d.xAxis)
                    })
                    .y(function (d) {
                        return y(d.value)
                    })
                )

            dot
                .data(dataFilter)
                .transition()
                .duration(1000)
                .attr("cx", function (d) {
                    return x(d.xAxis)
                })
                .attr("cy", function (d) {
                    return y(d.value)
                })

            mousemove = function (d) {
                Tooltip
                    .html("Exact value: " + d.value)
                    .style("top", (d3.event.pageY + 10) + "px")
                    .style("left", (d3.event.pageX + 10) + "px");
            }
            dot.on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
        }

        d3.select("#connectedChartSelectId").on("change", function (d) {
            var selectedOption = d3.select(this).property("value")
            update(selectedOption)
        })

    }

    updateBarChartByBins(nbins, divId, headerToVis, xAxis, barC, input) {
        new Graph().createBarchart(nbins, divId, headerToVis, xAxis, barC)
        $("#nbins").on("input", function () {
            let d = input
            d = d.slice(0, +this.value)
            let grid = document.getElementById("gridVisualization")
            $("#" + divId).contents(':not(form)').remove();
            document.getElementById("divToVis").innerHTML = ""
            new Graph().createBarchart(d, divId, headerToVis, xAxis, barC)
            new Graph().changeBarStacked(d, divId, headerToVis, xAxis,input)

        });
    }
    updateConnectedChartByBins(data, headers, divId, xAxis, input) {
        var allGroup = headers

        allGroup = new Helper().removeAllNanValue(allGroup, data, xAxis)
        if ($(".barChartRadioForm")!=null){
            $(".barChartRadioForm").remove()
        }
        if ($(".connectedChartSelectDiv")!=null){
            $(".connectedChartSelectDiv").remove()
        }
        d3.select(".gridGraphBtnDiv").append("div").attr("class", "connectedChartSelectDiv")
            .append("select").attr("id", "connectedChartSelectId").selectAll("option")
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) {
                return d;
            })
            .attr("value", function (d) {
                return d;
            })
        new Graph().lineChart(data, allGroup, divId, xAxis,allGroup[0])
        $("#nbins").on("input", function () {
            let d = input
            d = d.slice(0, +this.value)
            var selectedOption = $( "#connectedChartSelectId option:selected" ).text()
            $("#svgLineChartId").remove();
            document.getElementById("divToVis").innerHTML = ""
            new Graph().lineChart(d, allGroup, divId, xAxis,selectedOption)
        });
    }
    changeBarStacked(nbins, divId, headerToVis, xAxis, input) {
        $('#modeForm input').on('change', function () {
            let selectedRadio = $('input[name=mode]:checked', '#modeForm').val()
            if (selectedRadio == "grouped") {
                $("#" + divId).contents(':not(form)').remove();
                new Graph().updateBarChartByBins(nbins, divId, headerToVis, xAxis, "grouped", input)
            }
            if (selectedRadio == "stacked") {
                $("#" + divId).contents(':not(form)').remove();
                new Graph().updateBarChartByBins(nbins, divId, headerToVis, xAxis, "stacked", input)
            }
        });
    }
    createBarchart(data, divId, headerToVis, xAxis, barC) {
        var margin = {top: 10, right: 30, bottom: 20, left: 50},
            width = 1400 - margin.top - margin.bottom,
            height = 400 - margin.top - margin.bottom;
        var svg = d3.select("#" + divId)
            .append("svg")
            .attr("width", $("#"+divId).width())
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var subgroups = headerToVis
        let colorArray = []
        for (let i in subgroups) {
            let color = '#' + Math.floor(Math.random() * Math.pow(2, 32) ^ 0xffffff).toString(16).substr(-6);
            colorArray.push(color)
        }
        var color = d3.scaleOrdinal().domain(subgroups).range(colorArray)
        var tooltip = new Helper().tooltipFunction(divId)
        var mousemove = function (d) {
            tooltip
                .style("top", (d3.event.pageY + 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }
        var mouseleave = function (d) {
            tooltip.style("opacity", 0)
        }

        let minArr = []
        for (let i in subgroups) {
            var min = d3.min(data, d => d[subgroups[i]]);
            minArr.push(Number(min))
        }
        let minY;
        if (Number(d3.min(minArr)) < 0) {
            minY = Number(d3.min(minArr))
        } else {
            minY = 0
        }
        var groups = d3.map(data, function (d) {
            return (d[xAxis])
        }).keys()


        var x = d3.scaleBand()
            .domain(groups)
            .rangeRound([0, width], .1, .3)
            .paddingOuter(0.1)
            .paddingInner(0.5)

        if (barC == "stacked") {
            var stackedData = d3.stack()
                .keys(subgroups).offset(d3.stackOffsetDiverging)
                (data)
            var mouseover = function (d) {
                var subgroupName = d3.select(this.parentNode).datum().key;
                var subgroupValue = d.data[subgroupName];
                tooltip
                    .html("Name: " + subgroupName + "<br>" + "Value: " + subgroupValue)
                    .style("opacity", 1)
            }
            var y = d3.scaleLinear()
                .domain([minY, d3.max(stackedData, d => d3.max(d, d => d[1]))])
                .range([height - 30, 0]);

            svg.append("g")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(d3.axisBottom(x).tickSize(0)).selectAll(".tick text")
                .call(new Helper().wrap, x.bandwidth());

            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y).tickSize(5));

            svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                .merge(svg)
                .attr("fill", function (d) {
                    return color(d.key);
                })
                .selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter().append("rect")
                .attr("x", function (d) {
                    return x(d.data[xAxis]);
                })
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("height", function (d) {
                    return y(d[0]) - y(d[1]);
                })
                .attr("width", x.bandwidth())
                .attr("stroke", "grey")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
            svg
                .exit().remove();
        }
        if (barC == "grouped") {
            let maxArr = []
            for (let i in subgroups) {
                var max = d3.max(data, d => d[subgroups[i]]);
                maxArr.push(max)
            }
            var y = d3.scaleLinear()
                .domain([minY, Number(d3.max(maxArr)) + 100])
                .range([height - 30, 0]);

            var xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.3])
            var mouseover = function (d) {
                tooltip
                    .html("Name: " + d.key + "<br>" + "Value: " + d.value)
                    .style("opacity", 1)
            }
            svg.append("g")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(d3.axisBottom(x).tickSize(0)).selectAll(".tick text")
                .call(new Helper().wrap, x.bandwidth())

            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y).tickSize(5));
            svg.append("g")
                .selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function (d) {
                    return "translate(" + x(d[xAxis]) + ",0)";
                })
                .selectAll("rect")
                .data(function (d) {
                    return subgroups.map(function (key) {
                        return {key: key, value: d[key]};
                    });
                })
                .enter().append("rect")
                .attr("x", function (d) {
                    return xSubgroup(d.key);
                })
                .attr("y", function (d) {
                    return y(Math.max(0, d.value));
                })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", function (d) {
                    return Math.abs(y(d.value) - y(0));
                })

                .attr("fill", function (d) {
                    return color(d.key);
                })
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
            svg
                .exit().remove();
        }

        var legendContainer = d3.select('#' + divId).append('div')
            .attr('class', 'legend-container')
            .attr("style", "max-width:" + width + "px")
        let legend = legendContainer.selectAll(".legend")
            .data(color.domain())
            .enter().append("g").append("div")
            .attr("class", "legend")
            .attr("order", function (d, i) {
                return i
            })

        legend.append("span")
            .attr("class", "legend-color")
            .style("background-color", color);

        legend.append("span")
            .text(function (d) {
                return d;
            })
    }
    barChart(nbins, divId, headerToVis, xAxis, input) {

        if ($(".connectedChartSelectDiv")!=null){
            $(".connectedChartSelectDiv").remove()
        }
        if ($(".barChartRadioForm")!=null){
            $(".barChartRadioForm").remove()
        }

        var form = d3.select(".gridGraphBtnDiv")
            .append("form").attr("id", "graphVisualization").attr("class", "barChartRadioForm");

        var radioDiv = form.append("div").attr("id", "modeForm")
        radioDiv.append("label").text("Stacked").append("input").attr("class", "barChartRadio")
            .attr("type", "radio")
            .attr("name", "mode").attr("value", "stacked").attr("id", "stacked")
        radioDiv.append("label").text("Grouped").append("input").attr("type", "radio")
            .attr("class", "barChartRadio")
            .attr("name", "mode").attr("value", "grouped").attr("id", "grouped")

        $(document).ready(function () {
            $('input[type="radio"]:first').trigger('click');
        });
        new Graph().changeBarStacked(nbins, divId, headerToVis, xAxis, input)

    }
}
class Generator{
    chartModal(input, headers, idChart, xAxisId, textChart, submitBtnId, footerText) {
        var modal = d3.select("body").append("div").attr("class", "modal fade").attr("id", idChart)
            .attr("tabindex", "-1")
            .attr("role", "dialog")
            .attr("aria-labelledby", "myModalLabel")
            .attr("aria-hidden", true)

        var modal_dialog = modal.append("div").attr("class", "modal-dialog")
        var modal_content = modal_dialog.append("div").attr("class", "modal-content")
        var modal_header = modal_content.append("div").attr("class", "modal-header")
        modal_header.append("h5").attr("class", "modal-title").attr("id", "myModalLabel").text(textChart)
        modal_header.append("button").attr("type", "button").attr("class", "close")
            .attr("data-dismiss", "modal").attr("aria-label", "Close").attr("aria-hidden", true)
            .text("x")
        var modal_body = modal_content.append("div").attr("class", "modal-body")
        var fieldsetXAxis = modal_body.append("fieldset")
            .attr("class", "fieldsetBorder")
        fieldsetXAxis.append("legend").attr("class", "legendStyle").text("X Axis ")
        fieldsetXAxis.append("label").attr("class", "xAxisDiv")
            .text("Select").append("select")
            .attr("id", xAxisId)
            .attr("style", "margin-left:10px").selectAll("option")
            .data(headers).enter().append("option").text(function (d) {
            return d
        })

        if (textChart === "Bar Chart") {
            modal_body.append("div").attr("class", "vl")
            var fieldsetYAxis = modal_body.append("fieldset").attr("class", "fieldsetBorder")
            fieldsetYAxis.append("legend").attr("class", "legendStyle").text("Y Axis ")
            fieldsetYAxis.append("div").attr("class", "fieldsetYAxis").selectAll("input")
                .data(headers)
                .enter()
                .append("div").attr("style", "margin-left: 10px;")
                .append('label')
                .attr('for', function (d, i) {
                    return 'a' + i;
                })
                .attr('order', function (d, i) {
                    return i;
                })
                .text(function (d) {
                    return d;
                })
                .append("input").attr("style", "margin-left:5px")
                .attr("checked", true)
                .attr("type", "checkbox")
                .attr("name", "yAxisBarChartSelect")
                .attr("value", function (d) {
                    return d
                })
                .attr("id", function (d, i) {
                    return 'a' + i;
                })
        }
        var modal_footer = modal_content.append("div").attr("class", "modal-footer")
            .text(footerText)
        var pullRightDiv = modal_footer.append("div").attr("class", "pull-right")
        pullRightDiv.append("button").attr("class", "btn btn-secondary")
            .attr("data-dismiss", "modal").text("Cancel")
        pullRightDiv.append("div").attr("class", "pull-right").append("button").attr("class", "btn btn-warning")
            .attr("style", "margin-left:10px")
            .attr("id", submitBtnId)
            .attr("type", "submit").text("Confirm")
    }
    changeNbinsFormStyle(binsFormId) {
        let nbinsform_nav = d3.select("#"+binsFormId).append("div").attr("class",binsFormId+"-nav")
        let nbinsFormUp = nbinsform_nav.append("div").attr("class","nbinsForm-btn nbinsForm-up").text("+")
        let nbinsFormDown= nbinsform_nav.append("div").attr("class","nbinsForm-btn nbinsForm-down").text("-")

        let inputForm = $("#"+binsFormId).find('input[type="number"]'),
            min = inputForm.attr('min'),
            max = inputForm.attr('max');
        nbinsFormUp.on("click",function (d) {
            var oldValue = parseFloat(inputForm.val());
            if (oldValue >= max) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue + 1;
            }
            inputForm.val(newVal)
            inputForm.trigger("change");
            inputForm.trigger("input");
            inputForm.trigger("keypress");
        })
        nbinsFormDown.on("click",function (d) {
            var oldValue = parseFloat(inputForm.val());
            if (oldValue <= min) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue - 1;
            }
            inputForm.val(newVal);
            inputForm.trigger("input");
            inputForm.trigger("change");
            inputForm.trigger("keypress");
        })

    }
    generateBC(nbins,input) {
        let xAxisBarChartSelected = d3.select("#xAxisBarChartSelect").node().value;
        var yAxisBarChartSelected = [];

        $.each($("input:checkbox[name='yAxisBarChartSelect']:checked"), function () {
            yAxisBarChartSelected.push($(this).val());
        });
        document.getElementById("divToVis").innerHTML = ""
        $('#BarChartModal').modal('hide');
        $('.modal-backdrop').remove();
        new Graph().barChart(nbins, "divToVis", yAxisBarChartSelected, xAxisBarChartSelected, input)
    }
    generateCC(nbins, input,headers) {
        let xAxisConnectedChartSelect = d3.select("#xAxisConnectedChartSelect").node().value;
        document.getElementById("divToVis").innerHTML = ""
        $('#ConnectedChartModal').modal('hide');
        $('.modal-backdrop').remove();
        new Graph().updateConnectedChartByBins(nbins, headers, "divToVis", xAxisConnectedChartSelect, input)
    }
}
function createDiv(sheetname, i) {
    var button = document.createElement('BUTTON');
    var text = document.createTextNode(sheetname);
    button.id = "btn_" + sheetname
    button.style = "order:" + i+";margin-right:3px"
    button.appendChild(text);
    return button;
}
export class ChartCreator{
    visualization(input, headers, divId, buttonDiv) {
        let generator = new Generator()
        let table = new Grid()
        if ($(".barChartRadioForm")!=null){
            $(".barChartRadioForm").remove()
        }
        if ($(".connectedChartSelectDiv")!=null){
            $(".connectedChartSelectDiv").remove()
        }
        if (document.getElementById("nbinsForm") != null) {
            $("#BarChartModal").remove();
            $("#ConnectedChartModal").remove();
        }
        generator.chartModal(input, headers, "BarChartModal", "xAxisBarChartSelect", "Bar Chart", "confirmBarchart", "A bar chart plots numeric values for levels " +
            "of a categorical feature as bars. " +
            "Levels are plotted on one chart axis, and values are plotted on the other axis.")

        generator.chartModal(input, headers, "ConnectedChartModal", "xAxisConnectedChartSelect", "Connected Graph", "confirmConnectedchart",
            "It is a connected scatterplot is basically an hybrid between a scatterplot and a lineplot" +
            "You have to chose xAxis to render it.")

        if ($("#nbinsForm").length !== 0) {
            document.getElementById("nbinsForm").remove();
        }

        var nbinsDiv = buttonDiv.append("div").attr("id", "nbinsForm")
        nbinsDiv.append("input").attr("id", "nbins").attr("class", "barChartRadio")
            .attr("type", "number").attr("min", "1").attr("id", "nbins").attr("max", input.length)
            .attr("value", Math.round(input.length / 2))

        generator.changeNbinsFormStyle("nbinsForm")
        document.getElementById("gridBtnForAddEvent").addEventListener("click",
            function  gridClick() {
                let grid = new Grid()
                if ($(".barChartRadioForm")!=null){
                    $(".barChartRadioForm").remove()
                }
                if ($(".connectedChartSelectDiv")!=null){
                    $(".connectedChartSelectDiv").remove()
                }
                document.getElementById("divToVis").innerHTML = ""
                grid.gridVisualization(input.slice(0, document.getElementById("nbins").value), headers, "divToVis")
                $("#nbins").on("input", function () {
                    let d = input
                    d = d.slice(0, +this.value)
                    document.getElementById("divToVis").innerHTML = ""
                    grid.gridVisualization(d, headers, "divToVis")
                });
            });

        document.getElementById("confirmBarchart").onclick = function () {
            let d = input
            d = d.slice(0, document.getElementById("nbins").value)
            generator.generateBC(d,input)
        }
        document.getElementById("confirmConnectedchart").onclick = function () {
            let d = input
            d = d.slice(0, document.getElementById("nbins").value)
            generator.generateCC(d, input, headers)
        }
        d3.select("#" + divId).append("div").attr("id", "divToVis")

        table.gridVisualization(input.slice(0, Math.round(input.length / 2)), headers, "divToVis")
        new Helper().setInputFilter(document.getElementById("nbins"), function (value) {
            return /^[1-9]\d*$/.test(value) && (value === "" || parseInt(value) <= input.length);
        });

        $("#nbins").on("input", function () {
            let d = input
            d = d.slice(0, +this.value)
            let grid = document.getElementById("gridVisualization")
            if (grid != null) {
                document.getElementById("divToVis").innerHTML = ""
                table.gridVisualization(d, headers, "divToVis")
            }
        });
    }
    realTimeChartRender() {
        var datum, data,
            barId = 0,
            xAxisG,
            xAxis, yAxis

        var chart = function (s) {
            let height = 150;
            let width = $("#chartDiv").width() - 100;
            let margin = {top: 60, bottom: 20, left: 50, right: 30}
          let streamHeader = s.append("div").attr("id","streamHeader")
          function streamHeaderCreator(container, h,l, w, t,color,spanText,borderRadius){
            let header =  container.append("div").attr("id","header_At_"+l)
              .attr("style",
                "left:"+l+"px;"+
                "top:"+t+"px;"+
                "position:absolute;"+
                "width:"+w+"px;"+
                "height:"+h+"px;"+
                "background:"+color+";"+
                "border-radius: "+borderRadius+";"+
                "color: white;"+
                "text-align: center;")
              .append("span").text(spanText)
          }
          let deadPoint = 240
          streamHeaderCreator(streamHeader, 30,deadPoint, 50, margin.top+1,"rgba(137,145,161,.9)","-120s","0px 5px 0px 15px;")
          streamHeaderCreator(streamHeader, 30,width/2+120, 50, margin.top+1,"rgba(137,145,161,.9)","-60s","0px 5px 0px 15px;")
          streamHeaderCreator(streamHeader, 30,width, 50, margin.top+1,"rgba(137,145,161,.9)","Now","0px 5px 0px 15px;")

            let svg = s.append("svg")
                .attr("width", "100%")
                .attr("height", 500)

            var main = svg.append("g")
                .attr("transform", "translate (" + margin.left + "," + margin.top + ")");

            main.append("defs").append("clipPath")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height);

            function filter(container, level){
              container.append("defs")
                .append("filter")
                .attr("id", "blur_"+level)
                .append("feGaussianBlur")
                .attr("stdDeviation", level);
            }
           filter(svg,0.5)
           filter(svg,2)
            let livearea = main.append("rect")
                .attr("x", deadPoint)
                .attr("y", 0)
                .attr("width", width - deadPoint)
                .attr("height", height)
                //.attr("style", "stroke: black;")
                .style("fill", "#9ca9aa")
                .style("stroke-dasharray", "2280")
              //.attr("filter", "url(#blur)")
          function lineCreator(container, point, height, strokeWidth,color){
              container.append('line').attr("id","line_at_"+point)
                .attr('x1', point)
                .attr('y1', 0)
                .attr('x2', point)
                .attr('y2', height)
                .style("stroke-width", strokeWidth)
                .style("stroke", color)
                .style("fill", "none");
          }
            lineCreator(main, deadPoint, height,0.5,"white")
            lineCreator(main, width/2+120, height,0.5,"white")
            lineCreator(main, width-5, height,10,"#a09e9b")
            let deadArea = main.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", deadPoint)
                .attr("height", height)
                //.attr("style", "stroke: black;")
                .style("fill", "#9ca9aa")
                .style("stroke-dasharray", "101, 198, 300")
            deadArea.attr("filter", "url(#blur_0.5)");

            var barG = main.append("g")
                .attr("class", "barGroup")
                .attr("transform", "translate(0, 0)")
                .append("g");

            xAxisG = main.append("g")
                .attr("class", "x_axis")
                .attr("transform", "translate(0," + height + ")");

            main.append("g")
                .attr("class", "y axis");
            let x = d3.scaleTime().range([0, width]);

            xAxis = d3.axisBottom().scale(x).tickSize(0);
            yAxis = d3.axisLeft();

            var endTime = new Date(new Date().getTime());
            var startTime = new Date(endTime.getTime() - 20000);

            data = [];
            update();
            var Tooltip = new Helper().tooltipFunction("chartDiv")

            var mouseover = function (d) {
                Tooltip
                    .style("opacity", 1)
            }

            var mousemove = function (d) {
              let jsonData = JSON.parse(d.description)
              let keys = Object.keys(jsonData)

              let description = ""
              for (let key in keys){
                description = description+ keys[key]+ ": "+jsonData[keys[key]]+"<br>"
              }
                Tooltip
                    .html(d.description)

                    .style("top", (height/d.position) + "px")

                    .style("left", (Math.round(x(d.time - 1000)) + 50) + "px");
            }

            var mouseleave = function (d) {
                Tooltip
                    .style("opacity", 0)
            }
            var viewPoint
          let randomStop = Math.floor((Math.random() * deadPoint) + 1)
          svg.append("defs")
            .append("filter")
            .attr("id", "blur2")
            .append("feGaussianBlur")
            .attr("stdDeviation", 2);
          function update() {

                data = data.filter(function (d) {
                    if (d.time.getTime() > startTime.getTime()) return true;
                })

                viewPoint = barG.selectAll(".bar")
                    .data(data);
                viewPoint.exit().remove();

                viewPoint.enter()
                    .append(function (d) {
                        var type = d.type || "circle";
                        var node = document.createElementNS("http://www.w3.org/2000/svg", type);
                        return node;
                    })
                    .attr("class", "bar")
                    .attr("id", function () {
                        return "bar-" + barId++;
                    });
                viewPoint
                    .attr("cx", function (d) {
                        if (Math.round(x(d.time - 1000)) > randomStop) {
                            return Math.round(x(d.time - 1000));
                        } else {
                            return randomStop
                        }
                    })
                    .attr("cy", function (d) {
                        return height / d.position;
                    })
                    .attr("r", function (d) {
                        return d.size / 2;
                    })
                    .style("fill", function (d) {
                        return d.color || "black";
                    })
                    .style("fill-opacity", function (d) {
                        return d.opacity || 1;
                    }).on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)

                viewPoint.attr("filter",function (d) {
                    if (Math.round(x(d.time - 1000)) < deadPoint){
                        return "url(#blur_2)"
                    }
                })


            }

            setInterval(function () {
                endTime = new Date();
                startTime = new Date(endTime.getTime() - 150000);
                x.domain([startTime, endTime]);
                xAxis.scale(x)(xAxisG);
                update();
            }, 200)

            return chart;
        }


        chart.render = function (e) {
            if (arguments.length == 0) return datum;
            datum = e;
            data.push(datum);
            return chart;
        }
        return chart;
    }
}
export function errorHTML(divId, headerErrorText, text2) {
    document.getElementById(divId).innerHTML = ""
    var error = d3.select("#" + divId).append("div")
        .attr("class", "js-temp-notice alert alert-warning alert-block")
    error.append("h3").attr("class", "alert-heading").text(headerErrorText)
    error.append("p").text(text2)
}
export function createAndModifyDivs(mainDivId, workSheets) {
    var buttonDiv = document.createElement("div");
    var showSheet = document.createElement("div");
    showSheet.style = "display: flex"
    showSheet.id = "showSheet"
    showSheet.className = "showSheet"
    var mainDiv = document.getElementById(mainDivId),
        myDivs = []
    mainDiv.appendChild(showSheet)
    for (let i = 0; i < workSheets.length; i++) {
        myDivs.push(createDiv(workSheets[i], i));
        buttonDiv.appendChild(myDivs[i]);
    }
    buttonDiv.id = "sheetsDiv"
    buttonDiv.style = "display: flex;flex-wrap: wrap;justify-content: center;margin-top: 10px;"
    mainDiv.appendChild(buttonDiv)
}
export function createBtnDiv(divId) {
    let da = ["ConnectedChart", "BarChart"]
    var buttonDiv = d3.select("#" + divId).append("div").attr("class", "gridGraphBtnDiv")
    var grid = buttonDiv.append("button").text("Grid").attr("class", "btn btn-primary")
        .attr("id","gridBtnForAddEvent")
    var visualizationBtn = buttonDiv.append("div").attr("class", "dropdown");
    visualizationBtn.append("button")
        .attr("class", "btn btn-primary dropdown-toggle")
        .attr("style", "margin-left:5px")
        .attr("id", "selectedBtn")
        .attr("data-toggle", "dropdown")
        .text("Graph")
    visualizationBtn
        .append("div").attr("class", "dropdown-menu").attr("style", "padding:0").selectAll("li")
        .data(da)
        .enter().append("li").append("a")
        .attr("data-toggle", "modal")
        .attr("href", "")
        .attr("data-target", function (d) {
            var dataTarget = "#" + d + "Modal"
            return dataTarget;
        })
        .text(function (d) {
            return d;
        })
  let delimiter = ["Comma", "Semicolon", "Space", "Tab","Pipe"]
  let delimiterDiv = buttonDiv.append("div").attr("id","selectForm")
  delimiterDiv.append("label").attr("style","margin-left:5px;margin-right:5px;").text("Delimeter: ")
  delimiterDiv.append("select").attr("id","delimiterSelect").selectAll("option")
    .data(delimiter).enter().append("option").text(function (d) {
    return d})
  if ($("#nbinsForm").length !== 0) {
    document.getElementById("nbinsForm").remove();
  }

  var nbinsDiv = buttonDiv.append("div").attr("id", "nbinsForm")
  nbinsDiv.append("input").attr("id", "nbins").attr("class", "barChartRadio")
    .attr("type", "number").attr("min", "1").attr("id", "nbins")
    return buttonDiv
}
