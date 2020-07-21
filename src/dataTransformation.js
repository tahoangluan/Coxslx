import {ChartCreator, createAndModifyDivs, errorHTML} from "./dataVisualization.js";
import "./main.css"
const d3 = require("d3")
const $ = require("jquery")
require("bootstrap")
/* eslint-disable */
export class Transformator {
    constructor(file,divId,buttonDiv) {
        this.file=file
        this.divId = divId
        this.buttonDiv=buttonDiv
    }
    xlxsReadFile(arrayBuffer) {
        let divId = this.divId
        let buttonDiv = this.buttonDiv
        var data1 = new Uint8Array(arrayBuffer)

        let excelResult = getWorkbook(data1)
        let newSheetNames = excelResult.sheetname
        let workbookArray = excelResult.workbookArray

        createAndModifyDivs(divId, newSheetNames)
        var defaultSheet = sheetToJson(0,workbookArray)
        let defaultExcelDiagramm = new ChartCreator()
        defaultExcelDiagramm.visualization(defaultSheet, Object.keys(defaultSheet[0]), "showSheet", buttonDiv)
        for (let i = 0; i < newSheetNames.length; i++) {
            document.getElementById("btn_" + newSheetNames[i]).onclick = function () {
                var newarray = sheetToJson(i,workbookArray)
                // eslint-disable-next-line no-undef
                $("#showSheet").empty();
                let sheetExcelDiagramm = new ChartCreator()
                sheetExcelDiagramm.visualization(newarray, Object.keys(newarray[0]), "showSheet", buttonDiv)
            }

        }

    }
    csvFromFileToTable() {
        let file = this.file
        let divId = this.divId
        let buttonDiv = this.buttonDiv
        let csvDiagramm = new ChartCreator()
        csvRead(file).then(function (data) {
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
export function csvRead(file) {
  var headers = {
    "Accept":"text/csv"
  }
    const response =  d3.csv(file,{ method: 'GET', headers: headers})
    return response
}

function getWorkbook(data) {
    // eslint-disable-next-line no-undef
    var workbookArray = XLSX.read(data, {type: "array"});
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
    return {
        workbookArray:workbookArray,
        sheetname: newSheetNames
    }
}

function sheetToJson(index,workbookArray) {
    var sheetName = workbookArray.SheetNames[index]
    var sheet = workbookArray.Sheets[sheetName];
    // eslint-disable-next-line no-undef
    var sheetToJson = XLSX.utils.sheet_to_json(sheet, {raw: true, defval: ""})
    return sheetToJson
}
