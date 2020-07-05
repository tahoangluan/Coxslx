import {getWorkbook, sheetToJson} from "./dataTransformation.js";
import {createAndModifyDivs} from "./dataVisualization.js";

let d3 = require("d3")
const $ = require('jquery');
import "isomorphic-fetch"
import {checkURL} from "./coxlsx";
/*
   * Testen, wie das Programm reagiert, wenn es eine excel datei, die nur 1 Sheet hat
   * Es gibt 3 sheets :  [ 'Sheet1' ]
   * Testen, ob der Inhalt der Sheets richtig zurückgegeben wird
   * und der Name der Sheet 'Sheet1' ist
   * */
describe("Tests for one-sheets-excel-file", function () {
    let data;
    let defaultSheet;
    beforeAll(async () => {
        data = await checkURL("https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_10.xls")
            .then(function (response) {
                let arrayBuffer = response.arrayBuffer
                let result = getWorkbook(arrayBuffer)
                return result
            })
        defaultSheet = sheetToJson(0, data.workbookArray)

    })
    it('Return 1 for the num of sheets ', async () => {
        let sheetName = ["Sheet1"]
        expect(data.sheetname.length).toBe(1)
    });
    it('Return sheet as json ', async () => {
        let sheet =
            {
                "0": 1,
                "Age": 32,
                "Country": "United States",
                "Date": "15/10/2017",
                "First Name": "Dulce",
                "Gender": "Female",
                "Id": 1562,
                "Last Name": "Abril"
            }

        /*
        * Da die Datenmenge groß ist, wird hier nur das 1.Element gestestet
        * */
        expect(defaultSheet[0]).toEqual(sheet)

    });
    it('Return sheet name ', async () => {
        let sheetName = ["Sheet1"]
        expect(data.sheetname).toEqual(sheetName)
    });
})

/*
   * Testen, wie das Programm reagiert, wenn es eine excel datei, die 3 Sheets hat
   * Es gibt 3 sheets :  [ 'Übersicht', 'Ergebnisüberblick', 'Example' ]
   * Testen, ob die Inhalten, die Namen der Sheets richtig zurückgegeben werden,
   * */
describe("Tests for multiple-sheets-excel-file", function () {
    let data;
    let defaultSheet1, defaultSheet2, defaultSheet3;
    beforeAll(async () => {
        data = await checkURL("https://drive.google.com/u/0/uc?id=1U8kRRRr2NCP_4HB0u0evPlFk4JWUFT4_&export=download")
            .then(function (response) {
                let arrayBuffer = response.arrayBuffer
                let result = getWorkbook(arrayBuffer)
                return result
            })
        defaultSheet1 = sheetToJson(0, data.workbookArray)
        defaultSheet2 = sheetToJson(1, data.workbookArray)
        defaultSheet3 = sheetToJson(2, data.workbookArray)

    }, 30000)

    it('Return 3 for the num of sheets ', async () => {
        expect(data.sheetname.length).toBe(3)
    });
    it('Return sheet 1 ', async () => {
        let sheet1 =
            {
                "Fächer": "Biologie",
                "Prüflinge_Gesamt_2017": 7752,
                "Prüflinge_GY_2017": 6281,
                "Prüflinge_GE_2017": 1471,
                "Prüflinge_Gesamt_2016": 8255,
                "Prüflinge_GY_2016": 6635,
                "Prüflinge_GE_2016": 1620,
                "Prüflinge_Gesamt_2015": 7933,
                "Prüflinge_GY_2015": 6479,
                "Prüflinge_GE_2015": 1454
            }
        /*
        * Da die Datenmenge groß ist, wird hier nur das 1.Element gestestet
        * */
        expect(defaultSheet1[0]).toEqual(sheet1)
    });
    it('Return sheet 2 ', async () => {
        let sheet2 =
            {
                "ABCXYZ": "Prüflinge",
                "2017_Gesamt": 76648,
                "2017_GY": 62023,
                "2017_GE": 14625,
                "2016_Gesamt": 79702,
                "2016_GY": 64694,
                "2016_GE": 15008,
                "2015_Gesamt": 79867,
                "2015_GY": 65837,
                "2015_GE": 14032
            }
        /*
                    * Da die Datenmenge groß ist, wird hier nur das 1.Element gestestet
                    * */
        expect(defaultSheet2[0]).toEqual(sheet2)
    });
    it('Return sheet 3 ', async () => {
        let sheet3 =
            {id: 1, Name: 'Abril', Gehalt: 15, Age: 32}
        /*
        * Da die Datenmenge groß ist, wird hier nur das 1.Element gestestet
        * */
        expect(defaultSheet3[0]).toEqual(sheet3)
    });
    it('Return sheets name ', async () => {
        let sheetName = ["Übersicht", "Ergebnisüberblick", "Example"]
        expect(data.sheetname).toEqual(sheetName)
        expect(data.sheetname[0]).toEqual("Übersicht")
        expect(data.sheetname[1]).toEqual("Ergebnisüberblick")
        expect(data.sheetname[2]).toEqual("Example")
    });
})

/*
   * Testen, wie die Methode createAndModifyDivs reagiert
   * */
describe("Test for method createAndModifyDivs", function () {
    let data;
    beforeAll(async () => {
        data = await checkURL("https://drive.google.com/u/0/uc?id=1U8kRRRr2NCP_4HB0u0evPlFk4JWUFT4_&export=download")
            .then(function (response) {
                let arrayBuffer = response.arrayBuffer
                let result = getWorkbook(arrayBuffer)
                return result
            })
    })
    var div = document.createElement('div');
    div.id = "createAndModifyDivs"
    document.body.appendChild(div)

    /*
    * Testen, ob der Container, in dem die Sheets der Tabelle visualisiert wird, richtig erstellt wurde
    * */
    it('Test if div-container showSheet was created', async () => {
        createAndModifyDivs("createAndModifyDivs", data.sheetname)
        expect(document.getElementById("showSheet")).toBeTruthy()
        expect(d3.select("#showSheet").attr("style")).toBe("display: flex;")
        expect(d3.select("#showSheet").attr("class")).toBe("showSheet")
    });
    it('Test if div-container for sheets-button was created', async () => {
        createAndModifyDivs("createAndModifyDivs", data.sheetname)
        /*
            Testen, ob der div-container, im dem alle Buttons für jede Sheet angezeigt wird, richtig erstellt wird
            Imdem man testet, ob der Container mit id 'sheetsDiv' auffindbar ist und dessen
            Eigentschaften wie z.B. style auch richtig erstellt wurden.
       * * */
        expect(d3.select("#sheetsDiv")).toBeTruthy()
        expect(d3.select("#sheetsDiv").attr("style")).toBe("display: flex; flex-wrap: wrap; justify-content: center; margin-top: 10px;")
        /*
        * Da die Datei 3 sheets hat mit den namen  : [ 'Übersicht', 'Ergebnisüberblick', 'Example' ]
        * Daher wurden 3 Button für die entsprechenden Button erstellt
        * Jeder Button hat id : btn_sheetname
        * Hier testen, ob diese 3 Button erstellt wurden
        * * */
        expect($("#btn_Übersicht")).toBeTruthy()
        expect($("#btn_Ergebnisüberblick")).toBeTruthy()
        expect($("#btn_Example")).toBeTruthy()
        expect($("#btn_Übersicht").text()).toEqual("Übersicht")
        expect($("#btn_Ergebnisüberblick").text()).toEqual("Ergebnisüberblick")
        expect($("#btn_Example").text()).toEqual("Example")
    });
})