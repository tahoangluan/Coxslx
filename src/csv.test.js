import {csvRead} from "./dataTransformation";

let d3 = require("d3")
let XLSX = require("xlsx")
const $ = require('jquery');
import "isomorphic-fetch"
import {checkURL} from "./coxlsx";

/*
* Testen, wie das Programm reagiert, wenn es eine csv-datei liest
* @Input: https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv
* return 404 wenn die Url falsch ist,
* return die richtige Daten
* return die Spalten der Datei und zwar hier : ["Country","Value"]
* */
describe("return csv data after reading", function () {
    const columns = ["Country", "Value"]
    it('Return columns', async () => {
        const data = await csvRead("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv")
            .then(function (dat) {
                expect(dat.columns).toEqual(columns);
            })
    });
    let data =
        {
            Country: "United States",
            Value: "12394",
        }
    it('Return data', async () => {
        await csvRead("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv")
            .then(function (dat) {
                let arr = Array.from(dat)

                expect(arr[0]).toEqual(data);
            })
    });
    it('Return 404 Not Found because the url is wrong', async () => {
        const data = await csvRead("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_headeasasdasr.csv")
            .then(function (data) {
            }).catch(function (error) {
                expect(error.toString()).toContain("404 Not Found")
            })
        expect(data).toBeFalsy()
    });
})

