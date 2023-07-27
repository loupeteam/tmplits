'use strict';

let scope = this

function evalInContext(js, context) {
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


export class multiOptionSelector{
    static selected(el, click) {
        let index = el.getAttribute('data-index')
        let value = el.getAttribute('data-value')
        let scope = el.closest('.select-scope')
        scope.setAttribute('selectedIndex', index)

        let targets = scope.querySelectorAll('.lui-select-value')
        targets.forEach((target)=>{
            target.value = value || +index;
        })

        let selection = el.textContent;
        let query = el.querySelector('.select-text')
        if( query != null){
            selection = query.textContent;
        }
        selection = selection.trim()
    
        let text = scope.querySelectorAll('.lui-select-text:not(.noset)')
        if (text.length) {
            text.forEach(e => {
                e.innerHTML = selection
                e.value = selection
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
        multiOptionSelector.updateSelection(scope, value || +index)
    }
    static updateSelection(scope, value){
        let selection = '';
        let page =''
        let dom = ''
        let options = scope.querySelectorAll('.option')
        options.forEach((option)=>{
            let dataValue =  option.getAttribute('data-value')
            if( (dataValue == null && option.getAttribute('data-index') == Math.floor(value)) ||  dataValue == value )
            {
                option.classList.add('active')
                selection = option.textContent;
                let query = option.querySelector('.select-text')
                if( query != null){
                    selection = query.textContent;
                }   
                page = option.getAttribute('data-page')
                query = option.querySelector('[data-page]')
                if( query != null){
                    page = query.getAttribute('data-page');
                }                        

                dom = option.getAttribute('data-target-dom')
                query = option.querySelector('[data-target-dom]')
                if( query != null){
                    dom = query.getAttribute('data-target-dom');
                }                        

            }
            else{
                option.classList.remove('active')
            }
        })

        selection = selection.trim()

        let text = scope.querySelectorAll('.lui-select-text:not(.noset)')
        if (text.length) {
            text.forEach(e => {
                e.innerHTML = selection
                e.value = selection
                let evt = new Event("change", {
                    "bubbles": true,
                    "cancelable": true
                });
                e.dispatchEvent(evt);
            });
        }
        if( page != '' ){
            if(dom != ''){
                widgets.loadPage(dom, page)
            }            
            dom = scope.querySelectorAll('.lui-select-dom:not(.noset)')
            if (dom.length) {
                dom.forEach(e => {
                    widgets.loadPage(e, page)
                });
            }    
        }
    }
    static setSelected(evt) {
        let scope = evt.target.classList.contains('select-scope') ? evt.target : evt.target.closest('.select-scope')
        let valueHolder = scope.querySelector('.lui-select-value') // evt.target should be this value; for some reason, using evt.target sometimes doesn't work here.
        if (valueHolder != null) {
            multiOptionSelector.updateSelection(scope, valueHolder.getAttribute('value'))
        }
    }    
}

export class LuiSlider {
    //Handle changing the page if a tab is clicked
    static luiSlideStart(evt) {

        let scope = evt.target.classList.contains('lui-slider-scope') ? evt.target : evt.target.closest('.lui-slider-scope')
        scope.classList.add('lui-slider-active')

        let target = scope.querySelectorAll('.lui-slider-value')
        target.forEach((input)=>{
            input.classList.add('editing')
        })
        let value;
        if (target?.[0].getAttribute('data-var-name')) {
            try{
                value = WEBHMI.getValue($(target?.[0]))
            }
            catch(e){
                value = +target?.[0].value
            }
        } else {
            value = +target?.[0].value
        }

        let max = +scope.getAttribute('lui-slider-max')
        let min = +scope.getAttribute('lui-slider-min')
        value = clamp(value, min, max)
        scope.setAttribute('lui-slider-start', value)
        scope.setAttribute('lui-slider-screen-x-start', evt.screenX)
        scope.setAttribute('lui-slider-screen-y-start', evt.screenY)
    }
    //Handle changing the page if a tab is clicked
    static luiSlideEnd(selected) {
        let scope = document.querySelectorAll('.lui-slider-scope.lui-slider-active')
        scope.forEach((e) => {
            let pop = e.getAttribute('pop-position')            
            let target = e.querySelectorAll('.lui-slider-value')
            target.forEach((input)=>{
                //Pop is a bit buggy, seems like maybe a debounce issue
                if(pop){
                    input.value = pop                
                }
                input.classList.remove('editing')
            })
            e.classList.remove('lui-slider-active')
        })
    }
    //Handle changing the page if a tab is clicked
    static luiSlideChange(evt) {

        evt.preventDefault()
        let scope = document.querySelectorAll('.lui-slider-scope.lui-slider-active')

        // let scope = evt.target.classList.contains('lui-slider-scope')? evt.target : evt.target.closest('.lui-slider-scope')
        if (scope.length == 0) {
            return;
        } else if (scope.length > 1) {
            scope.forEach((e) => {
                e.classList.remove('lui-slider-active')
            })
        } else {
            scope = scope[0]
        }
        let target = scope.querySelectorAll('.lui-slider-value')
        if (target.length == 0) {
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            scope.dispatchEvent(evt);
            return
        }

        let screenScale = +scope.getAttribute('lui-slider-scale')
        let startValue = +scope.getAttribute('lui-slider-start')
        let direction = scope.getAttribute('direction') > 0
        let max = +scope.getAttribute('lui-slider-max')
        let min = +scope.getAttribute('lui-slider-min')
        let total = max - min;
        let screenStart = +(direction  ? scope.getAttribute('lui-slider-screen-x-start') : scope.getAttribute('lui-slider-screen-y-start'))
        let screenNew = +(direction ? evt.screenX : evt.screenY)
        let scrollDistance =-(direction ? -scope.clientWidth : scope.clientHeight)
        let scrollBarPercent = (((screenNew - screenStart)/(scrollDistance*0.9)) * screenScale)
        let value = startValue + scrollBarPercent*total
        value = clamp(value, min, max)

        target.forEach((e) => {
            e.value = value
            e.setAttribute('value', value)
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            try{
                e.dispatchEvent(evt);
            }catch{

            }
        })
    }
    //Handle changing the page if a tab is clicked
    static luiSlideMouse(evt) {

        let scope = evt.target.classList.contains('lui-slider-scope') ? evt.target : evt.target.closest('.lui-slider-scope')
        if( scope == null){
            return
        }
        evt.preventDefault()
        scope.classList.add('lui-slider-active')
        if (scope.length == 0) {
            return;
        } 

        let target = scope.querySelectorAll('.lui-slider-value')
        if (target.length == 0) {
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            scope.dispatchEvent(evt);
            return
        }

        let startValue = +target[0].getAttribute('value')
        let max = +scope.getAttribute('lui-slider-max')
        let min = +scope.getAttribute('lui-slider-min')
        let direction = scope.getAttribute('direction') > 0
        let scrollDistance =(direction ? scope.clientWidth : scope.clientHeight)*10
        let value = startValue + evt.deltaY/scrollDistance
        value = clamp(value, min, max)

        target.forEach((e) => {
            e.value = value
            e.classList.add('editing')
            e.setAttribute('value', value)
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            try{
                e.dispatchEvent(evt);
            }catch{

            }
        })
        let oldTimeout = scope.getAttribute('timeout')
        if(oldTimeout!=null){
            clearTimeout(oldTimeout)
        }
        let timeout = setTimeout(()=>{
            target.forEach((e) => {
                e.classList.remove('editing')
            })    
            scope.classList.remove('lui-slider-active')
            scope.removeAttribute('timeout')
        }, 500)
        scope.setAttribute('timeout', timeout)
    }

    static luiSliderSet(evt) {
        let scope = evt.target.classList.contains('lui-slider-scope') ? evt.target : evt.target.closest('.lui-slider-scope')
        LuiSlider.luiSliderUpdateSlider(scope, +evt.target.getAttribute('value'))
    }
    static luiSliderUpdateSlider(scope, value) {

        let direction = scope.getAttribute('direction') > 0
        let sliderBar = scope.querySelectorAll('.slider-bar')
        let max = +scope.getAttribute('lui-slider-max')
        let min = +scope.getAttribute('lui-slider-min')
        value = clamp(value, min, max)
        let total = max - min;
        let percent = ((max - value) / total) * 90 //90 keeps the bar from going past the bottom

        sliderBar.forEach((e) => {
            if(direction){
                e.style.left = (100 - percent) + '%';
            }
            else{
                e.style.top = (percent) + '%';
            }
        })
        return value
    }

}

export class luiDirectory{
    static updateDirectory(evt){
        try{
            var data = JSON.parse( evt.currentTarget.value )
        }
        catch{
            return
        }
        if( typeof data.files == 'undefined'){
            return
        }

        let scope = evt.currentTarget.closest('.select-scope')
        let target = scope.querySelectorAll('.dropdown-menu,.list-view')
        
        let table = ''
        table += '<table class="table filter-table">'
        table += '<tbody>'
 
        let folders = data.files.filter( e => e.name.slice(-1) == '/' )
        let files = data.files.filter( e => e.name.slice(-1) != '/' )
 
        folders.forEach((file)=>{
            table += `<tr class='option' onclick="luiDirectory.fileSelect(this)"><td class='select-text'>${file.name}</td><td>${file.date}</td><td>${file.size}</td></tr>`
        })
        files.forEach((file)=>{
            table += `<tr class='option' onclick="luiDirectory.fileSelect(this)"><td class='select-text'>${file.name}</td><td>${file.date}</td><td>${file.size}</td></tr>`
        })
        table += '</tbody>'
        table += '</table>'        

        let tableEl = htmlToElement(table)
        document.addEventListener('keydown', ( e )=>{
            luiDirectory.filter(tableEl, e.key)
        })
        target.forEach(element => {
            element.replaceChildren(tableEl)
            updateSelectOptions(element)
        });

    }
    static fileSelect(el){
        let item = el.closest('.select-scope')
        let selection = el.textContent;
        let query = el.querySelector('.select-text')
        if( query != null){
            selection = query.textContent;
        }
        selection = selection.trim()
        let text = item.querySelector('.lui-select-text')
        if (text != null) {
            let cleanPath = []
            let path = text.value.split("/")
            path = path.filter((e, i,arr)=>{return ((e != '') || (i == (arr.length-1)))})
            path.pop()
            path = path.concat( selection.split("/") )
            path.forEach((el, i)=>{
                if( (el == '.' || el == ' ' )){
                    if( i == 0 ){
                        cleanPath.push('.')
                    }
                }
                else if( el == '..'){
                    cleanPath.pop()
                }
                else{
                    if(cleanPath.length==0){
                        cleanPath.push('.')
                    }
                    cleanPath.push(el)
                }
            })
            if(cleanPath.length == 1){
                cleanPath.push('')
            }
            text.innerHTML = cleanPath.join("/")            
            text.value = cleanPath.join("/")            
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            text.dispatchEvent(evt);
        }    
    }
    static filter(e, key){
        let filter = e.getAttribute('filter') || ''

        switch(key.toLowerCase()){
            case 'backspace':
                filter = filter.slice(0, -1);
            break;
            case 'escape':
                filter = ''
            break;
            default:
                if(key.length == 1){
                    filter += key                    
                }
            break
        }
        e.setAttribute('filter', filter)
        for( let row of e.rows){
            if( row.textContent.toLowerCase().includes(filter) ){
                row.style.display = ''
            }
            else{
                row.style.display = 'none'
            }
        } 
        if (e.nextSibling) {
            e.nextSibling.innerHTML = filter
        } else {
            let el = document.createElement('div')
            el.innerHTML = filter
            el.classList.add('form-control')
            e.parentNode.appendChild(el);
        }
    }
}

$(document).on({
    "change": multiOptionSelector.setSelected,
}, '.lui-select-value');

$(document).on({
    "mousedown": LuiSlider.luiSlideStart
}, '.lui-slider-scope');
$(document).on({
    "touchstart": LuiSlider.luiSlideStart
}, '.lui-slider-scope');

$(document).on({
    "change": LuiSlider.luiSliderSet,
}, '.lui-slider-value');

$(document).on({
    "click": selectTab
}, '.nav-tabs-item');

$(document).on({
    "click": selectPage
}, '[data-page]');


$(document).on({
    "change": luiDirectory.updateDirectory,
}, '.lui-directory-data');


$(document).on({
    "mousemove": LuiSlider.luiSlideChange
});
$(document).on({
    "touchmove": LuiSlider.luiSlideChange
});
window.addEventListener("wheel", LuiSlider.luiSlideMouse, { passive:false })

$(document).on({
    "mouseup": LuiSlider.luiSlideEnd
});
$(document).on({
    "touchend": LuiSlider.luiSlideEnd
});

$(document).on({
    "click": luiIncrementValue
}, '.lui-increment');

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

//Handle changing the page if a tab is clicked
function luiIncrementValue(selected) {

    let scope = selected.target.closest('.lui-increment-scope')
    let target = scope.querySelectorAll('.lui-increment-value')
    if (target.length == 0) {
        let evt = new Event("change", {
            "bubbles": true,
            "cancelable": true
        });
        scope.dispatchEvent(evt);
        return
    }
    let value;
    if (target?.[0].getAttribute('data-var-name')) {
        value = WEBHMI.getValue($(target?.[0]))
    } else {
        value = +target?.[0].value
    }

    let increment = +selected.currentTarget.getAttribute('increment');
    target.forEach((e) => {
        e.value = value + increment
        let evt = new Event("change", {
            "bubbles": true,
            "cancelable": true
        });
        e.dispatchEvent(evt);
    })
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//Handle setting active if a tab is clicked
function selectTab(selected) {
    selected = $(selected.currentTarget)
    let tabs = selected.closest('.nav-tabs').children('.nav-tabs-item')
    tabs.removeClass('active')
    selected.addClass('active')
}

//Handle changing the page if a tab is clicked
function selectPage(selected) {
    selected = $(selected.currentTarget)
    let page = selected.attr('data-page')
    let dom = selected.attr('data-target-dom')
    if(dom && page){
        widgets.loadPage(dom, page)
    }
}

//Functionality for number grid
function numGridPopulate() {
    
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
function numGrid() {

    if (numGridIntervalID) {
        clearInterval(numGridIntervalID);
    }
    
    // numGridPopulate takes ~3ms to render on a 4x4 grid
    // I think this is fine for the moment
    numGridIntervalID = setInterval(numGridPopulate, 100);
}

/*
let css =
`.error {
        border-color: red;
        border-style: solid;
        width: fit-content;
        margin: -1px
    }

    .error .error {
        margin: -2px 0px 5px 0px;
        border-width: 5px
    }

    .form-control.label-led {
        display: inline-flex;
        align-items: center;
    }

    .form-control.label-led .led {
        margin: 20px;
    }
    .label-led h1, 
    .label-led h2,
    .label-led h3,
    .label-led h4,
    .label-led h5,
    .label-led h6 {
        margin : auto;
    }     
    .lui-grid { margin: 5px; } 
    .lui-grid .lui-grid { margin: 0px; } 
    .lui-grid-labeled{border-style: solid;border-radius: 5px;border-width: 2px; } 
    .lui-grid-heading{font-size: 20px;font-weight: bolder;}
    
    .container ::-webkit-scrollbar {
        width: 0.5em;
        height: 0.5em;
    }
     
    .container ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }
     
    .container ::-webkit-scrollbar-thumb {
      background-color: darkgrey;
      outline: 1px solid slategrey;
      border-radius:10px;      
    }    
`
fetch('library/widgets/widgets.css').then((css)=>{
    let head = document.head || document.getElementsByTagName('head')[0]
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);    
})
*/