import {render} from  "./coxlsx"
let d3 = require("d3")
let fs = require("fs")
import {createBtnDiv, errorHTML} from "./dataVisualization"
import {checkDataExtension} from "./coxlsx"
import {Transformator} from "./dataTransformation"
const $ = require('jquery');
const fetch = require('node-fetch') ;
describe('Tests for methods createBtnDiv', function() {
    var div = document.createElement('div');
    div.id = "createBtnDiv"
    document.body.appendChild(div)
    let buttonDiv = createBtnDiv("createBtnDiv")

    test('Test for button with id gridBtnForAddEvent 1', function() {
        expect(d3.select("#gridBtnForAddEvent").empty()).toBe(false);
    });
    test('Test for button with id gridBtnForAddEvent 2', function() {
        expect(d3.select("#gridBtnForAddEvent").attr("class")).toBe("btn btn-primary");
    });
    test('Test for button with id gridBtnForAddEvent 3', function() {
        expect(d3.select("#gridBtnForAddEvent").attr("style")).toBe(null);
    });
    test('Test for button with id gridBtnForAddEvent 4', function() {
        expect(d3.select("#gridBtnForAddEvent").text()).toBe("Grid");
    });

    test('Test for button with id selectedBtn 1', function() {
        expect(d3.select("#selectedBtn").empty()).toBe(false);
    });
    test('Test for button with id selectedBtn 2', function() {
        expect(d3.select("#selectedBtn").attr("class")).toBe("btn btn-primary dropdown-toggle");
    });
    test('Test for button with id selectedBtn 3', function() {
        expect(d3.select("#selectedBtn").attr("style")).toBe("margin-left:5px");
    });
    test('Test for button with id selectedBtn 4', function() {
        expect(d3.select("#selectedBtn").text()).toBe("Graph");
    });

    test('Test for button with id selectedBtn 5', function() {
        $('#selectedBtn').click();
        expect($("[data-target = '#BarChartModal']").text()).toContain('BarChart');
    });
    test('Test for button with id selectedBtn 6', function() {
        $('#selectedBtn').click();
        expect($("[data-target = '#ConnectedChartModal']").text()).toContain('ConnectedChart');
    });

});
describe('Tests for methods errorHTML', function() {
    var div = document.createElement('div');
    div.id = "errorHTML"
    document.body.appendChild(div)
    errorHTML("errorHTML", "File type not supported!",
        "Text of p-Element")
    test('ErrorHtml exists after created', function() {
        expect(d3.select("#errorHTML").empty()).toBe(false);
    });
    test('Class of child div', function() {
        expect(d3.select("#errorHTML").select("div").attr("class")).toBe("js-temp-notice alert alert-warning alert-block");
    });
    test('Text of h3-Element', function() {
        expect(d3.select("#errorHTML").select("div").select("h3").text()).toBe("File type not supported!");
    });
    test('Text of p-Element', function() {
        expect(d3.select("#errorHTML").select("div").select("p").text()).toBe("Text of p-Element");
    });
});
describe('Tests for methods createAndModifyDivs', function() {
    var div = document.createElement('div');
    div.id = "createAndModifyDivs"
    document.body.appendChild(div)
    const viewText = () => {
        fs.readFile('src/TestFiles/steuereinnahmen_bis_september_2013.ods', 'utf8', (err, data) => {
            if (err) throw err;
            console.log(data);
        });
    };
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('prints poem to console', done => {
        const logSpy = jest.spyOn(console, 'log');
        let readFileCallback;
        // @ts-ignore
        jest.spyOn(fs, 'readFile').mockImplementation((path, options, callback) => {
            readFileCallback = callback;
        });
        viewText()
        let mockPoem = "asdasd"
        readFileCallback(null, mockPoem);
        expect(fs.readFile).toBeCalledWith('src/TestFiles/steuereinnahmen_bis_september_2013.ods', 'utf8', readFileCallback);
        done();
    });

});
describe("Check Data Extension",function () {
    test('should return csv', function () {
        expect(checkDataExtension("https://gist.githubusercontent.com/d3noob/fa0f16e271cb191ae85f/raw/bf896176236341f56a55b36c8fc40e32c73051ad/treedata.csv"))
            .toBe("csv")
    });
    test('get ods -> should return excel', function () {
        expect(checkDataExtension("https://gist.githubusercontent.com/d3noob/fa0f16e271cb191ae85f/raw/bf896176236341f56a55b36c8fc40e32c73051ad/treedata.ods"))
            .toBe("excel")
    });
    test('get xls -> should return excel', function () {
        expect(checkDataExtension("https://gist.githubusercontent.com/d3noob/fa0f16e271cb191ae85f/raw/bf896176236341f56a55b36c8fc40e32c73051ad/treedata.xls"))
            .toBe("excel")
    });
    test('get xlsx -> should return excel', function () {
        expect(checkDataExtension("https://gist.githubusercontent.com/d3noob/fa0f16e271cb191ae85f/raw/bf896176236341f56a55b36c8fc40e32c73051ad/treedata.xlsx"))
            .toBe("excel")
    });
    test('should return not supported', function () {
        expect(checkDataExtension("https://gist.githubusercontent.com/d3noob/fa0f16e271cb191ae85f/raw/bf896176236341f56a55b36c8fc40e32c73051ad/treedatasda.casdadsasv"))
            .toBe("notsupported")
    });
})

jest.mock("./dataTransformation");
describe("Tests data transformation",function () {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        Transformator.mockClear();
    });
    var div = document.createElement('div');
    div.id = "createBtnDiv"
    document.body.appendChild(div)
    let buttonDiv = createBtnDiv("createBtnDiv")


    it('check if the consumer called the class constructor', () => {
        let transformator = new Transformator(
            "src/TestFiles/steuereinnahmen_bis_september_2013.ods",
            "createBtnDiv",buttonDiv)
        transformator.xlxsReadFile()
        expect(Transformator).toHaveBeenCalledTimes(1);
    });
    it('check if the consumer called a method on the class instance 1', () => {
        expect(Transformator).not.toHaveBeenCalled();

        const transformator = new Transformator(
            "src/TestFiles/steuereinnahmen_bis_september_2013.ods",
            "createBtnDiv",buttonDiv)
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
            "createBtnDiv",buttonDiv)
        transformator.xlxsReadFile()
        expect(Transformator).toHaveBeenCalledTimes(1);

        // mock.instances is available with automatic mocks:
        const transformator1 = Transformator.mock.instances[0];
        const mockxlxsReadFile = transformator1.xlxsReadFile;
        //xlsxReadFile has no arg
        expect(mockxlxsReadFile).toHaveBeenCalledWith();
        expect(mockxlxsReadFile).toHaveBeenCalledTimes(1);
    });

    describe("Mock Error",function () {
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
                "createBtnDiv",buttonDiv)
            expect(() => transformator.xlxsReadFile()).toThrow();
            expect(() => transformator.csvFromFileToTable()).toThrow();
        });
    })
    it('The consumer should be able to call new() on Transformator', () => {
        const transformator = new Transformator(
            "src/TestFiles/steuereinnahmen_bis_september_2013.ods",
            "createBtnDiv",buttonDiv)
        expect(transformator).toBeTruthy();
    });

})
