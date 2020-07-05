import {checkURL} from "./coxlsx";

let d3 = require("d3")
let XLSX = require("xlsx")
let fs = require("fs")
import {createBtnDiv, errorHTML, createDiv, Grid} from "./dataVisualization"

const $ = require('jquery');
import "isomorphic-fetch"
import {webSocket} from "./WebSocket.js"
import {RealtimeGenerator} from "./realtimeGenerator.js";
import {Transformator, csvRead} from "./dataTransformation.js"

/*
* Testen, ob die Methode createBtnDiv funktioniert wie erwartet
* und zwar, ob die Button für Grid und Graph
* und deren Eigenschaften z.B. style, class richtig erstellt wurden
* */
describe('Tests for method createBtnDiv', function () {
    var div = document.createElement('div');
    div.id = "createBtnDiv"
    document.body.appendChild(div)
    let buttonDiv = createBtnDiv("createBtnDiv")

    test('Test for button with id gridBtnForAddEvent 1', function () {
        expect(d3.select("#gridBtnForAddEvent").empty()).toBe(false);
    });
    test('Test for button with id gridBtnForAddEvent 2', function () {
        expect(d3.select("#gridBtnForAddEvent").attr("class")).toBe("btn btn-primary");
    });
    test('Test for button with id gridBtnForAddEvent 3', function () {
        expect(d3.select("#gridBtnForAddEvent").attr("style")).toBe(null);
    });
    test('Test for button with id gridBtnForAddEvent 4', function () {
        expect(d3.select("#gridBtnForAddEvent").text()).toBe("Grid");
    });

    test('Test for button with id selectedBtn 1', function () {
        expect(d3.select("#selectedBtn").empty()).toBe(false);
    });
    test('Test for button with id selectedBtn 2', function () {
        expect(d3.select("#selectedBtn").attr("class")).toBe("btn btn-primary dropdown-toggle");
    });
    test('Test for button with id selectedBtn 3', function () {
        expect(d3.select("#selectedBtn").attr("style")).toBe("margin-left:5px");
    });
    test('Test for button with id selectedBtn 4', function () {
        expect(d3.select("#selectedBtn").text()).toBe("Graph");
    });

    test('Test for button with id selectedBtn 5', function () {
        $('#selectedBtn').click();
        expect($("[data-target = '#BarChartModal']").text()).toContain('BarChart');
    });
    test('Test for button with id selectedBtn 6', function () {
        $('#selectedBtn').click();
        expect($("[data-target = '#ConnectedChartModal']").text()).toContain('ConnectedChart');
    });

});

/*
* Testen, ob die Methode errorHTML funktioniert wie erwartet
* und zwar ob die Nachrichten korrekt ausgeworfen und
* ob die Eigenschaften von dem div-container richtig erstellt wurden.
* */
describe('Tests for methods errorHTML', function () {
    var div = document.createElement('div');
    div.id = "errorHTML"
    document.body.appendChild(div)
    errorHTML("errorHTML", "File type not supported!",
        "Text of p-Element")
    test('ErrorHtml exists after created', function () {
        expect(d3.select("#errorHTML").empty()).toBe(false);
    });
    test('Class of child div', function () {
        expect(d3.select("#errorHTML").select("div").attr("class")).toBe("js-temp-notice alert alert-warning alert-block");
    });
    test('Text of h3-Element', function () {
        expect(d3.select("#errorHTML").select("div").select("h3").text()).toBe("File type not supported!");
    });
    test('Text of p-Element', function () {
        expect(d3.select("#errorHTML").select("div").select("p").text()).toBe("Text of p-Element");
    });
});

/*
* Testen, ob die Methode createDiv funktioniert wie erwartet
* indem man die id vom div-container testet
* */
describe('Tests for method createDiv', function () {
    let button = createDiv("Sheet1", 1)
    test("Sheet Button id", function () {
        expect(button.id).toBe("btn_Sheet1")
    })
});

