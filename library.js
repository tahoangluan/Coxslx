function csvToTable(file) {
    var columns=null;
    d3.csv(file)
        .then(function(data) {
            console.log("Yeah")
            var columns = data.columns
            tabulate(data,columns)
        })
        .catch(function(error){
            // handle error
        })
}
function readFile(file) {
    let result;
    var reader = new FileReader();
    console.log("File ",file)
    reader.readAsText(file);
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: file,
            dataType: "text",
            success: function(data) {
                successFunction(data)
                result = data

            }
        });
    });
    console.log("result ",result)
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
function tabulate(data, columns) {
    var table = d3.select("body").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // Append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) {
            return column;
        });

    // Create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // Create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
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
function parseCsv(csv) {
    let lines = csv.split("\n");
    const header = lines.shift().split(";")
    lines.shift(); // get rid of definitions
    return lines.map(line => {
        const bits = line.split(";")
        let obj = {};
        header.forEach((h, i) => obj[h] = bits[i]);
        return obj;
    })
};
function csvJSON(csv){

    var lines=csv.split("\n");

    var result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    const headers = lines.shift().split(";")

    for(var i=0;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(";");
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}
