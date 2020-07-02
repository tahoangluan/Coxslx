import "/node_modules/d3/dist/d3.min.js";
import "/node_modules/d3/dist/d3.js";
import "/node_modules/d3-dsv/dist/d3-dsv.js";
import "/node_modules/jquery/dist/jquery.min.js";
import "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import {errorHTML,createBtnDiv} from "/src/dataVisualization.js"
import {Transformator} from "/src/dataTransformation.js"
import {webSocket} from "/src/WebSocket.js"

function includeCss(fileName, cssId) {
    if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = fileName;
        link.media = 'all';
        head.appendChild(link);
    }
}

includeCss('src/main.css', "mainCss")
includeCss('/node_modules/font-awesome/css/font-awesome.css', "fontAwesomeCss")
includeCss('/node_modules/bootstrap/dist/css/bootstrap.min.css', "bootstrapCss")

async function checkURL(url)
{
    let response = await fetch(url);
    let data = await response.blob().then(blob => {
        return {
            contentType: response.headers.get("Content-Type"),
            status: response.status
        }})
    return data;
}

function render(file, divId) {
    let buttonDiv = createBtnDiv(divId)
    let transformator = new Transformator(file, divId, buttonDiv)
    checkURL(file).then(data => {
        if (data.status !== 404){
            if (data.contentType.includes("csv")||
                data.contentType.includes("tab-separated")
                ||file.endsWith(".csv")||file.endsWith(".tsv")){
                transformator.csvFromFileToTable()
            }
            else if (data.contentType.includes("excel")||
                data.contentType.includes("spreadsheet")||
                file.endsWith(".ods")||file.endsWith(".xlsx")||file.endsWith(".xls")){
                transformator.xlxsReadFile()
            }
            else {
                console.log("Not Support")
                errorHTML(divId, "File type not supported!",
                    "You are trying to render a file type that is not supported. " +
                    "Please make sure your file is created in xlx, xlsx, ods or csv.")                }
        }
            else {
                return "fileNotFound"
            }
        }
    );

}
export function csvRead(file) {
    const response =  d3.csv(file)
    return response
}
export {render,webSocket}