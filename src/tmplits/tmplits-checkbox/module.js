/*
 * File: module.js
 * Copyright (c) 2023 Loupe
 * https://loupe.team
 * 
 * This file is part of tmplits, licensed under the MIT License.
 * 
 */

/*Example Checkbox usage
{{tmplit 'CheckBox' <label> side= 'middle' buttonType= 'set' data-var-name='<var>'}}
{{tmplit 'CheckBox' <label> side= 'right' buttonType= 'toggle' data-var-name='<var>'}}

Options:
buttonType='set', 'toggle' or 'momentary' Omitting this will make the checkbox non clickable will act like led.
side = 'right', 'left' or 'middle'  optional argument which defaults to ‘middle’. Determines the alignment of the label.
*/


import * as util from "../tmplits-utilities/module.js"

export function TmplitCheckBox(context, args) {
    let {
        ['data-var-name']: dataVarName,
        side = 'middle',
        buttonType = '', 
        buttonVarName = '',
        ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    classList = classList.concat(['label-led'])

    // apply the label if there is one
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

    return `
    <div class="${classList.join(' ')}" ${attr}>
    <div class='' data-var-name='${dataVarName}' ${attr}></div>
    <span class="glyphicon lux-led" data-led-true='glyphicon-check' data-led-false='glyphicon-unchecked' data-var-name='${dataVarName}' style='font-size:20px;'></span>
    ${label}
    </div>
   `
}