import {errorHTML,createBtnDiv} from "./dataVisualization.js"
import {Transformator} from "./dataTransformation.js"
import {webSocket} from "./WebSocket.js"
import "./main.css"
require("bootstrap")
/* eslint-disable */
async function checkURL(url,divId)
{
    var headers = {
      "Accept":"text/csv"
    }
    let response =  await fetch(url,{ method: 'GET', headers: headers}).catch(error=>{
      errorHTML(divId, "Error while reading Url",
        "You are trying to read an URL which is not supported!")
    })
      let data = await response.arrayBuffer().then(arrayBuffer => {
        return {
          contentType: response.headers.get("Content-Type"),
          status: response.status,
          arrayBuffer:arrayBuffer,
          statusText:response.statusText
        }})
      return data;
}

function render(file, divId) {
    checkURL(file,divId).then(data => {
      let buttonDiv = createBtnDiv(divId)
      let transformator = new Transformator(file, divId, buttonDiv)
        if (data.status !== 404){
          if (data.contentType.includes("csv")||
            data.contentType.includes("tab-separated")
            ||file.endsWith(".csv")||file.endsWith(".tsv")){
            transformator.csvFromFileToTable()
          }
          else if (data.contentType.includes("excel")||
            data.contentType.includes("spreadsheet")||
            file.endsWith(".ods")||file.endsWith(".xlsx")||file.endsWith(".xls")){
            transformator.xlxsReadFile(data.arrayBuffer)
          }
          else {
            console.log("Not Support")
            errorHTML(divId, "File type not supported!",
              "You are trying to render a file type that is not supported. " +
              "Please make sure your file is created in xlx, xlsx, ods or csv.")                }
        }
        else {
          console.log("File not found")
          errorHTML(divId, data.status + " "+data.statusText,
            "You are trying to render a file whose content could not be read. " +
            "Please make sure your file is still accessible or exists.")
        }

        }
    );

}

export {render,webSocket}
