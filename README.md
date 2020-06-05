# coxlsx
Coxlsx is a JavaScript library for transforming and visualizing data using web standards. coxlsx helps you bring the selected data formats to life based on [D3.js](https://d3js.org/) and [Xlsx](https://sheetjs.com/) library. 

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://www.npmjs.com/)
## Installation

Coxlsx requires [Node.js](https://nodejs.org/) v4+, [D3.js](https://d3js.org/) v5,[Xlsx](https://sheetjs.com/),[jQuery](https://jquery.com/) and [Bootstrap](https://getbootstrap.com/)  to run.

To Install it you have to use npm
`npm install coxlsx`


Coxlsx ist written using [D3.js](https://d3js.org/) v5 and [Xlsx](https://sheetjs.com/).
This repo has two main purposes:
* Generate shareable `css` and `js` assets for use by others

## Usage
```html
required : Bootstrap, JQuery, Nodejs, font-awesome
```
First at all, After installing you have to import it to your projekt. For Example:
```html
<script type="module" src="/node_modules/coxlsx/src/coxlsx.js" >
  import {...} from "path/To/coxlsx.js"
</script
```
  
To render your file to table or visualize it to graphs you have to create a div container in which you want to visualize your data. Something like this:
```html
<div id="divId" ></div>
```
After that, in your own js your have to write just one line 
```html
render(fileUrl,divId)
```
## Example
For the data here:
https://www.stats.govt.nz/assets/Uploads/Abortion-statistics/Abortion-statistics-Year-ended-December-2018/Download-data/abortion-statistics-year-ended-december-2018-abortions-by-age-of-woman-csv.csv
Firstly import coxlsx:
```html
<script type="module" src="/node_modules/coxlsx/src/coxlsx.js" >
  import {render} from "path/To/coxlsx.js"
</script>
```
And then define your div
```html
<div id="divId" ></div>
```
After that render the data with url
```html
    render("https://www.stats.govt.nz/assets/Uploads/Abortion-statistics/Abortion-statistics-Year-ended-December-2018/Download-data/abortion-statistics-year-ended-december-2018-abortions-by-age-of-woman-csv.csv","divId")
```
#### Result
###### Visualized Table
<p>
  <img src="https://github.com/tahoangluan/FrontendLibrary/blob/master/table.png" width="300">
</p>
<p>
    <em>Visualized Table</em>
</p>
<p>
  <img src="https://github.com/tahoangluan/FrontendLibrary/blob/master/createChart.png" width="300">
</p>
<p>
    <em>Create Chart</em>
</p>
<p>
  <img src="https://github.com/tahoangluan/FrontendLibrary/blob/master/chartModal.png" width="300">
</p>
<p>
    <em>Chart Modal</em>
</p>
<p>
<img src="https://github.com/tahoangluan/FrontendLibrary/blob/master/barChart.png" width="300">
</p>
<p>
    <em>Stacked- & Bar Chart</em>
</p>
<p>
  <img src="https://github.com/tahoangluan/FrontendLibrary/blob/master/connectedScatterplot.png" width="300">
</p>
<p>
    <em>Connected Scatter Plot</em>
</p>
