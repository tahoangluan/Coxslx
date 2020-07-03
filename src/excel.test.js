import {getWorkbook,sheetToJson} from "./dataTransformation";
let d3 = require("d3")
let XLSX = require("xlsx")
const $ = require('jquery');
import "isomorphic-fetch"
import {checkURL} from "./coxlsx";

describe("return csv data after reading",function () {
    let data;
    beforeAll(async () =>{
        data  = await checkURL("https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_10.xls")
            .then(function (response) {
                let arrayBuffer = response.arrayBuffer
                let result =  getWorkbook(arrayBuffer)
                return result
            })
    } )

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
        var sheetToJson = sheetToJson(0,data.workbookArray)
        expect(sheetToJson).toEqual(sheet)

    });
    it('Return sheet name ', async () => {
        let sheetName = ["Sheet1"]
        expect(data.sheetname).toEqual(sheetName)
        expect(data.sheetname.length).toBe(1)
    });
})
