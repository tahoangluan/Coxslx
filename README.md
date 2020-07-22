# coxlsx
Coxlsx is a JavaScript library for transforming and visualizing data using web standards. coxlsx helps you bring the selected data formats to life based on [D3.js](https://d3js.org/) and [Xlsx](https://sheetjs.com/) library. 

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://www.npmjs.com/)
## Installation
### Requirements

* [Node.js](https://nodejs.org/) v4+
* [D3.js](https://d3js.org/) v5
* [Xlsx](https://sheetjs.com/)
* [jQuery](https://jquery.com/)
* [Bootstrap](https://getbootstrap.com/)

### Setup
* Clone this repository
* Open the repository directory in shell
* Install Node.js packages with `npm install`
* Copy the project to your project
* Install frontend dependencies with yarn
* Import the project in your component with `import {render,webSocket} from 'Path To The Project';`
* Import font-awesome.css and bootstrap.min.css in style
* Create a div-container with id where the data is displayed for example `<div id="visualisation"></div>`
* Call the method which you want to call:
* * `render(url,"visualisation")` for CSV or Excel-Format
* * `webSocket(url,timeout,"visualisation")` for Realtime-Data

