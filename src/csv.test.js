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
describe("return csv data after reading",function () {
    const columns =["Country","Value"]
    it('Return columns', async () => {
        const data = await csvRead("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv")
            .then(function (dat) {
                expect(dat.columns).toEqual(columns);
            })
    });
    let data = [
        {
            Country: "United States",
            Value: "12394",
        },
        {
            Country: "Russia",
            Value: "6148",
        },
        {
            Country: "Germany (FRG)",
            Value: "1653",
        },
        {
            Country: "France",
            Value: "2162",
        },
        {
            Country: "United Kingdom",
            Value: "1214",
        },
        {
            Country: "China",
            Value: "1131",
        },
        {
            Country: "Spain",
            Value: "814",
        },
        {
            Country: "Netherlands",
            Value: "1167",
        },
        {
            Country: "Italy",
            Value: "660",
        },
        {
            Country: "Israel",
            Value: "1263",
        },
    ]
    it('Return data', async () => {
        await csvRead("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv")
            .then(function (dat) {
                let arr = Array.from(dat)
                let arr2 = Array.from(data)
                expect(arr).toEqual(arr2);
            })
    });
    it('Return 404 Not Found because the url is wrong', async () => {
        const data = await  csvRead("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_headeasasdasr.csv")
            .then(function (data) {
            }).catch(function (error) {
                expect(error.toString()).toContain("404 Not Found")
            })
        expect(data).toBeFalsy()
    });
})

