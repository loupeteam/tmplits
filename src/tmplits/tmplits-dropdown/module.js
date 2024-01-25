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
Create a dropdown and field
The user supplies the drop down and marks the option with an option class

For a custom form you must have at least one item with class="selected-item-text" 
or we will assume one for you..




<button><-----------------field---------->
<dropdown>
    USER DROPDOWN
    <el class='option'> -> will be set to field
</dropdown>

Example drop down usage:
{{#tmplit 'dropdown' [set=false/true]}}
    <field>
        <input placeholder="Select Operation" class='lux-dropdown'/>        
    </field>
    <dropdown>
       <div></div>         
       <div class="option"></div>         
       <div></div>         
       <div class="option"></div>         
    <dropdown>
{{/tmplit}}

Options:
Set=false to disable setting the field to the selection

*/

import * as util from "../tmplits-utilities/module.js"

class dropDown extends HTMLElement {
    noChange=false;
	constructor() { // called when obj created
		super()

        let trimmed = this.innerHTML.trim()

        let field = ''
        let index = 0
        let dropdownPanel = 'missing &lt;dropdown&gt;'
        let children = ''
        let nodes = util.htmlToElements(trimmed)
    
        for( let i in nodes){
            let el = nodes[i]        
    
            switch (el.tagName) {
            case 'FIELD':
                el.childNodes.forEach((e) => {
                    if (e.classList) {
                        e.classList.add('form-control')
    
                        if (set && e.querySelectorAll(".lui-select-text").length == 0) {
                            e.classList.add('lui-select-text')
                        }
                        field += e.outerHTML
                    }
                })
            break
            case 'DROPDOWN':
                index = util.updateSelectOptions(el, index)
                dropdownPanel = el.innerHTML
            break;
            case undefined:
    
            break;
            default:
                children += el.outerHTML? el.outerHTML: el.textContent
            break;
            }
        }

        let set = true;
        let style = '';
        let willOpen;
        let dataVarName;
        let willOpenPV;
        let dataVarNameField;

        if (field == '') {
             field = `<input ${dataVarNameField ? 'data-var-name="' + dataVarNameField + '"' : '' } class='tmplit-dropdown-field lui-select-text${dataVarNameField ? ' lux-text-value' : ''}'>`
        }
        if( dataVarName ){
            field += `<invisible-input class='lux-num-value lui-select-value' style='display:none' data-var-name='${dataVarName}' ></invisible-input>`
        }
 
        this.innerHTML = `
            <div class='select-scope'>    
                <div class='tmplit-dropdown-container'>
                    <div class="input-group-btn">
                       
                    </div>
                    ${field}
                </div>
                ${children}
            </div>    
            `
        let inputgroup = this.querySelector('.input-group-btn');

        let button = document.createElement(`button`);
        button.classList.add('tmplit-dropdown-button');
        button.classList.add('material-symbols-outlined');
        button.innerHTML = 'expand_more';
        button.addEventListener('click', this.dropDownClicked.bind(this));
        inputgroup.appendChild(button);

        let selectscope = this.querySelector('.select-scope');

        let dropdownelement = document.createElement(`div`); // calls the constructor
        dropdownelement.classList.add('tmplit-dropdown-options');
        dropdownelement.classList.add('hidden');
        dropdownelement.innerHTML = dropdownPanel;
        selectscope.appendChild(dropdownelement);

        dropdownelement.addEventListener('click', ()=>{this.setAttribute('value',i)})
    }
    static get observedAttributes() {
        return ['value']
    }
    attributeChangedCallback(name, oldValue, newValue) {

    }
	connectedCallback() { // called when added to dom
        
    }
	disconnectedCallback() { // called when removed from dom
        window.removeEventListener('resize', this.updateGlider)

	}
    dropDownClicked() { // called when removed from dom
        this.querySelector('.tmplit-dropdown-options').classList.toggle('hidden');
	}
    get value(){
        return this.getAttribute('value');
    }
    set value(val){
        this.noChange = true;
        this.setAttribute('value', val)
        this.noChange = false;
    }
}
//Register the webcomponent
customElements.define('lui-dropdown', dropDown)

export function TmplitDropdown(context, args) {
    //Pull out any attributes we need
    let {
        set = true, style = '', 
        willOpen,
        ['data-var-name']:dataVarName,
        ['data-var-name-willopen'] : willOpenPV,
        ['data-var-name-field'] : dataVarNameField,
        ..._args
    } = args.hash

    style = 'margin:auto;' + style;

    //Get cleaned values
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    classList = classList.concat(['input-group'])

    return `
    <lui-dropdown ${attr} class='${classList.join(' ')}'>${args.children}</lui-dropdown>
    `
}