function render(file,divId) {
    if (file.endsWith(".csv")) {
        console.log("Yeah CSV")
        csvFromFileToTable(file,divId)
    }
    else if (file.endsWith(".ods")||file.endsWith(".xlsx")||file.endsWith(".xls")){
        xlxsReadFile(file,divId)
    }
    else {
        console.log("Not Support")
    }
}
function xlxsReadFile(file,id) {
    var url = file;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function(e) {
        var data1 = new Uint8Array( request.response)

        var workbookArray = XLSX.read(data1, {type:"array"});
        //var arraybuffer = request.response;
        //var data = new Uint8Array(arraybuffer);
        //var arr = new Array();
        //for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        //var bstr = arr.join("");
        // var workbook = XLSX.read(bstr, {type:"binary"});
        for (let i =0;i<workbookArray.SheetNames.length;i++){
            var sheetname = workbookArray.SheetNames[i]
            var worksheet = workbookArray.Sheets[sheetname];
            if (JSON.stringify(worksheet) =='{}'){
                workbookArray.SheetNames.slice(i,1)
            }
        }
        var newSheetNames = workbookArray.SheetNames.filter(function (element) {
            return JSON.stringify(workbookArray.Sheets[element]) !='{}'
        })
        createAndModifyDivs(id,newSheetNames)

        for (let i =0;i<newSheetNames.length;i++){
            //var sheetname = workbookArray.SheetNames[i]
            //var worksheet = workbookArray.Sheets[sheetname];
            //var idWithVar = id+"_"+i
            //var defaultHtml = createNewHtmlToShowSheet(XLSX.write(workbookArray,{sheet:newSheetNames[0],type:'string',bookType:'html'}))
            var defaultHtml = createNewHtmlToShowSheet(XLSX.utils.sheet_to_html(workbookArray.Sheets[workbookArray.SheetNames[0]]))
            $('#showSheet')[0].innerHTML =defaultHtml
            document.getElementById("btn_"+newSheetNames[i]).onclick = function () {
                //var html = XLSX.write(workbookArray,{sheet:newSheetNames[i],type:'string',bookType:'html'})
                var html = XLSX.utils.sheet_to_html(workbookArray.Sheets[workbookArray.SheetNames[i]])
                //var formatHtml = format(html)
                var newHTML = createNewHtmlToShowSheet(html)
                $('#showSheet')[0].innerHTML = newHTML
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
    var arrayFromChildNodes =Array.from(childNodes)
    //var afterFiltered = arrayFromChildNodes.filter(function(item) {return item.childNodes.length > 0;});
    var childNodeAfterRemovedEmptyString = arrayFromChildNodes.filter(function (item) {
        var a=  Array.from(item.childNodes).filter(function (item1) {
            return  item1.textContent.trim() !== ""
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
/*
function format(html) {
    var tab = '\t';
    var result = '';
    var indent= '';

    html.split(/>\s*</).forEach(function(element) {
        if (element.match( /^\/\w/ )) {
            indent = indent.substring(tab.length);
        }
        result += indent + '<' + element + '>\r\n';
        if (element.match( /^<?\w[^>]*[^\/]$/ )) {
            indent += tab;
        }
    });

    return result.substring(1, result.length-3);
}*/
function createDiv(sheetname,i) {
    var button = document.createElement('BUTTON');
    var text = document.createTextNode(sheetname);
    button.id = "btn_"+sheetname
    button.style = "order:"+i
    button.appendChild(text);
    return button;
}
function createAndModifyDivs(mainDivId,workSheets) {
    var buttonDiv = document.createElement("div");
    var showSheet = document.createElement("div");
    showSheet.style = "display: flex"
    showSheet.id = "showSheet"
    showSheet.className = "showSheet"
    var mainDiv = document.getElementById(mainDivId),
        myDivs = []
    mainDiv.appendChild(showSheet)
    for (let i =0; i < workSheets.length; i++) {
        myDivs.push(createDiv(workSheets[i],i));
        buttonDiv.appendChild(myDivs[i]);
    }
    buttonDiv.style = "display: flex;flex-wrap: wrap;justify-content: center;margin-top: 10px;"
    mainDiv.appendChild(buttonDiv)
}

function get_header_row(sheet) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r;
    for(C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})]
        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        headers.push(hdr);
    }
    return headers;
}
function csvFromFileToTable(file,divId) {
    d3.csv(file)
        .then(function(data) {
            var columns = data.columns
            generateToTable(data,columns,divId)
        })
        .catch(function(error){
            // handle error
        })
}
function csvFromVariableToTable(input,separator,divId) {
    var output = csvJSON(input,separator)
    var headers = output.headers
    var data = output.result
    generateToTable(data,headers,divId)
}
function csvJSON(input,separator){
    let lines=input.split("\n");
    let result = [];
    const headers = lines.shift().split(separator)
    for(let i=0;i<lines.length;i++){
        let element = {};
        let currentline=lines[i].split(separator);
        for(let j=0;j<headers.length;j++){
            element[headers[j]] = currentline[j];
        }
        result.push(element);
    }
    var output = {result:result,headers:headers}
    return output;
}

function csvTo2DGraph(file) {
    d3.csv(file)
        .then(function (data) {

        })
        .catch(function (error) {

        })
}
function generateToTable(input, headers,divId) {
    var div = document.getElementById(divId)
    console.log(div)
    var table = d3.select("#"+divId).append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    thead.append("tr")
        .selectAll("th")
        .data(headers)
        .enter()
        .append("th")
        .text(function(column) {
            return column;
        });

    var rows = tbody.selectAll("tr")
        .data(input)
        .enter()
        .append("tr");

    rows.selectAll("td")
        .data(function(row) {
            return headers.map(function(column) {
                return {
                    column: column,
                    value: row[column]
                };
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; });

    return table;
}




function readFile(file) {
    let result;
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: file,
            dataType: "text",
            success: function(data) {
                successFunction(data)
                console.log(data)
                result = data
            },
            error:function (error) {
                console.log(error)
            }
        });
    });
    return result
}
function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    var table = '<table>';
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
        if (singleRow === 0) {
            table += '<thead>';
            table += '<tr>';
        } else {
            table += '<tr>';
        }
        var rowCells = allRows[singleRow].split(',');
        for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
            if (singleRow === 0) {
                table += '<th>';
                table += rowCells[rowCell];
                table += '</th>';
            } else {
                table += '<td>';
                table += rowCells[rowCell];
                table += '</td>';
            }
        }
        if (singleRow === 0) {
            table += '</tr>';
            table += '</thead>';
            table += '<tbody>';
        } else {
            table += '</tr>';
        }
    }
    table += '</tbody>';
    table += '</table>';
    $('body').append(table);
}
