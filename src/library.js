function render(file, divId) {
    if (file.endsWith(".csv")) {
        csvFromFileToTable(file, divId)
    } else if (file.endsWith(".ods") || file.endsWith(".xlsx") || file.endsWith(".xls")) {
        xlxsReadFile(file, divId)
    } else {
        console.log("Not Support")
    }
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

function diffBetweenTwoArrays(array1, array2) {

    var temp = [], diff = [];

    for (var i = 0; i < array1.length; i++) {
        temp[array1[i]] = true;
    }

    for (var i = 0; i < array2.length; i++) {
        if (temp[array2[i]]) {
            delete temp[array2[i]];
        } else {
            temp[array2[i]] = true;
        }
    }

    for (var k in temp) {
        diff.push(k);
    }

    return diff;
}

function barChart(nbins, divId, headerToVis, xAxis,input) {

    var form = d3.select("#" + divId)

        .append("form").attr("id","graphVisualization").attr("class","barChartRadioForm");;
    var radioDiv = form.append("div").attr("id","modeForm")
    radioDiv.append("label").text("Stacked").append("input").attr("class","barChartRadio")
        .attr("type","radio")
        .attr("name","mode").attr("value","stacked").attr("id","stacked")
    radioDiv.append("label").text("Grouped").append("input").attr("type","radio")
        .attr("class","barChartRadio")
        .attr("name","mode").attr("value","grouped").attr("id","grouped")

    $(document).ready(function() {
        $('input[type="radio"]:first').trigger('click');
    });
    changeBarStacked(nbins,divId,headerToVis,xAxis,input)

}

function visualize(data, divId, headerToVis, xAxis , barC)  {
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = d3.select('#' + divId).node().getBoundingClientRect().width,
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

        var tooltip = d3.select("#" + divId)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")

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

        var groups = d3.map(data, function (d) {
            return (d[xAxis])
        }).keys()


        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])

        if (barC == "stacked"){
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
                .domain([Number(d3.min(minArr)), d3.max(stackedData, d => d3.max(d, d => d[1]))])
                .range([height, 0]);

            svg.append("g")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(d3.axisBottom(x).tickSize(0));
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y).tickSize(0));
            svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                .merge(svg)
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.data[xAxis]); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width",x.bandwidth())
                .attr("stroke", "grey")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
            svg
                .exit().remove();
        }
        if (barC == "grouped"){
            let maxArr = []
            for (let i in subgroups) {
                var max = d3.max(data, d => d[subgroups[i]]);
                maxArr.push(max)
            }
            var y = d3.scaleLinear()
                .domain([Number(d3.min(minArr)), Number(d3.max(maxArr)) + 100])
                .range([height, 0]);

            var xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.05])
            var mouseover = function (d) {
                tooltip
                    .html("Name: " + d.key + "<br>" + "Value: " + d.value)
                    .style("opacity", 1)
            }
            svg.append("g")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(d3.axisBottom(x).tickSize(0));
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y).tickSize(0));
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
        }

        var legendContainer = d3.select('#'+divId).append('div')
            .attr('class', 'legend-container')
            .attr("style","max-width:"+width+"px")
        let legend = legendContainer.selectAll(".legend")
            .data(color.domain())
            .enter().append("g").append("div")
            .attr("class", "legend")
            .attr("order", function (d,i) {
                return i
            })


        legend.append("span")
            .attr("class", "legend-color")
            .style("background-color", color);

        legend.append("span")
            .text(function(d) {
                return d;
            })
}


function update(nbins, divId, headerToVis, xAxis , barC,input) {
    visualize(nbins,divId,headerToVis,xAxis,barC)
    d3.select("#nbins").on("input", function() {
        let d = input
        d = d.slice(0,+this.value)
        let grid = document.getElementById("gridVisualization")
        let graph = document.getElementById("graphVisualization")
        if (grid ==null&&graph!=null){
            $("#"+divId).contents(':not(form)').remove();
            visualize(d,divId,headerToVis,xAxis,barC)
            changeBarStacked(d,divId,headerToVis,xAxis)

        }
    });
}

function changeBarStacked(nbins,divId,headerToVis,xAxis,input) {
    $('#modeForm input').on('change', function() {
        let selectedRadio = $('input[name=mode]:checked', '#modeForm').val()
        if (selectedRadio == "grouped"){
            $("#"+divId).contents(':not(form)').remove();
            update(nbins,divId,headerToVis,xAxis,"grouped",input)
        }
        if (selectedRadio == "stacked"){
            $("#"+divId).contents(':not(form)').remove();
            update(nbins,divId,headerToVis,xAxis,"stacked",input)
        }
    });
}

