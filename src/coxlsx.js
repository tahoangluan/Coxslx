import "/node_modules/d3/dist/d3.min.js";
import "/node_modules/d3/dist/d3.js";
import "/node_modules/d3-dsv/dist/d3-dsv.js";
import "/node_modules/jquery/dist/jquery.min.js";
import "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

function includeCss(fileName,cssId) {
    if (!document.getElementById(cssId))
    {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = fileName;
        link.media = 'all';
        head.appendChild(link);
    }
}
includeCss('src/main.css',"mainCss")
includeCss('/node_modules/font-awesome/css/font-awesome.css',"fontAwesomeCss")
includeCss('/node_modules/bootstrap/dist/css/bootstrap.min.css',"bootstrapCss")


function render(file, divId) {

    let da = ["ConnectedChart", "BarChart"]
    var buttonDiv = d3.select("#" + divId).append("div").attr("class", "gridGraphBtnDiv")
    var grid = buttonDiv.append("button").text("Grid").attr("class", "btn btn-primary")
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
    if (file.endsWith(".csv")) {
        csvFromFileToTable(file, divId, grid, buttonDiv)
    } else if (file.endsWith(".ods") || file.endsWith(".xlsx") || file.endsWith(".xls")) {
        xlxsReadFile(file, divId, grid, buttonDiv)
    } else {
        console.log("Not Support")
        errorHTML(divId, "File type not supported!",
            "You are trying to render a file type that is not supported. " +
            "Please make sure your file is created in xlx, xlsx, ods or csv.")

    }
}

function errorHTML(divId, headerErrorText, text2) {
    var error = d3.select("#" + divId).append("div")
        .attr("class", "js-temp-notice alert alert-warning alert-block")
    error.append("h3").attr("class", "alert-heading").text(headerErrorText)
    error.append("p").text(text2)
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
        xhr.withCredentials = true;
    } else {
        xhr = null;
    }
    return xhr;
}

function barChart(nbins, divId, headerToVis, xAxis, input) {

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
    changeBarStacked(nbins, divId, headerToVis, xAxis, input)

}

