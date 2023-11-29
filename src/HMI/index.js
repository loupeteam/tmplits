/*
 * File: index.js
 * Copyright (c) 2023 Loupe
 * https://loupe.team
 * 
 * This file is part of templits, licensed under the MIT License.
 * 
 */

//Load the style sheet
// import sheet from './tmplits.css' assert { type: 'css' };
// document.adoptedStyleSheets = [sheet];

//Append the link to CSS to the head
//This method is more supported that import style sheets
let tmplcss = document.createElement('link')
tmplcss.rel = 'stylesheet'
tmplcss.href = '@loupeteam/tmplits/tmplits.css'
document.head.append(tmplcss)

//Load the tmplits system
import Tmplits from './tmplits.js'

//Load the tmplit components
import * as components from '../tmplits-globalclasses/module.js'

//go through each component and add it to the global scope
for( let key in components ){
    window[key] = components[key]
}

//Figure out the base path so we know where to load the tmplits from
let baseEl = document.querySelector('base')
let base = './node_modules/'
if( baseEl ){
    //If the base href contains node_modules we need to go up a level
    base = baseEl.href.indexOf('node_modules') > -1 ? './' : './node_modules/'
}

//Load the tmplits
var tmplits = new Tmplits(base, (data) => {

  //Start the tmplits
  tmplits.loadPage(data.startPage.container, data.startPage.name)

})

window.tmplits = tmplits

