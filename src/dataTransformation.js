import {ChartCreator, createAndModifyDivs, errorHTML} from "./dataVisualization.js";
import "./main.css"
const d3 = require("d3")
const $ = require("jquery")
const XLSX = require("xlsx")
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
        try {
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
        catch (error) {
          errorHTML(divId, "Error while reading file or creating table",
            "You are trying to render a file whose content could not be read. " +
            "Please make sure your file is still accessible or exists.")
        }


    }
    async csvFromFileToTable() {
        let file = this.file
        let divId = this.divId
        let buttonDiv = this.buttonDiv
        let csvDiagramm = new ChartCreator()
     let data = await readCsvBySeparator(",",file,divId).then(data =>{
        return data
     })

      var columns = data.columns
      csvDiagramm.visualization(data, columns, divId, buttonDiv)

      $( "#delimiterSelect" ).change( async ()=>{
        let delimiterString = d3.select("#delimiterSelect").node().value
        if (delimiterString === "Comma"){
          data = await readCsvBySeparator(",",file,divId).then(data =>{
            return data
          })
          columns = data.columns
          document.getElementById(divId).removeChild(document.getElementById("divToVis"))
          csvDiagramm.visualization(data, columns, divId, buttonDiv)
        }
        if (delimiterString === "Semicolon"){
          data = await readCsvBySeparator(";",file,divId).then(data =>{
            return data
          })
          columns = data.columns
          document.getElementById(divId).removeChild(document.getElementById("divToVis"))
          csvDiagramm.visualization(data, columns, divId, buttonDiv)
        }
        if (delimiterString === "Space"){
          data = await readCsvBySeparator(" ",file,divId).then(data =>{
            return data
          })
          columns = data.columns
          document.getElementById(divId).removeChild(document.getElementById("divToVis"))
          csvDiagramm.visualization(data, columns, divId, buttonDiv)
        }
        if (delimiterString === "Pipe"){
          data = await readCsvBySeparator("|",file,divId).then(data =>{
            return data
          })
          columns = data.columns
          document.getElementById(divId).removeChild(document.getElementById("divToVis"))
          csvDiagramm.visualization(data, columns, divId, buttonDiv)
        }
        if (delimiterString === "Tab"){
          data = await readCsvBySeparator(delimiterString,file,divId).then(data =>{
            return data
          })
          columns = data.columns
          document.getElementById(divId).removeChild(document.getElementById("divToVis"))
          csvDiagramm.visualization(data, columns, divId, buttonDiv)
        }
      });
    }
}

async function readCsvBySeparator(separator,file,divId) {
  var headers = {
    "Accept":"text/csv"
  }
  if (separator == "Tab"){
    let result = await d3.tsv(file,{ method: 'GET', headers: headers}).then(data=>{
      return data
    }).catch(function (error) {
      console.log("Error ", error)
      errorHTML(divId, error,
        "You are trying to render a tsv file whose content could not be read. " +
        "Please make sure your file is still accessible or exists.")
    })
    return result
  }
  else{
    let result = await d3.dsv(separator,file,{ method: 'GET', headers: headers}).then(data=>{
      return data
    }).catch(function (error) {
      console.log("Error ", error)
      errorHTML(divId, error,
        "You are trying to render a csv file whose content could not be read. " +
        "Please make sure your file is still accessible or exists.")
    })
    return result
  }
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