/*https://jestjs.io/docs/en/bypassing-module-mocks
* aufruf von jest.mock('./realtimeGenerator') gibt "automatic mock" zurück,
* was verwendet wird, um die Aufrufe vom Kontruktor und dessen Methode auszusponieren.
* */
jest.mock("./realtimeGenerator");
describe("Tests for realtime data visualization", function () {
    beforeEach(() => {
        RealtimeGenerator.mockClear();
    });
    var div = document.createElement('div');
    div.id = "realTimeDiv"
    document.body.appendChild(div)
    /*Die Methode WebSocket ruft den Konstruktor von RealtimeGenerator auf
       Testen, wie viele Mal der Konstruktor aufgerufen wird,
       * */
    it('check if the consumer called the class constructor', () => {
        expect(RealtimeGenerator).toHaveBeenCalledTimes(0);
        webSocket("ws://datastore.k2dev.fokus.fraunhofer.de/datastream/OpenData.SmartCity.Environment", 1000, "realTimeDiv")
        expect(RealtimeGenerator).toHaveBeenCalledTimes(1);
    });
    it('check if the consumer called a method on the class instance 1', () => {
        expect(RealtimeGenerator).not.toHaveBeenCalled();
        webSocket("ws://datastore.k2dev.fokus.fraunhofer.de/datastream/OpenData.SmartCity.Environment", 1000, "realTimeDiv")
        expect(RealtimeGenerator).toHaveBeenCalledTimes(1);

        // mock.instances is available with automatic mocks:
        const realtimegenerator = RealtimeGenerator.mock.instances[0];

        const divGeneratorMock = realtimegenerator.divGenerator
        expect(divGeneratorMock).toHaveBeenCalledWith();
        expect(divGeneratorMock).toHaveBeenCalledTimes(1);
        const dataGeneratorMock = realtimegenerator.dataGenerator
        //Data Generator have not been called
        expect(dataGeneratorMock).toHaveBeenCalledTimes(0);
    });
    describe("Mock Error", function () {
        beforeAll(() => {
            RealtimeGenerator.mockImplementation(() => {
                return {
                    divGenerator: () => {
                        throw new Error('Test error');
                    },
                    dataGenerator: () => {
                        throw new Error('Test error');
                    },
                };
            });
        });

        it('Should throw an error when calling divGenerator or dataGenerator', () => {
            let reltime = new RealtimeGenerator("realTimeDiv")
            expect(() => reltime.dataGenerator()).toThrow();
            expect(() => reltime.divGenerator()).toThrow();
        });
    })
    it('The consumer should be able to call new() on RealtimeGenerator', () => {
        let reltime = new RealtimeGenerator("realTimeDiv")
        expect(reltime).toBeTruthy();
    });
})

/*https://jestjs.io/docs/en/bypassing-module-mocks
* aufruf von jest.mock('./realtimeGenerator') gibt "automatic mock" zurück,
* was verwendet wird, um die Aufrufe vom Kontruktor und dessen Methode auszusponieren.
* */
jest.mock("./dataTransformation");
/*
* Testen mit Hilfe von mock, ob Transformator und dessen Methode sowie Konstruktor
* richtig aufgerufen werden wie erwartet.
* */
describe("Tests for data transformation", function () {
    jest.clearAllMocks()
    beforeEach(() => {
        Transformator.mockClear();
    });
    var div = document.createElement('div');
    div.id = "createBtnDiv"
    document.body.appendChild(div)
    let buttonDiv = createBtnDiv("createBtnDiv")

    it('check if the consumer called the class constructor', () => {
        expect(Transformator).toHaveBeenCalledTimes(0);
        let transformator = new Transformator(
            "src/TestFiles/steuereinnahmen_bis_september_2013.ods",
            "createBtnDiv", buttonDiv)
        transformator.xlxsReadFile()
        expect(Transformator).toHaveBeenCalledTimes(1);
    });
    it('check if the consumer called a method on the class instance 1', () => {
        expect(Transformator).not.toHaveBeenCalled();

        const transformator = new Transformator(
            "src/TestFiles/steuereinnahmen_bis_september_2013.ods",
            "createBtnDiv", buttonDiv)
        transformator.xlxsReadFile()
        expect(Transformator).toHaveBeenCalledTimes(1);

        // mock.instances is available with automatic mocks:
        const transformator1 = Transformator.mock.instances[0];
        const mockxlxsReadFile = transformator1.xlxsReadFile;
        //xlsxReadFile has no arg
        expect(mockxlxsReadFile).toHaveBeenCalledWith();
        expect(mockxlxsReadFile).toHaveBeenCalledTimes(1);
    });
    it('check if the consumer called a method on the class instance 2', () => {
        expect(Transformator).not.toHaveBeenCalled();

        const transformator = new Transformator(
            "src/TestFiles/steuereinnahmen_bis_september_2013.ods",
            "createBtnDiv", buttonDiv)
        transformator.xlxsReadFile()
        expect(Transformator).toHaveBeenCalledTimes(1);

        // mock.instances is available with automatic mocks:
        const transformator1 = Transformator.mock.instances[0];
        const mockxlxsReadFile = transformator1.xlxsReadFile;
        expect(mockxlxsReadFile).toHaveBeenCalledWith();
        expect(mockxlxsReadFile).toHaveBeenCalledTimes(1);
    });

    describe("Mock Error", function () {
        beforeAll(() => {
            Transformator.mockImplementation(() => {
                return {
                    xlsxReadFile: () => {
                        throw new Error('Test error');
                    },
                };
            });
        });

        it('Should throw an error when calling xlxsReadFile or csvReadFromFile', () => {
            const transformator = new Transformator(
                "src/TestFiles/asdasdasdasd.asasa",
                "createBtnDiv", buttonDiv)
            expect(() => transformator.xlxsReadFile()).toThrow();
            expect(() => transformator.csvFromFileToTable()).toThrow();
        });
    })
    it('The consumer should be able to call new() on Transformator', () => {
        const transformator = new Transformator(
            "src/TestFiles/steuereinnahmen_bis_september_2013.ods",
            "createBtnDiv", buttonDiv)
        expect(transformator).toBeTruthy();
    });

})

