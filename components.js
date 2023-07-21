'use strict';

let scope = this

function evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function() { return eval(js); }.call(context);
}

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function cleanArgs(args) {
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


class multiOptionSelector{
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

class LuiSlider {
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

class luiDirectory{
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

function getButtonType(type, classList) {

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
/*Example Button usage
{{#widget 'button' style="color:red" }}
    My Button
{{/widget}}
{{widget 'button' class="led-on" style="color:blue" children="Thank you" }}
*/
function WidgetButton(context, args) {

    let {
        buttonType = '', ..._args
    } = args.hash

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(_args)

    //Add class items from this component
    classList = classList.concat(['btn'])

    //If there are no children, the first item in the context is the label
    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }

    getButtonType(context[1], classList)
    getButtonType(buttonType, classList)

    return `<button type='button' class="${classList.join(" ")}"  ${attr}> ${args.children ? args.children : 'Label'} </button>`
}

function dropDownSelected(el, click) {
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
/*
Create a dropdown and field
The dropdown is a table where each row is defined by an 'option'
Several options can be given at once with 'options' and each node will be considered an optino

Options:
Set=false to disable setting the field to the selection

<button><-----------------field---------->
<table>
    <tbody>
        <tr><td>[Option]</td><tr/>
        <tr><td>[Option]</td><tr/>
        <tr><td>[Option]</td><tr/>    
    <tbody>
</table>

Example drop down usage:
    {{#widget 'dropdown' [set=false/true] }}
    <field>
        <input placeholder="Select Operation" class='webhmi-dropdown'/>        
    </field>
    <options>
        {{#repeat 5}}
        <div>Operation {{@index}}</div>
        {{/repeat}}
    </options>
    <option>Extra Option</option>
    {{/widget}}
*/
function WidgetDropdownTable(context, args) {

    let {
        set = true, 
        style = '', 
        ['data-var-name']:dataVarName,
        ['data-var-name-field'] : dataVarNameField,
        ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group'])

    let trimmed = args.children.trim()
    let field = ''
    let options = ''
    let index = 0
    let children = ''

    let nodes = htmlToElements(trimmed)

    for( let i in nodes){
        let el = nodes[i]        
        switch (el.tagName) {
            case 'FIELD':
                el.childNodes.forEach((e) => {
                    if (e.classList) {
                        e.classList.add('form-control')
                        if (set) {
                            e.classList.add('selected-item-text')
                        }
                        field += e.outerHTML
                    }
                })                    
                break;
            case 'OPTION':
                let e = el
                let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                e = htmlToElement(`<tr><td> ${e.innerHTML} </td></tr>`)
                for( let i = 0; i < el.attributes.length; i++){
                    let elAttr = el.attributes[i].name
                    if( typeof elAttr == 'string' ){
                        e.setAttribute( elAttr, el.getAttribute(elAttr));
                    }
                }
                e.setAttribute('onclick', click)
                e.setAttribute('data-index', index++)
                e.classList.add('option')
                options += e.outerHTML    
                break;
            case 'OPTIONS':
                el.childNodes.forEach((e) => {
                    if (e.getAttribute) {
                        let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                        e = htmlToElement(`<tr><td> ${e.outerHTML} </td></tr>`)
                        e.setAttribute('onclick', click)
                        e.setAttribute('data-index', index++)
                        e.classList.add('option')
                        options += e.outerHTML
                    }
                })    
            break;
            case undefined:

            break
            default:
                children += el.outerHTML? el.outerHTML: el.textContent
                break;
        }
    }
    
    if( field == '') {
        field = `<input ${dataVarNameField ? 'data-var-name="' + dataVarNameField + '"' : '' } class='form-control${set ?"":' noset'} lui-select-text${dataVarNameField ? ' webhmi-text-value' : ''}'>`
    }
    if( dataVarName ){
        field += `<invisible-input class='webhmi-num-value lui-select-value' style='display:none' data-var-name='${dataVarName}' ></invisible-input>`
    }

    let delegate = args.delegate ? `onclick="${args.delegate}?.willOpen?.()"` : ''
    return `
<div class='select-scope'>
    <div class="${classList.join(' ')}" style="${style}" >
        <div class="input-group-btn">
            <button type="button" 
            ${delegate}
            class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
            </button>
            <div class="dropdown-menu" >
                <table class="table">
                    <tbody>
                    ${options}
                    </tbody>
                </table>            
            </div>
        </div>
        ${field}
    </div>
    ${children}
</div>
`
}

function WidgetDropdownTableText(context, args) {

    let {
        set = true, 
        style = '', 
        ['data-var-name']:dataVarName,
        ['data-var-name-field'] : dataVarNameField,
        ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group'])

    let trimmed = args.children.trim()
    let field = ''
    let options = ''
    let index = 0
    let children = ''

    let nodes = htmlToElements(trimmed)

    for( let i in nodes){
        let el = nodes[i]        
        switch (el.tagName) {
            case 'FIELD':
                el.childNodes.forEach((e) => {
                    if (e.classList) {
                        e.classList.add('form-control')
                        if (set) {
                            e.classList.add('selected-item-text')
                        }
                        field += e.outerHTML
                    }
                })                    
                break;
            case 'OPTION':
                let e = el
                let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                e = htmlToElement(`<tr><td> ${e.innerHTML} </td></tr>`)
                for( let i = 0; i < el.attributes.length; i++){
                    let elAttr = el.attributes[i].name
                    if( typeof elAttr == 'string' ){
                        e.setAttribute( elAttr, el.getAttribute(elAttr));
                    }
                }
                e.setAttribute('onclick', click)
                e.setAttribute('data-index', index++)
                e.classList.add('option')
                options += e.outerHTML    
                break;
            case 'OPTIONS':
                el.childNodes.forEach((e) => {
                    if (e.getAttribute) {
                        let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                        e = htmlToElement(`<tr><td> ${e.outerHTML} </td></tr>`)
                        e.setAttribute('onclick', click)
                        e.setAttribute('data-index', index++)
                        e.classList.add('option')
                        options += e.outerHTML
                    }
                })    
            break;
            case undefined:

            break
            default:
                children += el.outerHTML? el.outerHTML: el.textContent
                break;
        }
    }
    
    if( field == '') {
        field = `<input ${dataVarNameField ? 'data-var-name="' + dataVarNameField + '"' : '' } class='form-control${set ?"":' noset'} lui-select-text${dataVarNameField ? ' webhmi-text-value' : ''}'>`
    }
    if( dataVarName ){
        field += `<invisible-input class='webhmi-text-value lui-select-value' style='display:none' data-var-name='${dataVarName}' ></invisible-input>`
    }

    let delegate = args.delegate ? `onclick="${args.delegate}?.willOpen?.()"` : ''
    return `
<div class='select-scope'>
    <div class="${classList.join(' ')}" style="${style}" >
        <div class="input-group-btn">
            <button type="button" 
            ${delegate}
            class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
            </button>
            <div class="dropdown-menu" >
                <table class="table">
                    <tbody>
                    ${options}
                    </tbody>
                </table>            
            </div>
        </div>
        ${field}
    </div>
    ${children}
</div>
`
}

function updateSelectOptions(el, index) {
    el.querySelectorAll('.option').forEach((e) => {
        let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
        e.setAttribute('onclick', click)
        e.setAttribute('data-index', index++)
    })
}

/*
Create a dropdown and field
The user supplies the drop down and marks the option with an option class

For a custom form you must have at least one item with class="selected-item-text" 
or we will assume one for you..

Options:
Set=false to disable setting the field to the selection


<button><-----------------field---------->
<dropdown>
    USER DROPDOWN
    <el class='option'> -> will be set to field
</dropdown>

Example drop down usage:
    {{#widget 'dropdown' [set=false/true]}}
    <field>
        <input placeholder="Select Operation" class='webhmi-dropdown'/>        
    </field>
    <dropdown>
       <div></div>         
       <div class="option"></div>         
       <div></div>         
       <div class="option"></div>         
    <dropdown>
    {{/widget}}
*/
function WidgetDropdown(context, args) {

    let {
        set = true, style = '', 
        willOpen,
        ['data-var-name']:dataVarName,
        ['data-var-name-willopen'] : willOpenPV,
        ['data-var-name-field'] : dataVarNameField,
        ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group'])

    let trimmed = args.children.trim()

    let field = ''
    let index = 0
    let dropdown = 'missing &lt;dropdown&gt;'
    let children = ''
    let nodes = htmlToElements(trimmed)

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
            index = updateSelectOptions(el, index)
            dropdown = el.innerHTML
        break;
        case undefined:

        break;
        default:
            children += el.outerHTML? el.outerHTML: el.textContent
        break;
        }
    }
    if (field == '') {
        field = `<input ${dataVarNameField ? 'data-var-name="' + dataVarNameField + '"' : '' } class='form-control${set ?"":' noset'} lui-select-text${dataVarNameField ? ' webhmi-text-value' : ''}'>`
    }
    if( dataVarName ){
        field += `<invisible-input class='webhmi-num-value lui-select-value' style='display:none' data-var-name='${dataVarName}' ></invisible-input>`
    }
    let delegate = args.delegate ? `onclick="${args.delegate}?.willOpen?.();"` : ''

    let willOpenButton  = 'onclick="'
    if( args.delegate ){
        willOpenButton += `args.delegate?.willOpen?.();`;
    }
    if( willOpen ){
        willOpenButton = `evalInContext(${willOpen})`
    }
    willOpenButton += '"'
    return `
<div class='select-scope'>    
    <div class="${classList.join(' ')}" style="${style}" >
        <div class="input-group-btn">
            <button type="button" 
            ${willOpenButton}
            class="btn dropdown-toggle${willOpenPV ? " webhmi-btn-set" : ''}" ${willOpenPV ? "data-var-name='" + willOpenPV +"'" : ''} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
            </button>
            <div class="dropdown-menu" >
                ${dropdown}
            </div>
        </div>
        ${field}
    </div>
    ${children}
</div>    
`
}

function WidgetTableSelect(context, args) {

    let {
        set = true, style = '', 
        willOpen,
        ['data-var-name']:dataVarName,
        ['data-var-name-willopen'] : willOpenPV,
        ['data-var-name-field'] : dataVarNameField,
        ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group'])

    let trimmed = args.children.trim()

    let field = ''
    let index = 0
    let dropdown = 'missing &lt;dropdown&gt;'
    let children = ''
    let nodes = htmlToElements(trimmed)

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
            index = updateSelectOptions(el, index)
            dropdown = el.innerHTML
        break;
        case undefined:

        break;
        default:
            children += el.outerHTML? el.outerHTML: el.textContent
        break;
        }
    }
    if (field == '') {
        field = `<input ${dataVarNameField ? 'data-var-name="' + dataVarNameField + '"' : '' } class='${set ?"":' noset'} lui-select-text${dataVarNameField ? ' webhmi-text-value' : ''} list-viewer-selected-file-name'>`
    }
    if( dataVarName ){
        field += `<invisible-input class='webhmi-num-value lui-select-value list-viewer-selected-file-name' style='display:none' data-var-name='${dataVarName}' ></invisible-input>`
    }
    let delegate = args.delegate ? `onclick="${args.delegate}?.willOpen?.();"` : ''

    let willOpenButton  = 'onclick="'
    if( args.delegate ){
        willOpenButton += `args.delegate?.willOpen?.();`;
    }
    if( willOpen ){
        willOpenButton = `evalInContext(${willOpen})`
    }
    willOpenButton += '"'
    return `
<div class='select-scope size-fill-parent'>    
    <div class="${classList.join(' ')} size-fill-parent" style="${style}" >
    <div style="overflow:auto;" class="list-view list-viewer-window">    
        ${dropdown}
    </div>
        <div class="input-group size-fill-parent">
            ${field} 
            <button type="button" 
                ${willOpenButton}
                class="input-group-addon dropdown-toggle${willOpenPV ? " webhmi-btn-set" : ''} list-viewer-refresh-button" ${willOpenPV ? "data-var-name='" + willOpenPV +"'" : ''} data-toggle="dropdown" aria-hidden="true">
                <span class="glyphicon glyphicon-refresh"></span>
            </button>
        </div>
    </div>
    ${children}
</div>    
`
}

function WidgetMultiSelect(context, args) {

    let {        
        ['data-var-name']:dataVarName,
        style = '', ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group', 'select-scope'])

    let trimmed = args.children.trim()
    let options = ''
    let index = 0


    let nodes = htmlToElements(trimmed)
    for( let i in nodes){
        let el = nodes[i]
        if (el.tagName == 'OPTION') {
            let e = el
            let dataValue = e.getAttribute('data-value')
            let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`

            e = htmlToElement(`<div class="option"> ${e.innerHTML} </div>`)
            if( dataValue != null ){
                e.setAttribute('data-value', dataValue)            
            }
            e.setAttribute('onclick', click)            
            e.setAttribute('data-index', index)
            index++
            options += e.outerHTML
        }
        if (el.tagName == 'OPTIONS') {
            el.childNodes.forEach((e) => {
                if (e.getAttribute) {
                    let dataValue = e.getAttribute('data-value')
                    let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                    e = htmlToElement(`<div class="option"> ${e.outerHTML} </div>`)
                    if( dataValue != null){
                        e.setAttribute('data-value', dataValue)            
                    }
                    e.setAttribute('onclick', click)
                    e.setAttribute('data-index', index)
                    index++
                    options += e.outerHTML
                }
            })
        }
    }

    options += `<invisible-input class="lui-select-value webhmi-num-value" style="display:none" value="${context}" ${dataVarName?'data-var-name="' + dataVarName +'"':''} ></invisible-input>`

    args.children = options
    let inner = WidgetColumns( context, args)
    return `
<div class="${classList.join(' ')}">${inner}</div>    
    ` 
}

function WidgetMultiSelectText(context, args) {

    let {        
        ['data-var-name']:dataVarName,
        style = '', ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group', 'select-scope'])

    let trimmed = args.children.trim()
    let options = ''
    let index = 0


    let nodes = htmlToElements(trimmed)
    for( let i in nodes){
        let el = nodes[i]
        if (el.tagName == 'OPTION') {
            let e = el
            let dataValue = e.getAttribute('data-value')
            let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`

            e = htmlToElement(`<div class="option"> ${e.innerHTML} </div>`)
            if( dataValue != null ){
                e.setAttribute('data-value', dataValue)            
            }
            e.setAttribute('onclick', click)            
            e.setAttribute('data-index', index)
            index++
            options += e.outerHTML
        }
        if (el.tagName == 'OPTIONS') {
            el.childNodes.forEach((e) => {
                if (e.getAttribute) {
                    let dataValue = e.getAttribute('data-value')
                    let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                    e = htmlToElement(`<div class="option"> ${e.outerHTML} </div>`)
                    if( dataValue != null){
                        e.setAttribute('data-value', dataValue)            
                    }
                    e.setAttribute('onclick', click)
                    e.setAttribute('data-index', index)
                    index++
                    options += e.outerHTML
                }
            })
        }
    }

    options += `<invisible-input class="lui-select-value webhmi-text-value" style="display:none" value="${context}" ${dataVarName?'data-var-name="' + dataVarName +'"':''} ></invisible-input>`

    args.children = options
    let inner = WidgetColumns( context, args)
    return `
<div class="${classList.join(' ')}">${inner}</div>    
    ` 
}

function WidgetLabeledLed(context, args) {
    let {
        side = 'middle', ['data-var-name']: dataVarName, buttonType = '', buttonVarName = '', error=false, warning=false, ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['input-group', 'form-control', 'label-led' ])

    if (args.children == "" && context[0]) {
        args.children = `<h3>${context[0]}</h3><h3/>`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    let labelStyle = ''
    switch (side.trim().toLowerCase()) {
        case 'middle':
            labelStyle += 'margin-right: auto; margin-left: auto;'
            break;
        case 'right':
            labelStyle += 'margin-left: auto;'
            break
    }

    if (getButtonType(buttonType, classList)) {
        if (buttonVarName == '') {
            buttonVarName = dataVarName
            classList.splice(classList.findIndex((e) => {
                return e == 'webhmi-led'
            }),1)
        }
        attr += `data-var-name='${buttonVarName}'`
    }


    return `
    <div class="${classList.join(' ')}" ${attr}>
    <div class='led webhmi-led' data-led-false='led-off' data-led-true='${error ? 'led-red': (warning ? 'led-yellow':'led-green') }' data-var-name='${dataVarName}' ${attr}></div>
    <div class='led-label' style='${labelStyle}' >${finalResult}</div>
    </div>
   `
}

function WidgetLed(context, args) {
    let {
        ['data-var-name']: dataVarName, buttonType = '', buttonVarName = '', error=false, warning=false, ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['label-led'])

    if (args.children == "" && context[0]) {
        args.children = `<h3>${context[0]}</h3><h3/>`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    if (getButtonType(buttonType, classList)) {
        if (buttonVarName == '') {
            buttonVarName = dataVarName
            classList.splice(classList.findIndex((e) => {
                return e == 'webhmi-led'
            }),1)
        }
        attr += `data-var-name='${buttonVarName}'`
    }
    return `
    <div class="${classList.join(' ')}" ${attr}>
    <div class='led webhmi-led' data-led-false='led-off' data-led-true='${error ? 'led-red': (warning ? 'led-yellow':'led-green') }' data-var-name='${dataVarName}' ${attr}></div>
    </div>
   `
}

function WidgetCheckBox(context, args) {
    let {
        ['data-var-name']: dataVarName, buttonType = '', buttonVarName = '', ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['label-led'])

    if (args.children == "" && context[0]) {
        args.children = `<h3>${context[0]}</h3><h3/>`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    if (getButtonType(buttonType, classList)) {
        if (buttonVarName == '') {
            buttonVarName = dataVarName
            classList.splice(classList.findIndex((e) => {
                return e == 'webhmi-led'
            }),1)
        }
        attr += `data-var-name='${buttonVarName}'`
    }
    return `
    <div class="${classList.join(' ')}" ${attr}>
    <div class='led webhmi-led' data-led-false='led-off' data-led-true='led-green' data-var-name='${dataVarName}' ${attr}></div>
    </div>
   `
}

function WidgetNumericInput(context, args) {

    let {
        ['data-var-name']: dataVarName, ..._args
    } = args.hash

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['input-group'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return `
    <div class="${classList.join(' ')}">
    <input class='form-control webhmi-num-value' ${dataVarName ? 'data-var-name="' + dataVarName + '"' : '' } ${attr}/>
    </div>
   `
}
function WidgetNumericOutput(context, args) {

    let {
        ['data-var-name']: dataVarName, ..._args
    } = args.hash

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['input-group'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return `
    <div class="${classList.join(' ')}">
    <div class='form-control webhmi-num-value' ${dataVarName ? 'data-var-name="' + dataVarName + '"' : '' } ${attr}></div>
    </div>
   `
}

function WidgetLabeledNumericInput(context, args) {

    let {
        ['data-var-name']: dataVarName, ..._args
    } = args.hash

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['input-group'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([a-z][A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return `
    <div class="${classList.join(' ')}" ${attr} >
    <input class='form-control webhmi-num-value' ${dataVarName ? 'data-var-name="' + dataVarName + '"' : '' } ${attr}/>
    <span class='input-group-addon'>${finalResult}</span>
    </div>
   `
}
function WidgetLabeledNumericOutput(context, args) {

    let {
        ['data-var-name']: dataVarName, ..._args
    } = args.hash

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(_args)

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


function WidgetLabeledTextInput(context, args) {

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)

    classList = classList.concat(['input-group'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return `
    <div class="${classList.join(' ')}" ${attr} >
    <input class='form-control webhmi-text-value' ${attr}/>
    <span class='input-group-addon'>${finalResult}</span>
    </div>
   `
}
function WidgetLabeledTextOutput(context, args) {

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)

    classList = classList.concat(['input-group'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return `
    <div class="${classList.join(' ')}" ${attr} >
    <span class='input-group-addon'>${finalResult}</span>
    <div class='form-control webhmi-text-value' ${attr}></div>
    </div>
   `
}
function WidgetTextOutput(context, args) {

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)

    classList = classList.concat(['input-group'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return `
    <div class="${classList.join(' ')}" ${attr} >
    <div class='form-control webhmi-text-value' ${attr}></div>
    </div>
   `
}

function WidgetLabeledList(context, args) {
    let {
        style = '', ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['lui-grid'])

    return `
    <div class="row">
        <div class="col-sm-12">
            ${args.children}
        </div>
    </div> `
}

function WidgetColumnsBs(context, args) {

    let {
        style = '', maxColumns = 3, ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)

    let nodes = htmlToElements(args.children)
    let count = 0
    for( let e in nodes){
        let el = nodes[e]        
        switch (el.tagName) {
        case undefined:
        break
        default:
            count++
        }
    }

    maxColumns = maxColumns > 12 ? 12 : maxColumns
    let columns = count > maxColumns ? maxColumns : count
    let columnSize = Math.floor(12 / columns)
    let rows = Math.ceil(count / columns)
    classList.push(`col-sm-${columnSize}`)

    let children = ''
    let i=0;
    for( let e in nodes){
        let el = nodes[e]        
        switch (el.tagName) {
        case undefined:
            break
        default:
            if (i % columns == 0) {
                children += `<div class="row">`
            }
            children += `<div class="${classList.join(' ')}" style='${style}'>${el.outerHTML}</div>`
            if (i % columns == (columns - 1)) {
                children += `</div>`
            }
            i++;
        break;
        }
    }
    return `${children}`
}

function WidgetColumns(context, args) {

    let {
        style = '', centerItems, maxColumns = 3, columnFlow = 0, ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['lui-grid'])

    //Read the nodes and clean them up to figure out how many columns/rows

    let nodes = htmlToElements(args.children)

    let count = 0;
    let children = ''

    for( let i in nodes){
        let el = nodes[i]
        switch (el.tagName) {
            case undefined:
                break
            default:
            children += `${el.outerHTML}`
            count++;
        }
    }

    let columns = count > maxColumns ? maxColumns : count
    let rows = Math.floor(count / columns)

    //Generate the style
    style += `;display:grid; grid-gap:5px;`
    style += `grid-auto-rows: max-content;`
    if (centerItems) {
        style += `align-items:center;justify-items:center;`
    }
    //Setup columns and rows based on the flow direction
    style += `${ columnFlow > 0 ? `grid-template: repeat(${rows},1fr) / repeat(${columns},1fr); grid-auto-flow : column;` : `grid-template-columns : repeat(${columns},1fr);`}`
    return `
    <div ${attr} class='${classList.join(' ')}' style="${style}">
        ${children}
    </div>
   `
}

function WidgetLabeledColumns(context, args) {
    //Pull out any attributes we need
    let {
        style = '', centerItems, maxColumns = 3, columnFlow = 0, ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)

    //Add our classes
    classList = classList.concat(['lui-grid', 'lui-grid-labeled'])

    //Get the header
    let header = context?.[0] || ' '

    //Read the nodes and clean them up to figure out how many columns/rows
    let nodes = htmlToElements(args.children)
    let children = ''
    let count = 0
    for( let i in nodes){
        let el = nodes[i]
        switch (el.tagName) {
            case undefined:
                break
            default:
            children += el.outerHTML        
            count++;
        }
    }
    let columns = count > maxColumns ? maxColumns : count
    let rows = Math.floor(count / columns)

    //Generate the style
    style += `;display:grid; grid-gap:5px;`
    style += `grid-auto-rows: max-content;`
    if (centerItems) {
        style += `align-items:center;justify-items:center;`
    }
    //Setup columns and rows based on the flow direction
    style += `${ columnFlow > 0 ? `grid-template: repeat(${rows},1fr) / repeat(${columns},1fr); grid-auto-flow : column;` : `grid-template-columns : repeat(${columns},1fr);`}`
    //This ensures the size is the same but there is a small gap for the border
    // style += `padding: 2px; margin: -2px;`

    return `
    <div ${attr} class='${classList.join(' ')}' style="${style};">
        <div class='lui-grid-heading' style="grid-column: span ${columns}; margin: auto;">${header}</div>
        ${children}
    </div>
   `
}

function WidgetPageSelect(context, args) {
    let {
        active,
        template,
        dom,
        ..._args
    } = args.hash
    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)
    classList = classList.concat(['nav-tabs-item'])
    if (active) {
        classList = classList.concat(['active'])
    }
    return `
<li class="${classList.join(' ')}" >
    <a data-page='${template}' data-target-dom='${dom}' ${attr}>${context[0]}</a>
</li>
`
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

function WidgetValueUpDown(context, args) {
    let {
        style = '',
            ['data-var-name']: dataVarName,
            increment = 1,
            buttonStyle = '',
            inputStyle = '',
            ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)
    classList = classList.concat(['lui-increment-scope'])
    style = 'display:inline-flex; grid-template-columns: auto 1fr auto; border-style:solid; border-radius: 40px;width:fit-content;height:fit-content;' + style;
    buttonStyle = ';padding:20px; font-size:20px;' + buttonStyle
    inputStyle = `;padding: 1px;margin: -1px;text-align: center;width: 100px;font-size: 20px;font-weight: bold;border-width: 1px;` + inputStyle
    let innerClassList = ['lui-increment-value']
    if (dataVarName) {
        innerClassList.push('webhmi-num-value')
    }
    let inner;
    if (args.children) {
        inner = `<input class='${innerClassList.join(' ')}' value="${context}" style='display:none' ${dataVarName?'data-var-name="' + dataVarName +'"':''} />`
        inner += args.children
    } else {
        inner = `<input class='${innerClassList.join(' ')}' value="${context}" style='${inputStyle}' ${dataVarName?'data-var-name="' + dataVarName +'"':''} />`
    }
    return `
    <div class="${classList.join(' ')}" style='${style}'>
    <span class='glyphicon glyphicon-chevron-down lui-increment' increment=${-increment}  style="${buttonStyle}"></span>
    ${inner}
    <span class='glyphicon glyphicon-chevron-up lui-increment' increment=${increment} style="${buttonStyle}"></span>
    </div>
`
}

function WidgetPage(context, args) {
    return `
<div class='container' style="width: 100%; height: 94vh; overflow:auto; border-style: solid; border-radius: 10px;">
    <div class='row'>
        <div class='col-sm-12'>
            ${args.children}    
        </div>
    </div>
</div>`
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function WidgetSlider(context, args) {
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
    } = cleanArgs(_args)
    classList = classList.concat(['lui-slider-scope', 'slider'])
    inputStyle = `position:relative;width:150%;top:0%;border-style:none;background:transparent;display:none` + inputStyle
    let innerClassList = ['lui-slider-value']
    if (dataVarName) {
        innerClassList.push('webhmi-num-value')
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


function WidgetDirectoryBrowser( context, args){
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
    ${WidgetDropdown( context, args )}
`
}

function WidgetDirectoryBrowserWindow( context, args){
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
    ${WidgetTableSelect( context, args )}
`
}

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

//Number grid
function WidgetNumGrid(context, args) {
    let {
        style = '',
            ['data-var-name-num-rows']: dataVarNameNumRows,
            ['data-var-name-num-cols']: dataVarNameNumCols,
            ['data-var-name-data-table']: dataVarNameDataTable,
            ['label-rows']: labelRows,
            ['label-cols']: labelCols,
            ..._args
    } = args.hash

    // Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['grid'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])+("")/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    return`
        <table class="${classList.join(' ')} ${attr}" data-var-name-num-rows=${dataVarNameNumRows} data-var-name-num-cols=${dataVarNameNumCols} data-var-name-data-table=${dataVarNameDataTable} label-rows=${labelRows} label-cols=${labelCols}>${context[0]}</table>

    `
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