function wrap(text, width) {
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

function updateBarChartByBins(nbins, divId, headerToVis, xAxis, barC, input) {
    createBarchart(nbins, divId, headerToVis, xAxis, barC)
    $("#nbins").on("input", function () {
        let d = input
        d = d.slice(0, +this.value)
        let grid = document.getElementById("gridVisualization")
            $("#" + divId).contents(':not(form)').remove();
            document.getElementById("divToVis").innerHTML = ""
            createBarchart(d, divId, headerToVis, xAxis, barC)
            changeBarStacked(d, divId, headerToVis, xAxis,input)

    });
}

function changeBarStacked(nbins, divId, headerToVis, xAxis, input) {
    $('#modeForm input').on('change', function () {
        let selectedRadio = $('input[name=mode]:checked', '#modeForm').val()
        if (selectedRadio == "grouped") {
            $("#" + divId).contents(':not(form)').remove();
            updateBarChartByBins(nbins, divId, headerToVis, xAxis, "grouped", input)
        }
        if (selectedRadio == "stacked") {
            $("#" + divId).contents(':not(form)').remove();
            updateBarChartByBins(nbins, divId, headerToVis, xAxis, "stacked", input)
        }
    });
}

function xlxsReadFile(file, id, grid, buttonDiv) {
    var url = file;
    var request = createCORSRequest('GET', url);
    if (!request) {
        throw new Error('CORS not supported');
    }
    request.responseType = "arraybuffer";
    request.onload = function (e) {
        var data1 = new Uint8Array(request.response)
        var workbookArray = XLSX.read(data1, {type: "array"});
        for (let i = 0; i < workbookArray.SheetNames.length; i++) {
            var sheetname = workbookArray.SheetNames[i]
            var worksheet = workbookArray.Sheets[sheetname];

            if (JSON.stringify(worksheet) == '{}') {
                workbookArray.SheetNames.slice(i, 1)
            }
        }
        var newSheetNames = workbookArray.SheetNames.filter(function (element) {
            return JSON.stringify(workbookArray.Sheets[element]) != '{}'
        })
        createAndModifyDivs(id, newSheetNames)
        var defaultSheetname = workbookArray.SheetNames[0]
        var defaultworksheet = workbookArray.Sheets[defaultSheetname];

        var defaultSheet = XLSX.utils.sheet_to_json(defaultworksheet, {raw: true, defval: ""})
        visualization(defaultSheet, Object.keys(defaultSheet[0]), "showSheet", grid, buttonDiv)
        for (let i = 0; i < newSheetNames.length; i++) {
            document.getElementById("btn_" + newSheetNames[i]).onclick = function () {
                var newsheetname = workbookArray.SheetNames[i]
                var newworksheet = workbookArray.Sheets[newsheetname];

                var newarray = XLSX.utils.sheet_to_json(newworksheet, {raw: true, defval: ""})
                $("#showSheet").empty();
                visualization(newarray, Object.keys(newarray[0]), "showSheet", grid, buttonDiv)
            }

        }

    }
    request.send();

}

function createDiv(sheetname, i) {
    var button = document.createElement('BUTTON');
    var text = document.createTextNode(sheetname);
    button.id = "btn_" + sheetname
    button.style = "order:" + i+";margin-right:3px"
    button.appendChild(text);
    return button;
}

function createAndModifyDivs(mainDivId, workSheets) {
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

function csvFromFileToTable(file, divId, grid, buttonDiv) {
    d3.csv(file)
        .then(function (data) {
            var columns = data.columns
            visualization(data, columns, divId, grid, buttonDiv)
        })
        .catch(function (error) {
            // handle error
        })
}

function csvFromVariableToTable(input, separator, divId) {
    var output = csvJSON(input, separator)
    var headers = output.headers
    var data = output.result
    visualization(data, headers, divId)
}

function csvJSON(input, separator) {
    let lines = input.split("\n");
    let result = [];
    var newlines = lines.filter(function (ele) {
        return ele != ""
    })
    const headers = newlines.shift().split(separator)

    for (let i = 0; i < newlines.length; i++) {


        let element = {};
        let currentline = newlines[i].split(separator);
        for (let j in headers) {
            element[headers[j]] = currentline[j];
        }

        result.push(element);
    }
    var output = {result: result, headers: headers}
    return output;
}

function generateBC(nbins,input) {
    let xAxisBarChartSelected = d3.select("#xAxisBarChartSelect").node().value;
    var yAxisBarChartSelected = [];

    $.each($("input:checkbox[name='yAxisBarChartSelect']:checked"), function () {
        yAxisBarChartSelected.push($(this).val());
    });
    document.getElementById("divToVis").innerHTML = ""
    $('#BarChartModal').modal('hide');
    barChart(nbins, "divToVis", yAxisBarChartSelected, xAxisBarChartSelected, input)
}

function generateCC(nbins, input,headers) {
    let xAxisConnectedChartSelect = d3.select("#xAxisConnectedChartSelect").node().value;
    document.getElementById("divToVis").innerHTML = ""
    $('#ConnectedChartModal').modal('hide');
    updateConnectedChartByBins(nbins, headers, "divToVis", xAxisConnectedChartSelect, input)
}

function graphVisualization(nbins, input, headers) {

    $('#confirmBarchart').click(function () {
        generateBC(nbins,input)
    });
    $('#confirmConnectedchart').click(function () {
        generateCC(nbins, input,headers)
    });
}

function chartModal(input, headers, idChart, xAxisId, textChart, submitBtnId, footerText) {
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

function gridVisualization(input, headers, divId) {
    var table = d3.select("#" + divId)
            .append("div").attr("id", "gridVisualization").attr("style","margin-left: 20px;")
            .append("table").attr("id", "tblVis"),
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
        .text(function (column) {
            return column;
        }).append("button")
        .attr("class", "pull-right btnEyeSlash")
        .attr("data-toggle", "tooltip")
        .attr("title", "Hide Column")
        .append("i").on("click", function (d) {
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

    $(".restore-columns").click(function (e) {
        var $table = $(this).closest('table')
        $table.find(".footerRestoreColumn").hide()
        $table.find("th, td")
            .removeClass('hide-col');

    })
    return table;
}

function changeNbinsFormStyle(binsFormId) {
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

function visualization(input, headers, divId, grid, buttonDiv) {
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
    chartModal(input, headers, "BarChartModal", "xAxisBarChartSelect", "Bar Chart", "confirmBarchart", "A bar chart plots numeric values for levels " +
        "of a categorical feature as bars. " +
        "Levels are plotted on one chart axis, and values are plotted on the other axis.")

    chartModal(input, headers, "ConnectedChartModal", "xAxisConnectedChartSelect", "Connected Graph", "confirmConnectedchart",
        "It is a connected scatterplot is basically an hybrid between a scatterplot and a lineplot" +
        "You have to chose xAxis to render it.")

    if ($("#nbinsForm").length !== 0) {
        document.getElementById("nbinsForm").remove();
    }

    var nbinsDiv = buttonDiv.append("div").attr("id", "nbinsForm")
    nbinsDiv.append("input").attr("id", "nbins").attr("class", "barChartRadio")
        .attr("type", "number").attr("min", "1").attr("id", "nbins").attr("max", input.length)
        .attr("value", Math.round(input.length / 2))

    changeNbinsFormStyle("nbinsForm")

    grid.on("click", gridClick)

    document.getElementById("confirmBarchart").onclick = function () {
        let d = input
        d = d.slice(0, document.getElementById("nbins").value)
        generateBC(d,input)
    }
    document.getElementById("confirmConnectedchart").onclick = function () {
        let d = input
        d = d.slice(0, document.getElementById("nbins").value)
        generateCC(d, input, headers)
    }

    function gridClick() {
        if ($(".barChartRadioForm")!=null){
            $(".barChartRadioForm").remove()
        }
        if ($(".connectedChartSelectDiv")!=null){
            $(".connectedChartSelectDiv").remove()
        }
        document.getElementById("divToVis").innerHTML = ""
        gridVisualization(input.slice(0, document.getElementById("nbins").value), headers, "divToVis")
        $("#nbins").on("input", function () {
            let d = input
            d = d.slice(0, +this.value)
            document.getElementById("divToVis").innerHTML = ""
            gridVisualization(d, headers, "divToVis")
        });
    }

    d3.select("#" + divId).append("div").attr("id", "divToVis")

    gridVisualization(input.slice(0, Math.round(input.length / 2)), headers, "divToVis")
    setInputFilter(document.getElementById("nbins"), function (value) {
        return /^[1-9]\d*$/.test(value) && (value === "" || parseInt(value) <= input.length);
    });

    $("#nbins").on("input", function () {
        let d = input
        d = d.slice(0, +this.value)
        let grid = document.getElementById("gridVisualization")
        if (grid != null) {
            document.getElementById("divToVis").innerHTML = ""
            gridVisualization(d, headers, "divToVis")
        }
    });
}

function createBarchart(data, divId, headerToVis, xAxis, barC) {
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 1400 - margin.top - margin.bottom,
    height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#" + divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
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
    var tooltip = tooltipFunction(divId)
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
            .call(wrap, x.bandwidth());

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
            .call(wrap, x.bandwidth())

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

function tooltipFunction(divId) {
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

function removeAllNanValue(headers, data, xAxis) {
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

function updateConnectedChartByBins(data, headers, divId, xAxis, input) {
    var allGroup = headers

    allGroup = removeAllNanValue(allGroup, data, xAxis)
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
    lineChart(data, allGroup, divId, xAxis,allGroup[0])
    $("#nbins").on("input", function () {
        let d = input
        d = d.slice(0, +this.value)
        var selectedOption = $( "#connectedChartSelectId option:selected" ).text()
        $("#svgLineChartId").remove();
        document.getElementById("divToVis").innerHTML = ""
        lineChart(d, allGroup, divId, xAxis,selectedOption)
    });
}

function lineChart(data, allGroup, divId, xAxis,selectedValue) {

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
        .call(wrap, x.bandwidth())

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


    var Tooltip = tooltipFunction(divId)
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
            .call(wrap, x.bandwidth())

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

function setInputFilter(textbox, inputFilter) {
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

export {render};