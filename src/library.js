function csvFromFileToTable(file) {
    d3.csv(file)
        .then(function(data) {
            var columns = data.columns
            generateToTable(data,columns)
        })
        .catch(function(error){
            // handle error
        })
}
function csvFromVariableToTable(input) {
    var output = csvJSON(input)
    var headers = output.headers
    var data = output.result
    generateToTable(data,headers)
}
function csvJSON(input){
    let lines=input.split("\n");
    let result = [];
    const headers = lines.shift().split(",")
    for(let i=0;i<lines.length;i++){
        let element = {};
        let currentline=lines[i].split(",");
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
function generateToTable(input, headers) {
    var table = d3.select("body").append("table"),
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
