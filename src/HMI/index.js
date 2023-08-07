//Load the style sheet
import sheet from './tmplits.css' assert { type: 'css' };
document.adoptedStyleSheets = [sheet];

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