/*
* Testen, ob die Tabelle richtig erstellt wird wie gewünscht.
* Dafür werden alle Spalten getestet, ob die erstellt wurden,
* deren values, Eigenschaften z.B. style, die Hide-Columns-button... den Headers der Datei identifizieren.
* */
describe("Tests for table creation", function () {
    var input = "id,altersgruppe,fallzahl,differenz,inzidenz\n" +
        "3,0-4,77,3,40.6\n" +
        "6, 5-9,69,1,40.9\n" +
        "9, 10-14,104,0,68\n"
    var headers = ["id", "altersgruppe", "fallzahl", "differenz", "inzidenz"]
    var div = document.createElement('div');
    div.id = "gridTable"
    document.body.appendChild(div)
    let grid = new Grid()

    let table = grid.gridVisualization(input, headers, "gridTable")
    test("Table was created ", function () {
        expect(d3.select("#tblVis").empty()).toBe(false)
        expect(d3.select("#tblVis")).toBeTruthy()
    })
    test("Column id was created ", function () {
        expect(d3.select("#th_id").empty()).toBe(false)
        expect(d3.select("#th_id")).toBeTruthy()
    })
    test("Return text of column id ", function () {
        expect(d3.select("#th_id").text()).toBe("id")
    })
    test("'Title's Hide Column button'  of column id", function () {
        expect($("#th_id").find("button").attr("title")).toBe("Hide Column")
    })
    test("'Class's Hide Column button'  of column id", function () {
        expect($("#th_id").find("button").attr("class")).toBe("pull-right btnEyeSlash")
    })
    $("#th_id").find("button").click()
    test("Show footer after hiding", function () {
        expect(d3.select(".footerRestoreColumn").empty()).toBe(false)
    })

    test("Column altersgruppe was created ", function () {
        expect(d3.select("#th_altersgruppe").empty()).toBe(false)
    })
    test("Return text of column altersgruppe ", function () {
        expect(d3.select("#th_altersgruppe").text()).toBe("altersgruppe")
    })
    test("'Title's Hide Column button'  of column altersgruppe", function () {
        expect($("#th_altersgruppe").find("button").attr("title")).toBe("Hide Column")
    })
    test("'Class's Hide Column button'  of column id", function () {
        expect($("#th_altersgruppe").find("button").attr("class")).toBe("pull-right btnEyeSlash")
    })
    $("#th_altersgruppe").find("button").click()
    test("Show footer after hiding", function () {
        expect(d3.select(".footerRestoreColumn").empty()).toBe(false)
    })


    test("Column fallzahl was created ", function () {
        expect(d3.select("#th_fallzahl").empty()).toBe(false)
    })
    test("Return text of column fallzahl ", function () {
        expect(d3.select("#th_fallzahl").text()).toBe("fallzahl")
    })
    test("'Title's Hide Column button'  of column fallzahl", function () {
        expect($("#th_fallzahl").find("button").attr("title")).toBe("Hide Column")
    })
    test("'Class's Hide Column button'  of column fallzahl", function () {
        expect($("#th_fallzahl").find("button").attr("class")).toBe("pull-right btnEyeSlash")
    })
    $("#th_fallzahl").find("button").click()
    test("Show footer after hiding", function () {
        expect(d3.select(".footerRestoreColumn").empty()).toBe(false)
    })

    test("Column differenz was created ", function () {
        expect(d3.select("#th_differenz").empty()).toBe(false)
    })
    test("Return text of column differenz ", function () {
        expect(d3.select("#th_differenz").text()).toBe("differenz")
    })
    test("'Title's Hide Column button'  of column differenz", function () {
        expect($("#th_differenz").find("button").attr("title")).toBe("Hide Column")
    })
    test("'Class's Hide Column button'  of column differenz", function () {
        expect($("#th_differenz").find("button").attr("class")).toBe("pull-right btnEyeSlash")
    })
    $("#th_differenz").find("button").click()
    test("Show footer after hiding", function () {
        expect(d3.select(".footerRestoreColumn").empty()).toBe(false)
    })

    test("Column inzidenz was created ", function () {
        expect(d3.select("#th_inzidenz").empty()).toBe(false)
    })
    test("Return text of column inzidenz ", function () {
        expect(d3.select("#th_inzidenz").text()).toBe("inzidenz")
    })
    test("'Title's Hide Column button'  of column inzidenz", function () {
        expect($("#th_inzidenz").find("button").attr("title")).toBe("Hide Column")
    })
    test("'Class's Hide Column button'  of column inzidenz", function () {
        expect($("#th_inzidenz").find("button").attr("class")).toBe("pull-right btnEyeSlash")
    })
    $("#th_inzidenz").find("button").click()
    test("Show footer after hiding", function () {
        expect(d3.select(".footerRestoreColumn").empty()).toBe(false)
    })


    test("Check tbody not empty", function () {
        expect($("#tblVis").find('tbody tr')).not.toBeNull()
    })

})

