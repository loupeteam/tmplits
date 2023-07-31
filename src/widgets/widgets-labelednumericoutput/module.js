//DO NOT DELETE THIS FILE 
//- Doing so will cause 404 errors on the client side which will not break anything, but will throw errors in the console.

//This file will get loaded as a javascript module, meaning you can import other modules from here.
//You can also export functions from here, which will be available to the client side.

//import * from "./module2.js"//Import relative to this file inside node_modules/this-module-name/
//import * from "../widgets-some-other/module.js"//Import relative to this file inside node_modules/widgets-some-other/
//import * from "/somewhere.js"//Import from the root of the project

//Define your widget functions here and export them to make them globally available
//export function WidgetHelloWorld(context, args){
//    return `Hello ${context[0]}!`
//}

import * as util from "../widgets-utilities/module.js"

export function WidgetLabeledNumericOutput(context, args) {

    let {
        ['data-var-name']: dataVarName, ..._args
    } = args.hash

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    classList = classList.concat(['input-group'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return `
    <div class="${classList.join(' ')}" ${attr} >
    <span class='input-group-addon'>${finalResult}</span>
    <div class='form-control webhmi-num-value' ${dataVarName ? 'data-var-name="' + dataVarName + '"' : '' } ${attr}></div>
    </div>
   `
}