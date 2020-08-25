import {Helper} from "./dataVisualization.js"
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
      new Helper().errorHTML(divId, "Error while reading Url",
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
        if (data.status !== 404){

          if (data.contentType.includes("csv")||
            data.contentType.includes("tab-separated")
            ||file.endsWith(".csv")||file.endsWith(".tsv")){
            let buttonDiv = new Helper().createGridAndGraphBtns(divId,"CSV")
            let transformator = new Transformator(file, divId, buttonDiv)
            transformator.csvReadFile()
          }
          else if (data.contentType.includes("excel")||
            data.contentType.includes("spreadsheet")||
            file.endsWith(".ods")||file.endsWith(".xlsx")||file.endsWith(".xls")){
            let buttonDiv = new Helper().createGridAndGraphBtns(divId,"Excel")
            let transformator = new Transformator(file, divId, buttonDiv)
            transformator.xlxsReadFile(data.arrayBuffer)
          }
          else {
            console.log("Not Support")
            new Helper().errorHTML(divId, "File type not supported!",
              "You are trying to render a file type that is not supported. " +
              "Please make sure your file is created in xlx, xlsx, ods or csv.")                }
        }
        else if (data.status === 403){
          console.log("Forbidden")
          new Helper().errorHTML(divId, data.status + " "+data.statusText,
            "Access to the requested resource is forbidden." +
            "It's might be that the server understood the request but refuses to authorize it.")
        }
        else if (data.status === 401){
          console.log("Unauthorized")
          new Helper().errorHTML(divId, data.status + " "+data.statusText,
            "The request has not been applied." +
            "It lacks valid authentication credentials.")
        }
        else {
          console.log("File not found")
          new Helper().errorHTML(divId, data.status + " "+data.statusText,
            "You are trying to render a file whose content could not be read. " +
            "Please make sure your file is still accessible or exists.")
        }
        }
    );

}

export {render,webSocket}
