import {getWorkbook,sheetToJson} from "./dataTransformation.js";
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
describe("Tests for one-sheets-excel-file",function () {
    let data;
    let defaultSheet ;
    beforeAll(async () =>{
        data  = await checkURL("https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_10.xls")
            .then(function (response) {
                let arrayBuffer = response.arrayBuffer
                let result =  getWorkbook(arrayBuffer)
                return result
            })
        defaultSheet = sheetToJson(0,data.workbookArray)

    } )
    it('Return 1 for the num of sheets ', async () => {
        let sheetName = ["Sheet1"]
        expect(data.sheetname.length).toBe(1)
    });
    it('Return sheet as json ', async () => {
        let sheet = [
                {
                    "0": 1,
                    "Age": 32,
                    "Country": "United States",
                    "Date": "15/10/2017",
                    "First Name": "Dulce",
                    "Gender": "Female",
                    "Id": 1562,
                    "Last Name": "Abril"
                },
                {
                    "0": 2,
                    "Age": 25,
                    "Country": "Great Britain",
                    "Date": "16/08/2016",
                    "First Name": "Mara",
                    "Gender": "Female",
                    "Id": 1582,
                    "Last Name": "Hashimoto"
                },
                {
                    "0": 3,
                    "Age": 36,
                    "Country": "France",
                    "Date": "21/05/2015",
                    "First Name": "Philip",
                    "Gender": "Male",
                    "Id": 2587,
                    "Last Name": "Gent"
                },
                {
                    "0": 4,
                    "Age": 25,
                    "Country": "United States",
                    "Date": "15/10/2017",
                    "First Name": "Kathleen",
                    "Gender": "Female",
                    "Id": 3549,
                    "Last Name": "Hanner"
                },
                {
                    "0": 5,
                    "Age": 58,
                    "Country": "United States",
                    "Date": "16/08/2016",
                    "First Name": "Nereida",
                    "Gender": "Female",
                    "Id": 2468,
                    "Last Name": "Magwood"
                },
                {
                    "0": 6,
                    "Age": 24,
                    "Country": "United States",
                    "Date": "21/05/2015",
                    "First Name": "Gaston",
                    "Gender": "Male",
                    "Id": 2554,
                    "Last Name": "Brumm"
                },
                {
                    "0": 7,
                    "Age": 56,
                    "Country": "Great Britain",
                    "Date": "15/10/2017",
                    "First Name": "Etta",
                    "Gender": "Female",
                    "Id": 3598,
                    "Last Name": "Hurn"
                },
                {
                    "0": 8,
                    "Age": 27,
                    "Country": "United States",
                    "Date": "16/08/2016",
                    "First Name": "Earlean",
                    "Gender": "Female",
                    "Id": 2456,
                    "Last Name": "Melgar"
                },
                {
                    "0": 9,
                    "Age": 40,
                    "Country": "United States",
                    "Date": "21/05/2015",
                    "First Name": "Vincenza",
                    "Gender": "Female",
                    "Id": 6548,
                    "Last Name": "Weiland"
                }
            ]
        expect(defaultSheet).toEqual(sheet)

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
describe("Tests for multiple-sheets-excel-file",function () {
    let data;
    let defaultSheet1,defaultSheet2,defaultSheet3 ;
    beforeAll(async () =>{
        data  = await checkURL("https://drive.google.com/u/0/uc?id=1U8kRRRr2NCP_4HB0u0evPlFk4JWUFT4_&export=download")
            .then(function (response) {
                let arrayBuffer = response.arrayBuffer
                let result =  getWorkbook(arrayBuffer)
                return result
            })
        defaultSheet1 = sheetToJson(0,data.workbookArray)
        defaultSheet2 = sheetToJson(1,data.workbookArray)
        defaultSheet3 = sheetToJson(2,data.workbookArray)

    },30000 )

    it('Return 3 for the num of sheets ', async () => {
        expect(data.sheetname.length).toBe(3)
    });
    it('Return sheet 1 ', async () => {
        let sheet1 = [
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
                },
                {
                    "Fächer": "Chemie",
                    "Prüflinge_Gesamt_2017": 492,
                    "Prüflinge_GY_2017": 397,
                    "Prüflinge_GE_2017": 95,
                    "Prüflinge_Gesamt_2016": 494,
                    "Prüflinge_GY_2016": 410,
                    "Prüflinge_GE_2016": 84,
                    "Prüflinge_Gesamt_2015": 474,
                    "Prüflinge_GY_2015": 395,
                    "Prüflinge_GE_2015": 79
                },
                {
                    "Fächer": "Chinesisch neu",
                    "Prüflinge_Gesamt_2017": 42,
                    "Prüflinge_GY_2017": 27,
                    "Prüflinge_GE_2017": 15,
                    "Prüflinge_Gesamt_2016": 50,
                    "Prüflinge_GY_2016": 38,
                    "Prüflinge_GE_2016": 12,
                    "Prüflinge_Gesamt_2015": 29,
                    "Prüflinge_GY_2015": 22,
                    "Prüflinge_GE_2015": 7
                },
                {
                    "Fächer": "Deutsch",
                    "Prüflinge_Gesamt_2017": 13775,
                    "Prüflinge_GY_2017": 10717,
                    "Prüflinge_GE_2017": 3058,
                    "Prüflinge_Gesamt_2016": 14460,
                    "Prüflinge_GY_2016": 11324,
                    "Prüflinge_GE_2016": 3136,
                    "Prüflinge_Gesamt_2015": 13874,
                    "Prüflinge_GY_2015": 11088,
                    "Prüflinge_GE_2015": 2786
                },
                {
                    "Fächer": "Englisch",
                    "Prüflinge_Gesamt_2017": 11229,
                    "Prüflinge_GY_2017": 8848,
                    "Prüflinge_GE_2017": 2381,
                    "Prüflinge_Gesamt_2016": 10501,
                    "Prüflinge_GY_2016": 8320,
                    "Prüflinge_GE_2016": 2181,
                    "Prüflinge_Gesamt_2015": 11979,
                    "Prüflinge_GY_2015": 9767,
                    "Prüflinge_GE_2015": 2212
                },
                {
                    "Fächer": "Erdkunde",
                    "Prüflinge_Gesamt_2017": 3682,
                    "Prüflinge_GY_2017": 3064,
                    "Prüflinge_GE_2017": 618,
                    "Prüflinge_Gesamt_2016": 3473,
                    "Prüflinge_GY_2016": 2809,
                    "Prüflinge_GE_2016": 664,
                    "Prüflinge_Gesamt_2015": 3162,
                    "Prüflinge_GY_2015": 2638,
                    "Prüflinge_GE_2015": 524
                },
                {
                    "Fächer": "Erdkunde (Englisch bilingual)",
                    "Prüflinge_Gesamt_2017": 88,
                    "Prüflinge_GY_2017": 88,
                    "Prüflinge_GE_2017": 55,
                    "Prüflinge_Gesamt_2016": 57,
                    "Prüflinge_GY_2016": 57,
                    "Prüflinge_GE_2016": 32,
                    "Prüflinge_Gesamt_2015": 66,
                    "Prüflinge_GY_2015": 66,
                    "Prüflinge_GE_2015": 14
                },
                {
                    "Fächer": "Ernährungslehre",
                    "Prüflinge_Gesamt_2017": 79,
                    "Prüflinge_GY_2017": 73,
                    "Prüflinge_GE_2017": 6,
                    "Prüflinge_Gesamt_2016": 64,
                    "Prüflinge_GY_2016": 53,
                    "Prüflinge_GE_2016": 11,
                    "Prüflinge_Gesamt_2015": 59,
                    "Prüflinge_GY_2015": 50,
                    "Prüflinge_GE_2015": 9
                },
                {
                    "Fächer": "Erziehungswissenschaft",
                    "Prüflinge_Gesamt_2017": 2394,
                    "Prüflinge_GY_2017": 1646,
                    "Prüflinge_GE_2017": 748,
                    "Prüflinge_Gesamt_2016": 2449,
                    "Prüflinge_GY_2016": 1707,
                    "Prüflinge_GE_2016": 742,
                    "Prüflinge_Gesamt_2015": 2418,
                    "Prüflinge_GY_2015": 1743,
                    "Prüflinge_GE_2015": 675
                },
                {
                    "Fächer": "Evangelische Religionslehre",
                    "Prüflinge_Gesamt_2017": 220,
                    "Prüflinge_GY_2017": 148,
                    "Prüflinge_GE_2017": 72,
                    "Prüflinge_Gesamt_2016": 202,
                    "Prüflinge_GY_2016": 128,
                    "Prüflinge_GE_2016": 74,
                    "Prüflinge_Gesamt_2015": 240,
                    "Prüflinge_GY_2015": 157,
                    "Prüflinge_GE_2015": 83
                },
                {
                    "Fächer": "Französisch fortgeführt",
                    "Prüflinge_Gesamt_2017": 340,
                    "Prüflinge_GY_2017": 324,
                    "Prüflinge_GE_2017": 16,
                    "Prüflinge_Gesamt_2016": 412,
                    "Prüflinge_GY_2016": 394,
                    "Prüflinge_GE_2016": 18,
                    "Prüflinge_Gesamt_2015": 410,
                    "Prüflinge_GY_2015": 397,
                    "Prüflinge_GE_2015": 13
                },
                {
                    "Fächer": "Französisch neu",
                    "Prüflinge_Gesamt_2017": 35,
                    "Prüflinge_GY_2017": 19,
                    "Prüflinge_GE_2017": 16,
                    "Prüflinge_Gesamt_2016": 60,
                    "Prüflinge_GY_2016": 32,
                    "Prüflinge_GE_2016": 28,
                    "Prüflinge_Gesamt_2015": 46,
                    "Prüflinge_GY_2015": 27,
                    "Prüflinge_GE_2015": 19
                },
                {
                    "Fächer": "Geschichte",
                    "Prüflinge_Gesamt_2017": 3404,
                    "Prüflinge_GY_2017": 2540,
                    "Prüflinge_GE_2017": 864,
                    "Prüflinge_Gesamt_2016": 3711,
                    "Prüflinge_GY_2016": 2776,
                    "Prüflinge_GE_2016": 935,
                    "Prüflinge_Gesamt_2015": 3655,
                    "Prüflinge_GY_2015": 2735,
                    "Prüflinge_GE_2015": 920
                },
                {
                    "Fächer": "Geschichte (Englisch bilingual)",
                    "Prüflinge_Gesamt_2017": 88,
                    "Prüflinge_GY_2017": 75,
                    "Prüflinge_GE_2017": 13,
                    "Prüflinge_Gesamt_2016": 93,
                    "Prüflinge_GY_2016": 90,
                    "Prüflinge_GE_2016": 3,
                    "Prüflinge_Gesamt_2015": 90,
                    "Prüflinge_GY_2015": 87,
                    "Prüflinge_GE_2015": 3
                },
                {
                    "Fächer": "Informatik",
                    "Prüflinge_Gesamt_2017": 502,
                    "Prüflinge_GY_2017": 460,
                    "Prüflinge_GE_2017": 42,
                    "Prüflinge_Gesamt_2016": 478,
                    "Prüflinge_GY_2016": 453,
                    "Prüflinge_GE_2016": 25,
                    "Prüflinge_Gesamt_2015": 484,
                    "Prüflinge_GY_2015": 465,
                    "Prüflinge_GE_2015": 19
                },
                {
                    "Fächer": "Italienisch neu",
                    "Prüflinge_Gesamt_2017": 151,
                    "Prüflinge_GY_2017": 129,
                    "Prüflinge_GE_2017": 22,
                    "Prüflinge_Gesamt_2016": 206,
                    "Prüflinge_GY_2016": 151,
                    "Prüflinge_GE_2016": 55,
                    "Prüflinge_Gesamt_2015": 223,
                    "Prüflinge_GY_2015": 165,
                    "Prüflinge_GE_2015": 58
                },
                {
                    "Fächer": "Katholische Religionslehre",
                    "Prüflinge_Gesamt_2017": 242,
                    "Prüflinge_GY_2017": 189,
                    "Prüflinge_GE_2017": 53,
                    "Prüflinge_Gesamt_2016": 245,
                    "Prüflinge_GY_2016": 184,
                    "Prüflinge_GE_2016": 61,
                    "Prüflinge_Gesamt_2015": 248,
                    "Prüflinge_GY_2015": 196,
                    "Prüflinge_GE_2015": 52
                },
                {
                    "Fächer": "Kunst",
                    "Prüflinge_Gesamt_2017": 235,
                    "Prüflinge_GY_2017": 165,
                    "Prüflinge_GE_2017": 70,
                    "Prüflinge_Gesamt_2016": 270,
                    "Prüflinge_GY_2016": 165,
                    "Prüflinge_GE_2016": 105,
                    "Prüflinge_Gesamt_2015": 257,
                    "Prüflinge_GY_2015": 185,
                    "Prüflinge_GE_2015": 72
                },
                {
                    "Fächer": "Lateinisch fortgeführt",
                    "Prüflinge_Gesamt_2017": 240,
                    "Prüflinge_GY_2017": 240,
                    "Prüflinge_GE_2017": 300,
                    "Prüflinge_Gesamt_2016": 281,
                    "Prüflinge_GY_2016": 281,
                    "Prüflinge_GE_2016": 200,
                    "Prüflinge_Gesamt_2015": 259,
                    "Prüflinge_GY_2015": 259,
                    "Prüflinge_GE_2015": 100
                },
                {
                    "Fächer": "Lateinisch neu",
                    "Prüflinge_Gesamt_2017": 54,
                    "Prüflinge_GY_2017": 39,
                    "Prüflinge_GE_2017": 15,
                    "Prüflinge_Gesamt_2016": 51,
                    "Prüflinge_GY_2016": 43,
                    "Prüflinge_GE_2016": 8,
                    "Prüflinge_Gesamt_2015": 52,
                    "Prüflinge_GY_2015": 49,
                    "Prüflinge_GE_2015": 3
                },
                {
                    "Fächer": "Mathematik",
                    "Prüflinge_Gesamt_2017": 24645,
                    "Prüflinge_GY_2017": 21186,
                    "Prüflinge_GE_2017": 3459,
                    "Prüflinge_Gesamt_2016": 27102,
                    "Prüflinge_GY_2016": 23294,
                    "Prüflinge_GE_2016": 3808,
                    "Prüflinge_Gesamt_2015": 27206,
                    "Prüflinge_GY_2015": 23644,
                    "Prüflinge_GE_2015": 3562
                },
                {
                    "Fächer": "Musik",
                    "Prüflinge_Gesamt_2017": 42,
                    "Prüflinge_GY_2017": 32,
                    "Prüflinge_GE_2017": 10,
                    "Prüflinge_Gesamt_2016": 38,
                    "Prüflinge_GY_2016": 36,
                    "Prüflinge_GE_2016": 2,
                    "Prüflinge_Gesamt_2015": 37,
                    "Prüflinge_GY_2015": 34,
                    "Prüflinge_GE_2015": 3
                },
                {
                    "Fächer": "Niederländisch fortgeführt",
                    "Prüflinge_Gesamt_2017": 76,
                    "Prüflinge_GY_2017": 63,
                    "Prüflinge_GE_2017": 13,
                    "Prüflinge_Gesamt_2016": 57,
                    "Prüflinge_GY_2016": 45,
                    "Prüflinge_GE_2016": 12,
                    "Prüflinge_Gesamt_2015": 53,
                    "Prüflinge_GY_2015": 41,
                    "Prüflinge_GE_2015": 12
                },
                {
                    "Fächer": "Niederländisch neu",
                    "Prüflinge_Gesamt_2017": 240,
                    "Prüflinge_GY_2017": 151,
                    "Prüflinge_GE_2017": 89,
                    "Prüflinge_Gesamt_2016": 237,
                    "Prüflinge_GY_2016": 144,
                    "Prüflinge_GE_2016": 93,
                    "Prüflinge_Gesamt_2015": 244,
                    "Prüflinge_GY_2015": 169,
                    "Prüflinge_GE_2015": 75
                },
                {
                    "Fächer": "Philosophie",
                    "Prüflinge_Gesamt_2017": 879,
                    "Prüflinge_GY_2017": 659,
                    "Prüflinge_GE_2017": 220,
                    "Prüflinge_Gesamt_2016": 823,
                    "Prüflinge_GY_2016": 637,
                    "Prüflinge_GE_2016": 186,
                    "Prüflinge_Gesamt_2015": 878,
                    "Prüflinge_GY_2015": 613,
                    "Prüflinge_GE_2015": 265
                },
                {
                    "Fächer": "Physik",
                    "Prüflinge_Gesamt_2017": 835,
                    "Prüflinge_GY_2017": 740,
                    "Prüflinge_GE_2017": 95,
                    "Prüflinge_Gesamt_2016": 842,
                    "Prüflinge_GY_2016": 744,
                    "Prüflinge_GE_2016": 98,
                    "Prüflinge_Gesamt_2015": 843,
                    "Prüflinge_GY_2015": 758,
                    "Prüflinge_GE_2015": 85
                },
                {
                    "Fächer": "Psychologie",
                    "Prüflinge_Gesamt_2017": 196,
                    "Prüflinge_GY_2017": 151,
                    "Prüflinge_GE_2017": 45,
                    "Prüflinge_Gesamt_2016": 217,
                    "Prüflinge_GY_2016": 184,
                    "Prüflinge_GE_2016": 33,
                    "Prüflinge_Gesamt_2015": 167,
                    "Prüflinge_GY_2015": 119,
                    "Prüflinge_GE_2015": 48
                },
                {
                    "Fächer": "Russisch neu",
                    "Prüflinge_Gesamt_2017": 89,
                    "Prüflinge_GY_2017": 72,
                    "Prüflinge_GE_2017": 17,
                    "Prüflinge_Gesamt_2016": 80,
                    "Prüflinge_GY_2016": 70,
                    "Prüflinge_GE_2016": 10,
                    "Prüflinge_Gesamt_2015": 93,
                    "Prüflinge_GY_2015": 73,
                    "Prüflinge_GE_2015": 20
                },
                {
                    "Fächer": "Sozialwissenschaften (inkl. Wirtschaft)",
                    "Prüflinge_Gesamt_2017": 3272,
                    "Prüflinge_GY_2017": 2481,
                    "Prüflinge_GE_2017": 791,
                    "Prüflinge_Gesamt_2016": 3232,
                    "Prüflinge_GY_2016": 2506,
                    "Prüflinge_GE_2016": 726,
                    "Prüflinge_Gesamt_2015": 3003,
                    "Prüflinge_GY_2015": 2370,
                    "Prüflinge_GE_2015": 633
                },
                {
                    "Fächer": "Spanisch fortgeführt",
                    "Prüflinge_Gesamt_2017": 238,
                    "Prüflinge_GY_2017": 229,
                    "Prüflinge_GE_2017": 9,
                    "Prüflinge_Gesamt_2016": 137,
                    "Prüflinge_GY_2016": 127,
                    "Prüflinge_GE_2016": 10,
                    "Prüflinge_Gesamt_2015": 150,
                    "Prüflinge_GY_2015": 129,
                    "Prüflinge_GE_2015": 21
                },
                {
                    "Fächer": "Spanisch neu",
                    "Prüflinge_Gesamt_2017": 805,
                    "Prüflinge_GY_2017": 593,
                    "Prüflinge_GE_2017": 212,
                    "Prüflinge_Gesamt_2016": 831,
                    "Prüflinge_GY_2016": 644,
                    "Prüflinge_GE_2016": 187,
                    "Prüflinge_Gesamt_2015": 952,
                    "Prüflinge_GY_2015": 728,
                    "Prüflinge_GE_2015": 224
                },
                {
                    "Fächer": "Technik",
                    "Prüflinge_Gesamt_2017": 47,
                    "Prüflinge_GY_2017": 34,
                    "Prüflinge_GE_2017": 13,
                    "Prüflinge_Gesamt_2016": 46,
                    "Prüflinge_GY_2016": 32,
                    "Prüflinge_GE_2016": 14,
                    "Prüflinge_Gesamt_2015": 43,
                    "Prüflinge_GY_2015": 20,
                    "Prüflinge_GE_2015": 23
                },
                {
                    "Fächer": "Türkisch fortgeführt",
                    "Prüflinge_Gesamt_2017": 63,
                    "Prüflinge_GY_2017": 31,
                    "Prüflinge_GE_2017": 32,
                    "Prüflinge_Gesamt_2016": 63,
                    "Prüflinge_GY_2016": 21,
                    "Prüflinge_GE_2016": 42,
                    "Prüflinge_Gesamt_2015": 62,
                    "Prüflinge_GY_2015": 15,
                    "Prüflinge_GE_2015": 47
                }
            ]
        expect(defaultSheet1).toEqual(sheet1)
    });
    it('Return sheet 2 ', async () => {
        let sheet2 = [
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
                },
                {
                    "ABCXYZ": "nicht bestanden",
                    "2017_Gesamt": 3244,
                    "2017_GY": 2065,
                    "2017_GE": 1179,
                    "2016_Gesamt": 2795,
                    "2016_GY": 1828,
                    "2016_GE": 967,
                    "2015_Gesamt": 2763,
                    "2015_GY": 1804,
                    "2015_GE": 959
                },
                {
                    "ABCXYZ": "Quote in Prozent",
                    "2017_Gesamt": 4.23,
                    "2017_GY": 3.33,
                    "2017_GE": 8.06,
                    "2016_Gesamt": 3.51,
                    "2016_GY": 2.83,
                    "2016_GE": 6.44,
                    "2015_Gesamt": 3.46,
                    "2015_GY": 2.74,
                    "2015_GE": 6.83
                },
                {
                    "ABCXYZ": "Abiturdurchschnittsnote",
                    "2017_Gesamt": 2.44,
                    "2017_GY": 2.4,
                    "2017_GE": 2.65,
                    "2016_Gesamt": 2.45,
                    "2016_GY": 2.41,
                    "2016_GE": 2.65,
                    "2015_Gesamt": 2.47,
                    "2015_GY": 2.42,
                    "2015_GE": 2.68
                },
                {
                    "ABCXYZ": "Standardabweichung",
                    "2017_Gesamt": 0.66,
                    "2017_GY": 0.67,
                    "2017_GE": 0.58,
                    "2016_Gesamt": 0.66,
                    "2016_GY": 0.66,
                    "2016_GE": 0.57,
                    "2015_Gesamt": 0.65,
                    "2015_GY": 0.66,
                    "2015_GE": 0.57
                },
                {
                    "ABCXYZ": "Prüflinge mit Bestnote (1,0)",
                    "2017_Gesamt": 1431,
                    "2017_GY": 1370,
                    "2017_GE": 61,
                    "2016_Gesamt": 1417,
                    "2016_GY": 1348,
                    "2016_GE": 69,
                    "2015_Gesamt": 1234,
                    "2015_GY": 1185,
                    "2015_GE": 49
                }
            ]
        expect(defaultSheet2).toEqual(sheet2)
    });
    it('Return sheet 3 ', async () => {
        let sheet3 = [
            { id: 1, Name: 'Abril', Gehalt: 15, Age: 32 },
                { id: 2, Name: 'Hashimoto', Gehalt: 60, Age: 25 },
                { id: 3, Name: 'Gent', Gehalt: 80, Age: 36 },
                { id: 4, Name: 'Hanner', Gehalt: 30, Age: 25 },
                { id: 5, Name: 'Magwood', Gehalt: 40, Age: 58 },
                { id: 6, Name: 'Brumm', Gehalt: 100, Age: 24 },
                { id: 7, Name: 'Hurn', Gehalt: 500, Age: 56 },
                { id: 8, Name: 'Melgar', Gehalt: 100, Age: 27 },
                { id: 9, Name: 'Weiland', Gehalt: 55, Age: 40 }
            ]
        expect(defaultSheet3).toEqual(sheet3)
    });
    it('Return sheets name ', async () => {
        let sheetName = ["Übersicht","Ergebnisüberblick","Example"]
        expect(data.sheetname).toEqual(sheetName)
        expect(data.sheetname[0]).toEqual("Übersicht")
        expect(data.sheetname[1]).toEqual("Ergebnisüberblick")
        expect(data.sheetname[2]).toEqual("Example")
    });
})

/*
   * Testen, wie die Methode createAndModifyDivs reagiert
   * */
describe("Test for method createAndModifyDivs",function () {
    let data;
    beforeAll(async () =>{
        data  = await checkURL("https://drive.google.com/u/0/uc?id=1U8kRRRr2NCP_4HB0u0evPlFk4JWUFT4_&export=download")
            .then(function (response) {
                let arrayBuffer = response.arrayBuffer
                let result =  getWorkbook(arrayBuffer)
                return result
            })
    } )
    var div = document.createElement('div');
    div.id = "createAndModifyDivs"
    document.body.appendChild(div)

    /*
    * Testen, ob der Container, in dem die Sheets der Tabelle visualisiert wird, richtig erstellt wurde
    * */
    it('Test if div-container showSheet was created', async () =>{
        createAndModifyDivs("createAndModifyDivs",data.sheetname)
        expect(document.getElementById("showSheet")).toBeTruthy()
        expect(d3.select("#showSheet").attr("style")).toBe("display: flex;")
        expect(d3.select("#showSheet").attr("class")).toBe("showSheet")
    });
    it('Test if div-container for sheets-button was created', async () =>{
        createAndModifyDivs("createAndModifyDivs",data.sheetname)
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