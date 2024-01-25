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

import * as util from "../tmplits-utilities/module.js"

export function TmplitTable(context, args) {

    let {
        ..._args
    } = args.hash

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    classList.push('tmplit-table');

    let title = ''
    if (context[0]){
        title = `<div class="tmplit-table-header">${context[0]}</div>`
    }

    return `
    <div>
        ${title}
        <div class="${classList.join(" ")}" ${attr}>
        ${args.children}
        </div>
    </div>
    `
}