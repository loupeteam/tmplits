/*
 * File: module.js
 * Copyright (c) 2023 Loupe
 * https://loupe.team
 * 
 * This file is part of tmplits, licensed under the MIT License.
 * 
 */
'use strict';

let scope = this

export function evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function () { return eval(js); }.call(context);
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
    if (query != null) {
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
        let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick')}');`
        e.setAttribute('onclick', click)
        e.setAttribute('data-index', index++)
    })
}

//Functionality for number grid
export function numGridPopulate() {

    // get all grids
    const grids = document.querySelectorAll(".grid");

    // iterate over each grid
    grids.forEach(function (grid) {

        // only update if grid is visible
        if (grid.offsetWidth == 0 && grid.offsetHeight == 0 && grid.getClientRects().length == 0) {
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
        rows = LUX.getValue($(`<div data-var-name='${dataVarName}'/>`));
        if (rows === undefined) {
            rows = 9;
        }
        dataVarName = $grid.attr('data-var-name-num-cols')
        cols = LUX.getValue($(`<div data-var-name='${dataVarName}'/>`));
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
                $cell.attr('data-var-name', `${dataVarName}[${j * 10 + i}]`)
                let value;
                value = LUX.getValue($cell); //Math.floor(Math.random() * (-150)) // to get random number between -150 to 0
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

export function attributeString(args) {
    let attr = Object.keys(args).map((v) => {
        return `${v}="${args[v]}"`
    })
    return attr.join(' ');
}

export function cleanArgs(args) {
    let _args = args
    let classList = []
    if (_args.class) {
        classList = classList.concat(_args.class.split(' '))
        delete _args.class
    }

    let attr = attributeString(_args);

    let {['attr']:luiAttr, ['classList']:luiClasses} = getLuxAttributes(args)
    return {
        classList,
        attr,
        luiAttr,
        luiClasses
    }
}

export function getButtonType(type, classList) {

    //See if there is a button type
    if (type) {
        switch (type.trim().toLowerCase()) {
            case 'set':
                classList.push('lux-btn-set')
                classList.push('interaction')
                return true
                break;
            case 'toggle':
                classList.push('lux-btn-toggle')
                classList.push('lux-led')
                classList.push('interaction')
                return true
                break
            case 'momentary':
                classList.push('lux-btn-momentary')
                classList.push('lux-led')
                classList.push('interaction')
                return true
                break
            default:
                break;
        }
    }
    return false;
}

//Work up throught the template context to get the full path of a variable
//  That has been expanded
export function getVariablePath(context, key) {
    let path = key
    if (context.key) {
        path = context.key;
        if (key != '') {
            if (context._parent.key) {
                path += '.' + key;
            }
            else {
                path += ':' + key;
            }
        }
    }

    if (context._parent) {
        path = getVariablePath(context._parent, path);
    }
    return path;
}

//Convert a context to an attribute string
export function appendContextToAttr(attr, ctx) {
    if (typeof ctx == 'string') {
        attr = attr.concat(`data-context='${ctx}'`)
    }
    else if (typeof ctx == 'object') {
        attr = attr.concat(`data-context='${JSON.stringify(ctx)}'`)
    }
    else if (typeof ctx == 'number') {
        attr = attr.concat(`data-context=${ctx}`)
    }
    return attr
}

export function evalContext(ctx) {
    let tmp = ctx
    //If the context is a string, try to parse it as json, then as javascript, then just pass it as a string
    if (typeof ctx == 'string') {
        try {
            ctx = JSON.parse(ctx)
        } catch {
            try {
                ctx = eval(ctx)
            }
            catch {
            }
            if (ctx == null) {
                console.warn('Context was not valid json or javascript')
                ctx = tmp
            }
        }
    }
    //If the context is a number, pass it as a number
    else if (typeof ctx == 'number') {
        ctx = +ctx
    }
    else {
        ctx = ' '
    }
    return ctx
}

const luiAttributes = [
    'min-user-level-show',
    'min-user-level-unlock',
    'data-machine-name',
    'data-var-name',        
    'data-var-name-hide',
    'data-var-name-lock',
    'data-led-true',
    'data-led-false',
    'data-set-value',
    'data-hide-true',
    'data-lock-true',
    'data-range',
    'data-read-group',
    'data-reset-value',
    'data-hide-set',
    'data-lock-set',
    'data-unit-factor',
    'data-unit-offset',
    'data-source-units',
    'data-display-units',
    'data-fixed',
    'data-precision',
    'data-exponent',
    'data-pad',
    'data-unit-text',
    'data-machine-value-text',
    'data-machine-value-text-option',
    'data-machine-value-dropdown',
    'data-prevent-drag',
    'data-include',
]

//This function will get all the lux attribuites so they can be applied to the proper elements
export function getLuxAttributes(args){
    
    let {
        ['class']:classList = '',
    } = args
    
    //Make a combined list of all the attributes
    let attr = Object.keys(args).filter((value)=>{return luiAttributes.includes(value)}).map((v) => { return `${v}="${args[v]}"`}).join(' ')

    //Pull out the lux classes
    classList = classList.split(' ').filter((v) => {return v.toLowerCase().startsWith('lux')})

    return {attr, classList};
}