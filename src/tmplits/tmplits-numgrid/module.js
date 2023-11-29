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

/*

*/

import * as util from "../tmplits-utilities/module.js"

export function TmplitNumGrid(context, args) {
    let {
        style = '',
            ['data-var-name-num-rows']: dataVarNameNumRows,
            ['data-var-name-num-cols']: dataVarNameNumCols,
            ['data-var-name-data-table']: dataVarNameDataTable,
            ['label-rows']: labelRows,
            ['label-cols']: labelCols,
            ..._args
    } = args.hash

    // Get cleaned values
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    classList = classList.concat(['grid'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])+("")/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    return`
        <table class="${classList.join(' ')} ${attr}" data-var-name-num-rows=${dataVarNameNumRows} data-var-name-num-cols=${dataVarNameNumCols} data-var-name-data-table=${dataVarNameDataTable} label-rows=${labelRows} label-cols=${labelCols}>${context[0]}</table>

    `
}