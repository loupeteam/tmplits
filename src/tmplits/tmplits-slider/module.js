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


/* Example Slider Usage
{{tmplit 'Slider' data-var-name='<var>'}}

Options:
data-var-name: REAL (undefined if not)
min: optional argument defaults to -1
max: optional argument defaults to 1
*/

import * as util from "../tmplits-utilities/module.js"

export function TmplitSlider(context, args) {
    let {
        style = '',
            ['data-var-name']: dataVarName,
            inputStyle = '',
            screenScale = 1,
            min = -1,
            max = 1,
            direction = 0,
            ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = util.cleanArgs(_args)
    classList = classList.concat(['lui-slider-scope', 'slider'])
    inputStyle = `position:relative;width:150%;top:0%;border-style:none;background:transparent;display:none` + inputStyle
    let innerClassList = ['lui-slider-value']
    if (dataVarName) {
        innerClassList.push('lux-num-value')
    }
    let inner = '';
    if (args.children) {
        inner += 
        inner += `<invisible-input class='${innerClassList.join(' ')}' value="${context}" style='display:none' ${dataVarName?'data-var-name="' + dataVarName +'"':''} ></invisible-input>`
    } else {
        inner = `<invisible-input type='number' min='${min}' max='${max}' class='${innerClassList.join(' ')}' value="${context}" style='${inputStyle}' ${dataVarName?'data-var-name="' + dataVarName +'"':''} ></invisible-input>`
    }

    let bar = document.createElement("div");
    bar.classList.add('slider-bar');
    bar.style.position = "relative";
    bar.style.margin = "0px";
    bar.style.borderRadius = '3px'
    bar.style.zIndex = 100;
    bar.style.opacity = '75%';
    bar.style.float = 'left'
    if(direction){
        bar.style.width = "10%";
        bar.style.height = "100%";
        bar.style.marginLeft = `-10%`;
        bar.style.left = "60%";
        style = 'width:150px;height:40px;position:relative;' + style;
    }
    else{
        bar.style.width = "100%";
        bar.style.top = "40%";
        // bar.style.marginTop = `-10%`;
        bar.style.height = "10%";
        style = 'height:150px;width:40px;position:relative;' + style;
    }

    return `
    <div class="${classList.join(' ')}" direction=${direction} style='${style}' lui-slider-min=${min} lui-slider-max=${max} lui-slider-scale=${screenScale} ${attr}>
        ${bar.outerHTML}
        ${inner}
        <div style='position:absolute;'>
            ${args.children}
        </div>
    </div>
`
}