/*
* CheckUrl ist einer der wichtigsten Methode der Bibliothek,
* sie checkt, ob eine angegebene URL noch gültig ist oder
* die akzeptabelen Formaten enthalten.
* Hier werden sie getestet, wie sie die richtige Informationen z.B. status, contentType,statusText
*  zurückgibt wie erwartet, wenn sie
* eine gültige Csv-Url, die Excel-Urls und eine ungültige Url bekommt.
* */
describe("Tests for checkUrl", function () {
    it('checkUrl should return the csv contentType and status 200 of url', async () => {
        const data = await checkURL("http://samplecsvs.s3.amazonaws.com/Sacramentorealestatetransactions.csv").then(da => {
            expect(da.contentType).toEqual("application/x-csv");
            expect(da.status).toEqual(200);
            expect(da.statusText).toEqual("OK");
        })
    });
    it('checkUrl should return the Excel contentType and status 200 of url with xls-Extension', async () => {
        const data = await checkURL("https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_10.xls").then(da => {
            expect(da.contentType).toEqual("application/vnd.ms-excel");
            expect(da.status).toEqual(200);
            expect(da.statusText).toEqual("OK");
        })
    });
    it('checkUrl should return the Excel contentType and status 200 of url with xlsx-Extension', async () => {
        const data = await checkURL("https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_10.xlsx").then(da => {
            expect(da.contentType).toEqual("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            expect(da.status).toEqual(200);
            expect(da.statusText).toEqual("OK");
        })
    });
    it('checkUrl should return the Excel contentType and status 200 of url with ods-Extension', async () => {
        const data = await checkURL("https://example-files.online-convert.com/spreadsheet/ods/example.ods").then(da => {
            expect(da.contentType).toEqual("application/vnd.oasis.opendocument.spreadsheet");
            expect(da.status).toEqual(200);
            expect(da.statusText).toEqual("OK");
        })
    });

    it('checkUrl should return the wrong contentType and status of url', async () => {
        const data = await checkURL("http://samplecsvs.s3.amazonaws.com/Wrong.csv").then(da => {
            expect(da.contentType).toEqual("application/xml");
            expect(da.status).toEqual(403);
            expect(da.statusText).toEqual("Forbidden");
        })
    });
})

