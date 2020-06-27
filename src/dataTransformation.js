import {ChartCreator, createAndModifyDivs, errorHTML} from "./dataVisualization.js";
let d3 = require("d3")
let XLSX = require("xlsx")
const fetch = require("node-fetch");

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
        xhr.onerror = function () {
            console.log("** An error occurred during the transaction");
        };
        xhr.withCredentials = true;
    } else {
        xhr = null;
    }
    return xhr;
}

export class Transformator {
    constructor(file,divId,buttonDiv) {
        this.file=file
        this.divId = divId
        this.buttonDiv=buttonDiv
    }
    xlxsReadFile() {
        let file = this.file
        let divId = this.divId
        let buttonDiv = this.buttonDiv
        var request = createCORSRequest('GET', file);
        if (!request) {
            throw new Error('CORS not supported');
        }
        request.responseType = "arraybuffer";
        request.onload = function (e) {
            console.log("ydasdasdasdad")

            if (e.target.status !== 404) {
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
                createAndModifyDivs(divId, newSheetNames)
                var defaultSheetname = workbookArray.SheetNames[0]
                var defaultworksheet = workbookArray.Sheets[defaultSheetname];

                var defaultSheet = XLSX.utils.sheet_to_json(defaultworksheet, {raw: true, defval: ""})

                let defaultExcelDiagramm = new ChartCreator()
                defaultExcelDiagramm.visualization(defaultSheet, Object.keys(defaultSheet[0]), "showSheet", buttonDiv)
                for (let i = 0; i < newSheetNames.length; i++) {
                    document.getElementById("btn_" + newSheetNames[i]).onclick = function () {
                        var newsheetname = workbookArray.SheetNames[i]
                        var newworksheet = workbookArray.Sheets[newsheetname];

                        var newarray = XLSX.utils.sheet_to_json(newworksheet, {raw: true, defval: ""})
                        $("#showSheet").empty();
                        let sheetExcelDiagramm = new ChartCreator()
                        sheetExcelDiagramm.visualization(newarray, Object.keys(newarray[0]), "showSheet", buttonDiv)
                    }

                }
            } else {
                console.log("Error ", e.target.status)
                errorHTML(divId, e.target.status + " Not Found",
                    "You are trying to render a excel file whose content could not be read. " +
                    "Please make sure your file is still accessible or exists.")
            }
        }
        request.send();
    }
    csvFromFileToTable() {
        let file = this.file
        let divId = this.divId
        let buttonDiv = this.buttonDiv
        let csvDiagramm = new ChartCreator()
        d3.csv(file)
            .then(function (data) {
                var columns = data.columns
                csvDiagramm.visualization(data, columns, divId, buttonDiv)
            })
            .catch(function (error) {
                console.log("Error ", error)
                errorHTML(divId, error,
                    "You are trying to render a csv file whose content could not be read. " +
                    "Please make sure your file is still accessible or exists.")
            })
    }
}