function xlxsReadFile(file, id) {
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

        generateToTable(defaultSheet, Object.keys(defaultSheet[0]), "showSheet")
        for (let i = 0; i < newSheetNames.length; i++) {
            document.getElementById("btn_" + newSheetNames[i]).onclick = function () {
                var newsheetname = workbookArray.SheetNames[i]
                var newworksheet = workbookArray.Sheets[newsheetname];

                var newarray = XLSX.utils.sheet_to_json(newworksheet, {raw: true, defval: ""})
                $("#showSheet").empty();
                generateToTable(newarray, Object.keys(newarray[0]), "showSheet")
                //var html = XLSX.write(workbookArray,{sheet:newSheetNames[i],type:'string',bookType:'html'})
                //var html = XLSX.utils.sheet_to_html(workbookArray.Sheets[workbookArray.SheetNames[i]])
                //var formatHtml = format(html)
                //var newHTML = createNewHtmlToShowSheet(html)
                //$('#showSheet')[0].innerHTML = newHTML
            }

            //console.log("sheetname ",workbook.SheetNames[1])
            //var worksheet = workbook.Sheets[sheetname];
            //console.log("worksheet ",workbook.Sheets[workbook.SheetNames[1]])
            //var headers = get_header_row(worksheet)
            //console.log("headers ",headers)
            //var json_object = XLSX.utils.sheet_to_json(worksheet,{raw:true})
            //console.log(json_object);

            //generateToTable(json_object,headers)
        }

    }
    request.send();

}

function createNewHtmlToShowSheet(html) {
    var doc = new DOMParser().parseFromString(html, "text/xml");
    var childNodes = doc.childNodes[0].childNodes[1].childNodes[0].childNodes
    var arrayFromChildNodes = Array.from(childNodes)
    //var afterFiltered = arrayFromChildNodes.filter(function(item) {return item.childNodes.length > 0;});
    var childNodeAfterRemovedEmptyString = arrayFromChildNodes.filter(function (item) {
        var a = Array.from(item.childNodes).filter(function (item1) {
            return item1.textContent.trim() !== ""
        })
        return a.length > 0
    })

    var newTable = document.createElement('table');
    for (let node of childNodeAfterRemovedEmptyString) {
        newTable.appendChild(node)
    }
    var newHTML = document.createElement('html');
    var head = document.createElement('head');
    var body = document.createElement('body');
    body.appendChild(newTable)
    newHTML.appendChild(head)
    newHTML.appendChild(body)
    return newHTML.innerHTML
}

function createDiv(sheetname, i) {
    var button = document.createElement('BUTTON');
    var text = document.createTextNode(sheetname);
    button.id = "btn_" + sheetname
    button.style = "order:" + i
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
    buttonDiv.style = "display: flex;flex-wrap: wrap;justify-content: center;margin-top: 10px;"
    mainDiv.appendChild(buttonDiv)
}

function csvFromFileToTable(file, divId) {
    d3.csv(file)
        .then(function (data) {
            var columns = data.columns
            generateToTable(data, columns, divId)
        })
        .catch(function (error) {
            // handle error
        })
}

