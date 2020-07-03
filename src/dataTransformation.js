import {ChartCreator, createAndModifyDivs, errorHTML} from "/src/dataVisualization.js";

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
    const response =  d3.csv(file)
    return response
}

function getWorkbook(data) {
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