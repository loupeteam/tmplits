/*
 * File: module.js
 * Copyright (c) 2023 Loupe
 * https://loupe.team
 * 
 * This file is part of tmplits, licensed under the MIT License.
 * 
 */

//DO NOT DELETE THIS FILE 
//- Doing so will cause 404 errors on the client side which will not break anything, but will throw errors in the console.

//This file will get loaded as a javascript module, meaning you can import other modules from here.
//You can also export functions from here, which will be available to the client side.

//import * from "./module2.js"//Import relative to this file inside node_modules/this-module-name/
//import * from "../tmplits-some-other/module.js"//Import relative to this file inside node_modules/tmplits-some-other/
//import * from "/somewhere.js"//Import from the root of the project

//Define your tmplit functions here and export them to make them globally available
//export function TmplitHelloWorld(context, args){
//    return `Hello ${context[0]}!`
//}


/* Example Column Usage
    {{#tmplit 'Columns' 'label' maxColumns=2}}
        <div style="text-align:center">Column 1 Header</div>
        <div style="text-align:center">Column 2 Header</div>
        {{tmplit 'NumericOutput' '<label>' data-var-name='<var>'}}
        {{tmplit 'NumericOutput' '<label>' data-var-name='<var>'}}
        {{tmplit 'NumericOutput' '<label>' data-var-name='<var>'}}
        {{tmplit 'NumericOutput' '<label>' data-var-name='<var>'}}
    {{/tmplit}}

* This Tmplit will create the maxColumn amount of columns and add the children elements in order from left to right.
* The Columns will be equally spaced by the "margin: auto" styling.
*/

import * as util from "../tmplits-utilities/module.js"

export function TmplitColumns(context, args) {
    //Pull out any attributes we need
    let {
        style = '', centerItems, maxColumns = 3, minColumns=1, columnFlow = 0, ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    //Add our classes
    classList = classList.concat(['lui-grid'])

    //Read the nodes and clean them up to figure out how many columns/rows
    let nodes = util.htmlToElements(args.children)
    let children = ''
    let count = 0
    for( let i in nodes){
        let el = nodes[i]
        switch (el.tagName) {
            case undefined:
                break
            default:
            children += el.outerHTML        
            count++;
        }
    }
    let columns = count > maxColumns ? maxColumns : count
    columns = columns < minColumns ? minColumns : columns

    let rows = Math.floor(count / columns)
    let userStyle = style
    //Generate the style
    style = ''
    style += `display:grid; grid-gap:5px;`
    style += `grid-auto-rows: max-content;`
    if (centerItems) {
        style += `align-items:center;justify-items:center;`
    }
    //Setup columns and rows based on the flow direction
    style = `${ columnFlow > 0 ? `grid-template: repeat(${rows},1fr) / repeat(${columns},1fr); grid-auto-flow : column;` : `grid-template-columns : repeat(${columns},1fr);`}` + style + userStyle
    //This ensures the size is the same but there is a small gap for the border
    // style += `padding: 2px; margin: -2px;`

    let label = ''
    if (context[0]){
        classList = classList.concat(['lui-grid-labeled'])
        label = `<div class='lui-grid-heading' style="grid-column: span ${columns}; margin: auto;">${context[0]}</div>`
    }

    return `
    <div ${attr} class='${classList.join(' ')}' style="${style};">
        ${label}
        ${children}
    </div>
    `
}