function csvFromVariableToTable(input, separator, divId) {
    var output = csvJSON(input, separator)
    var headers = output.headers
    var data = output.result
    generateToTable(data, headers, divId)
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
function graphVisualization(nbins,input) {

    $('#confirmBarchart').click(function() {

        let xAxisBarChartSelected  = d3.select("#xAxisBarChartSelect").node().value;
        var yAxisBarChartSelected = [];

        $.each($("input:checkbox[name='yAxisBarChartSelect']:checked"), function(){
            yAxisBarChartSelected.push($(this).val());
        });
        document.getElementById("divToVis").innerHTML = ""
        $('#BarChartModal').modal('hide');
        barChart(nbins,"divToVis",yAxisBarChartSelected,xAxisBarChartSelected,input)
    });
}

function barChartModal(input,headers) {
    var modal = d3.select("body").append("div").attr("class","modal fade").attr("id","BarChartModal")
        .attr("tabindex","-1")
        .attr("role","dialog")
        .attr("aria-labelledby","myModalLabel")
        .attr("aria-hidden",true)


    var modal_dialog = modal.append("div").attr("class","modal-dialog")
    var modal_content = modal_dialog.append("div").attr("class","modal-content")
    var modal_header = modal_content.append("div").attr("class","modal-header")
    modal_header.append("h5").attr("class","modal-title").attr("id","myModalLabel").text("Bar Chart")
    modal_header.append("button").attr("type","button").attr("class","close")
        .attr("data-dismiss","modal").attr("aria-label","Close").attr("aria-hidden",true)
        .text("x")
    var modal_body = modal_content.append("div").attr("class","modal-body")
    var fieldsetXAxis = modal_body.append("fieldset")
        .attr("class","fieldsetBorder")
    fieldsetXAxis.append("legend").attr("class","legendStyle").text("X Axis ")
    fieldsetXAxis.append("label").attr("class","xAxisDiv")
        .text("Select").append("select")
        .attr("id","xAxisBarChartSelect")
        .attr("style","margin-left:10px").selectAll("option")
        .data(headers).enter().append("option").text(function (d) {
        return d
    })
    modal_body.append("div").attr("class","vl")
    var fieldsetYAxis = modal_body.append("fieldset").attr("class","fieldsetBorder")
    fieldsetYAxis.append("legend").attr("class","legendStyle").text("Y Axis ")
    fieldsetYAxis.append("div").attr("class","fieldsetYAxis").selectAll("input")
        .data(headers)
        .enter()
        .append("div").attr("style","margin-left: 10px;")
        .append('label')
        .attr('for',function(d,i){ return 'a'+i; })
        .attr('order',function(d,i){ return i; })
        .text(function(d) { return d; })
        .append("input").attr("style","margin-left:5px")
        .attr("checked", true)
        .attr("type", "checkbox")
        .attr("name", "yAxisBarChartSelect")
        .attr("value", function (d) {
            return d
        })
        .attr("id", function(d,i) { return 'a'+i; })

    var modal_footer = modal_content.append("div").attr("class","modal-footer")
        .text("A bar chart plots numeric values for levels of a categorical feature as bars. " +
            "Levels are plotted on one chart axis, and values are plotted on the other axis.")
    var pullRightDiv= modal_footer.append("div").attr("class","pull-right")
    pullRightDiv.append("button").attr("class","btn btn-secondary")
        .attr("data-dismiss","modal").text("Cancel")
    pullRightDiv.append("div").attr("class","pull-right").append("button").attr("class","btn btn-warning")
        .attr("style","margin-left:10px")
        .attr("id","confirmBarchart")
        .attr("type","submit").text("Confirm")

}

function gridVisualization(input,headers,divId) {
    var table = d3.select("#"+divId)
            .append("div").attr("id","gridVisualization")
            .append("table"),
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

function generateToTable(input, headers, divId) {

    let da = ["Histogram","BarChart"]
    var buttonDiv =  d3.select("#" + divId).append("div").attr("class","gridGraphBtnDiv")
    var grid = buttonDiv.append("button").text("Grid").attr("class", "btn btn-primary").on("click", gridClick)
    function gridClick() {
        $("#divToVis").remove();
        gridVisualization(input,headers,"divToVis")
    }
    var visualizationBtn = buttonDiv.append("div").attr("class","dropdown");
    visualizationBtn.append("button")
        .attr("class", "btn btn-primary dropdown-toggle")
        .attr("style", "margin-left:5px")
        .attr("id", "selectedBtn")
        .attr("data-toggle", "dropdown")
        .text("Graph")
    visualizationBtn
        .append("div").attr("class","dropdown-menu").attr("style","padding:0").selectAll("li")
        .data(da)
        .enter().append("li").append("a")
        .attr("data-toggle","modal")
        .attr("href","")
        .attr("data-target",function (d) {
            var dataTarget = "#"+d+"Modal"
            return dataTarget;
        })
        .text(function (d) { return d; })

    //create BarChartModal
    barChartModal(input,headers)

    var nbinsDiv = buttonDiv.append("div").attr("id","nbinsForm")
    nbinsDiv.append("label").text("nbins").append("input").attr("id","nbins").attr("class","barChartRadio")
        .attr("type","number").attr("min","1").attr("max",input.length)
        .attr("id","nbins")


    d3.select("#" + divId).append("div").attr("id","divToVis")
    gridVisualization(input.slice(0,input.length/2),headers,"divToVis")
    graphVisualization(input.slice(0,document.getElementById("nbins").value),input)
    setInputFilter(document.getElementById("nbins"), function(value) {
        return /^[1-9]\d*$/.test(value)&& (value === "" || parseInt(value) <= input.length); });

    $("#nbins").on("change keyup paste", function(){
        console.log("Ywah ")
        let d = input
        d = d.slice(0,+this.value)
        let grid = document.getElementById("gridVisualization")
        let graph = document.getElementById("graphVisualization")
        if (grid == null&&graph !=null){
            graphVisualization(d,input)

        }
        if (grid !=null&&graph==null){
            document.getElementById("divToVis").innerHTML = ""
            gridVisualization(d,headers,"divToVis")
        }
    })
}
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
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




/*
function csvToBarChart(url, divId, headerToRemove, xAxis) {
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = d3.select('#' + divId).node().getBoundingClientRect().width,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#" + divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(url).then(function (data) {

        var columnsToDelete = []
        for (let i in headerToRemove) {
            columnsToDelete.push(data.columns[headerToRemove[i]])
        }

        var subgroups = diffBetweenTwoArrays(data.columns, columnsToDelete)

        let maxArr = []
        for (let i in subgroups) {
            var max = d3.max(data, d => d[subgroups[i]]);
            maxArr.push(max)
        }

        let minArr = []
        for (let i in subgroups) {
            var min = d3.min(data, d => d[subgroups[i]]);
            minArr.push(Number(min))
        }

        var groups = d3.map(data, function (d) {
            return (d[xAxis])
        }).keys()

        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])

        var y = d3.scaleLinear()
            .domain([Number(d3.min(minArr)), Number(d3.max(maxArr)) + 100])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x).tickSize(0));
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).tickSize(0));


        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        let colorArray = []
        for (let i in subgroups) {
            let color = '#' + Math.floor(Math.random() * Math.pow(2, 32) ^ 0xffffff).toString(16).substr(-6);
            colorArray.push(color)
        }
        var color = d3.scaleOrdinal().domain(subgroups).range(colorArray)

        var tooltip = d3.select("#" + divId)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")

        var mouseover = function (d) {
            tooltip
                .html("Name: " + d.key + "<br>" + "Value: " + d.value)
                .style("opacity", 1)
        }

        var mousemove = function (d) {
            tooltip
                .style("top", (d3.event.pageY + 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }
        var mouseleave = function (d) {
            tooltip.style("opacity", 0)
        }

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

        var legendContainer = d3.select('#'+divId).append('div')
            .attr('class', 'legend-container')
        let legend = legendContainer.selectAll(".legend")
            .data(color.domain())
            .enter().append("g").append("div")
            .attr("class", "legend")


        legend.append("span")
            .attr("class", "legend-color")
            .style("background-color", color);

        legend.append("span")
            .text(function(d) {
                return d;
            })
    })
}


function csvToStackedBarChart(url, divId, headerToRemove, xAxis ) {
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = d3.select('#' + divId).node().getBoundingClientRect().width,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#" + divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(url).then(function (data) {

        var columnsToDelete = []
        for (let i in headerToRemove) {
            columnsToDelete.push(data.columns[headerToRemove[i]])
        }

        var subgroups = diffBetweenTwoArrays(data.columns, columnsToDelete)

        var stackedData = d3.stack()
            .keys(subgroups).offset(d3.stackOffsetDiverging)
            (data)

        var groups = d3.map(data, function (d) {
            return (d[xAxis])
        }).keys()

        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])

        let minArr = []
        for (let i in subgroups) {
            var min = d3.min(data, d => d[subgroups[i]]);
            minArr.push(Number(min))
        }

        var y = d3.scaleLinear()
            .domain([Number(d3.min(minArr)), d3.max(stackedData, d => d3.max(d, d => d[1]))])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x).tickSize(0));

        svg.append("g")
            .call(d3.axisLeft(y).tickSize(0));


        let colorArray = []

        for (let i in subgroups) {
            let color = '#' + Math.floor(Math.random() * Math.pow(2, 32) ^ 0xffffff).toString(16).substr(-6);
            colorArray.push(color)
        }
        var color = d3.scaleOrdinal().domain(subgroups).range(colorArray)

        var tooltip = d3.select("#" + divId)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")

        var mouseover = function (d) {
            var subgroupName = d3.select(this.parentNode).datum().key;
            var subgroupValue = d.data[subgroupName];
            tooltip
                .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
                .style("opacity", 1)
        }

        var mousemove = function (d) {
            tooltip
                .style("top", (d3.event.pageY + 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }
        var mouseleave = function (d) {
            tooltip.style("opacity", 0)
        }

        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data[xAxis]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
            .attr("stroke", "grey")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        var legendContainer = d3.select('#'+divId).append('div')
            .attr('class', 'legend-container')
        let legend = legendContainer.selectAll(".legend")
            .data(color.domain())
            .enter().append("g").append("div")
            .attr("class", "legend")


        legend.append("span")
            .attr("class", "legend-color")
            .style("background-color", color);

        legend.append("span")
            .text(function(d) {
                return d;
            })
    })
}
*/