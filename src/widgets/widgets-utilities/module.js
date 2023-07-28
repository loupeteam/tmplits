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

'use strict';

let scope = this

export function evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function() { return eval(js); }.call(context);
}

export function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

export function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

export function dropDownSelected(el, click) {
    let item = el.closest('.dropdown-scope')
    let selection = el.textContent;
    let query = el.querySelector('.select-text')
    if( query != null){
        selection = query.textContent;
    }
    selection = selection.trim()
    let text = item.querySelectorAll('.selected-item-text:not(.noset)')
    if (text.length) {
        text.forEach(e => {
            e.innerHTML = selection
            e.value = selection;
            if (!e.options)
                e.options = {}
            e.options.selectedIndex = e.value
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            e.dispatchEvent(evt);
        });
    }

    let values = item.querySelectorAll('.selected-item-index:not(.noset)')
    if (values.length) {
        values.forEach(e => {
            e.value = el.value;
            if (!e.options)
                e.options = {}
            e.options.selectedIndex = e.value
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            e.dispatchEvent(evt);
        });
    }


    if (click) {
        try {
            evalInContext(click, el)
        } catch (e) {
            throw `error from user event: '${click}' ` + e
        }
    }
}

export function updateSelectOptions(el, index) {
    el.querySelectorAll('.option').forEach((e) => {
        let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
        e.setAttribute('onclick', click)
        e.setAttribute('data-index', index++)
    })
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//Functionality for number grid
export function numGridPopulate() {
    
    // get all grids
    const grids = document.querySelectorAll(".grid");

    // iterate over each grid
    grids.forEach( function (grid) {

        // only update if grid is visible
        if (grid.offsetWidth == 0 && grid.offsetHeight == 0 && grid.getClientRects().length == 0 ) {
            return
        }

        let $grid = $(grid)
        $grid.empty();
        let dataVarName;
        let rows;
        let cols;
        let labelRows;
        let labelCols;
        dataVarName = $grid.attr('data-var-name-num-rows')
        rows = WEBHMI.getValue($(`<div data-var-name='${dataVarName}'/>`));
        if (rows === undefined) {
            rows = 9;
        }
        dataVarName = $grid.attr('data-var-name-num-cols')
        cols = WEBHMI.getValue($(`<div data-var-name='${dataVarName}'/>`));
        if (cols === undefined) {
            cols = 9;
        }
        labelCols = $grid.attr('label-cols')
        labelRows = $grid.attr('label-rows')
        dataVarName = $grid.attr('data-var-name-data-table')
        for (let i = rows; i >= 0; i--) {
            const row = document.createElement("tr");
            // labels - these are not very modular and need some work
            if (i == 0) {
                // if (labelCols !== undefined) {
                //     // create col label
                //     const colsLabelRow = document.createElement("tr");
                //     const dummyCell = document.createElement("td");
                //     colsLabelRow.appendChild(dummyCell);
                //     const colsLabelCell = document.createElement("td");
                //     let $colsLabelCell = $(colsLabelCell);
                //     $colsLabelCell.attr('colspan', cols+1);
                //     $colsLabelCell.attr('style', 'text-align: left;');  //inline styling sorry not sorry
                //     $colsLabelCell.html(labelCols);
                //     colsLabelRow.appendChild(colsLabelCell);
                //     grid.appendChild(colsLabelRow);
                // }
                // if (labelRows !== undefined) {
                //     // create row label
                //     const rowsLabelCell = document.createElement("td");
                //     let $rowsLabelCell = $(rowsLabelCell);
                //     $rowsLabelCell.attr('rowspan', rows+1);
                //     $rowsLabelCell.attr('valign', 'top');
                //     $rowsLabelCell.html(labelRows);
                //     row.appendChild(rowsLabelCell);
                // }
            }
            for (let j = cols; j >= 0; j--) {
                const cell = document.createElement("td");
                let $cell = $(cell)
                $cell.attr('data-var-name', `${dataVarName}[${j*10 + i}]`)
                let value;
                value = WEBHMI.getValue($cell); //Math.floor(Math.random() * (-150)) // to get random number between -150 to 0
                cell.innerHTML = value;
                if (value >= -50) {
                    cell.classList.add("green");
                } else if (value >= -100) {
                    cell.classList.add("beige");
                } else {
                    cell.classList.add("red");
                }
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
    });


}

// need to cache this handle so we can do a hacky refresh - can't do it in the script
var numGridIntervalID;
export function numGrid() {

    if (numGridIntervalID) {
        clearInterval(numGridIntervalID);
    }
    
    // numGridPopulate takes ~3ms to render on a 4x4 grid
    // I think this is fine for the moment
    numGridIntervalID = setInterval(numGridPopulate, 100);
}

export function cleanArgs(args) {
    let _args = args
    let classList = []
    if (_args.class) {
        classList = classList.concat(_args.class.split(' '))
        delete _args.class
    }

    let attr = Object.keys(_args).map((v) => {
        return `${v}="${_args[v]}"`
    })
    attr = attr.join(' ');
    return {
        classList,
        attr
    }
}

export function getButtonType(type, classList) {

    //See if there is a button type
    if (type) {
        switch (type.trim().toLowerCase()) {
            case 'set':
                classList.push('webhmi-btn-set')
                classList.push('interaction')
                return true
                break;
            case 'toggle':
                classList.push('webhmi-btn-toggle')
                classList.push('webhmi-led')
                classList.push('interaction')
                return true
                break
            case 'momentary':
                classList.push('webhmi-btn-momentary')
                classList.push('webhmi-led')
                classList.push('interaction')
                return true
                break
            default:
                break;
        }
    }
    return false;
}
