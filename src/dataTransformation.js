import {ChartCreator, createAndModifyDivs, errorHTML} from "./dataVisualization.js";
let d3 = require("d3")
let XLSX = require("xlsx")
const fetch = require("node-fetch");

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
        d3.csv(file)
            .then(function (data) {
                var columns = data.columns
                csvDiagramm.visualization(data, columns, divId, buttonDiv)
            })
            .catch(function (error) {
                errorHTML(divId, error,
                    "You are trying to render a csv file whose content could not be read. " +
                    "Please make sure your file is still accessible or exists.")
            })
    }
}

export function csvRead(file) {
    const response =  d3.csv(file)
    return response
}

export function getWorkbook(data) {
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

export function sheetToJson(index,workbookArray) {
    var sheetName = workbookArray.SheetNames[index]
    var sheet = workbookArray.Sheets[sheetName];
    var sheetToJson = XLSX.utils.sheet_to_json(sheet, {raw: true, defval: ""})
    return sheetToJson
}