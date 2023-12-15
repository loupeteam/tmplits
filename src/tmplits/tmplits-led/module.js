/*
 * File: module.js
 * Copyright (c) 2023 Loupe
 * https://loupe.team
 * 
 * This file is part of tmplits, licensed under the MIT License.
 * 
 */

/* Example Led Usage
{{tmplit 'Led' '<label>' data-var-name='<var>'}}
{{tmplit 'Led' '<label>' error='true' data-var-name='<var>'}}

Options:
error: true or false - Set the led red
warning: true or false - Set the led orange
If neither are used:
    green or gray light for simple status output
*/

import * as util from "../tmplits-utilities/module.js"

export function TmplitLed(context, args) {
    let {
        side = 'middle', ['data-var-name']: dataVarName, buttonType = '', buttonVarName = '', error=false, warning=false, ..._args1
    } = args.hash
    let {
        ['data-led-true']: dataLedTrue = error ? 'led-red': (warning ? 'led-yellow':'led-green'), 
        ['data-led-false']: dataLedFalse = 'led-off',         
        ..._args
    } = _args1

    //Get cleaned up values from args
    let {
        classList,
        attr,
        luiClasses,
        luiAttr,
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
                return e == 'lux-led'
            }),1)
        }
        attr += `data-var-name='${buttonVarName}'`
    }

    let label = '' 
    if (context[0]){
        classList = classList.concat(['input-group', 'form-control', 'label-led' ])
        label = `<div class='led-label' style='${labelStyle}' >${finalResult}</div>`
    } 

    // add the led class to the class list
    let ledClassList = ['lux-led', 'led', ...luiClasses];

    return `
        <div class="${classList.join(' ')}" ${attr}>
        <div class="${ledClassList.join(' ')}" data-led-false=${dataLedFalse} data-led-true='${dataLedTrue}' data-var-name='${dataVarName}' ${attr} ${luiAttr} ></div>
        ${label}
        </div>
    `
}