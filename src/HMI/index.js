//Load the style sheet
import sheet from './widgets.css' assert { type: 'css' };
document.adoptedStyleSheets = [sheet];

//Load the widgets system
import Widgets from './widgets.js'

//Load the widget components
import * as components from '../widgets-globalclasses/module.js'

//go through each component and add it to the global scope
for( let key in components ){
    window[key] = components[key]
}

//Figure out the base path so we know where to load the widgets from
let baseEl = document.querySelector('base')
let base = './node_modules/'
if( baseEl ){
    //If the base href contains node_modules we need to go up a level
    base = baseEl.href.indexOf('node_modules') > -1 ? './' : './node_modules/'
}

//Load the widgets
var widgets = new Widgets(base, (data) => {

  //Start the widgets
  widgets.loadPage(data.startPage.container, data.startPage.name)

})

window.widgets = widgets

