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


/* Example Directory Browser Usage
{{tmplit 'DirectoryBrowser' data-var-name='tmplitTest:f.in.cwd' data-var-name-files='tmplitTest:Directory' data-var-name-willopen='tmplitTest:f.in.refresh'}}

Options:
data-var-name: finder function current working directory
data-var-name-files: Json string output by the finder function
data-var-name-willopen: refresh bool in finder function
*/

export function TmplitDirectoryBrowser( context, args){
    let {        
        ['data-var-name']:dataVarName,
        ['data-var-name-files']:dataVarNameFiles,
        style = '', ..._args
    } = args.hash
    if(dataVarNameFiles){
        args.hash['data-var-name-field'] = dataVarName
    }
    delete args.hash['data-var-name']
    args.hash.set = false
    args.children += `<invisible-input style='display:none' class='webhmi-text-value lui-directory-data' data-var-name='${dataVarNameFiles}'></invisible-input>`
    return `    
    ${TmplitDropdownTable( context, args )}
`
}