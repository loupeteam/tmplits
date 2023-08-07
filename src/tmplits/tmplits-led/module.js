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

export function TmplitLed(context, args) {
    let {
        side = 'middle', ['data-var-name']: dataVarName, buttonType = '', buttonVarName = '', error=false, warning=false, ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    // apply the Led label if there is one
    let labelStyle = ''
    let result;
    let finalResult;
    if (args.children == "" && context[0]) {
        args.children = `<h3>${context[0]}</h3><h3/>`
        result = args.children.replace(/([A-Z])/g, " $1");
        finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        switch (side.trim().toLowerCase()) {
            case 'middle':
                labelStyle += 'margin-right: auto; margin-left: auto;'
                break;
            case 'right':
                labelStyle += 'margin-left: auto;'
                break
        }
    }

    if (util.getButtonType(buttonType, classList)) {
        if (buttonVarName == '') {
            buttonVarName = dataVarName
            classList.splice(classList.findIndex((e) => {
                return e == 'webhmi-led'
            }),1)
        }
        attr += `data-var-name='${buttonVarName}'`
    }

    let label = '' 
    if (context[0]){
        classList = classList.concat(['input-group', 'form-control', 'label-led' ])
        label = `<div class='led-label' style='${labelStyle}' >${finalResult}</div>`
    } 

    return `
        <div class="${classList.join(' ')}" ${attr}>
        <div class='led webhmi-led' data-led-false='led-off' data-led-true='${error ? 'led-red': (warning ? 'led-yellow':'led-green') }' data-var-name='${dataVarName}' ${attr}></div>
        ${label}
        </div>
    `
}