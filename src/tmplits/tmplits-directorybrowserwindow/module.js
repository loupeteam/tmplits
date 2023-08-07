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

export function TmplitDirectoryBrowserWindow( context, args){
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
    args.children += `<invisible-input style='display:none' class='webhmi-text-value lui-directory-data' data-var-name='${dataVarNameFiles}'></invisible-input><dropdown>No Data</dropdown>`
    return `
    <div style='width:100%;height:100%;'>
    ${TmplitTableSelect( context, args )}
    </div>
`
}