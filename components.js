let scope = this

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
    return {
        classList,
        attr
    }
}

function getButtonType(type, classList) {

    //See if there is a button type
    if (type) {
        switch (type.trim().toLowerCase()) {
            case 'set':
                classList.push('webhmi-btn-set')
                return true
                break;
            case 'toggle':
                classList.push('webhmi-btn-toggle')
                classList.push('webhmi-led')
                return true
                break
            case 'momentary':
                classList.push('webhmi-btn-momentary')
                classList.push('webhmi-led')
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
    let selection = el.textContent.trim();
    let text = item.querySelectorAll('.selected-item-text:not(.noset)')
    if (text.length) {
        text.forEach(e => {
            e.innerHTML = selection
            if (el.value) {
                e.value = el.value;
            } else {
                e.value = selection;
            }
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
            eval(click)
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
        set = true, style = '', ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group', 'dropdown-scope'])

    let trimmed = args.children.trim()
    let field = ''
    let options = ''
    let index = 0
    $(jQuery.parseHTML(trimmed)).each((i, el) => {
        if (el.tagName == 'FIELD') {
            el.childNodes.forEach((e) => {
                if (e.classList) {
                    e.classList.add('form-control')
                    if (set) {
                        e.classList.add('selected-item-text')
                    }
                    field += e.outerHTML
                }
            })
        }
        if (el.tagName == 'OPTION') {
            let e = el
            let click = `dropDownSelected(this, '${e.getAttribute('onclick') }');`
            e = jQuery.parseHTML(`<tr><td> ${e.innerHTML} </td></tr>`)
            e[0].setAttribute('onclick', click)
            e[0].setAttribute('data-index', index++)
            options += e[0].outerHTML
        }
        if (el.tagName == 'OPTIONS') {
            el.childNodes.forEach((e) => {
                if (e.getAttribute) {
                    let click = `dropDownSelected(this, '${e.getAttribute('onclick') }');`
                    e = jQuery.parseHTML(`<tr><td> ${e.outerHTML} </td></tr>`)
                    e[0].setAttribute('onclick', click)
                    e[0].setAttribute('data-index', index++)
                    options += e[0].outerHTML
                }
            })
        }
    })
    if (field == '') {
        field = `<input class='form-control selected-item-text'>`
    }
    let delegate = args.delegate ? `onclick="${args.delegate}?.willOpen?.()"` : ''
    return `
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
`
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
        set = true, style = '', ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group', 'dropdown-scope'])

    let trimmed = args.children.trim()

    let field = ''
    let index = 0
    let dropdown = 'missing &lt;dropdown&gt;'
    $(jQuery.parseHTML(trimmed)).each((i, el) => {
        if (el.tagName == 'FIELD') {
            el.childNodes.forEach((e) => {
                if (e.classList) {
                    e.classList.add('form-control')

                    if (set && e.querySelectorAll(".selected-item-text").length == 0) {
                        e.classList.add('selected-item-text')
                    }
                    field += e.outerHTML
                }
            })
        }
        if (el.tagName == 'DROPDOWN') {
            el.querySelectorAll('.option').forEach((e) => {
                let click = `dropDownSelected(this, '${ e.getAttribute('onclick') }');`
                e.setAttribute('onclick', click)
                e.setAttribute('data-index', index++)
            })
            dropdown = el.innerHTML
        }
    })
    if (field == '') {
        field = `<div class='form-control selected-item-text'></div>`
    }
    let delegate = args.delegate ? `onclick="${args.delegate}?.willOpen?.()"` : ''
    return `
<div class="${classList.join(' ')}" style="${style}" >
        <div class="input-group-btn">
            <button type="button" 
            ${delegate}
            class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
            </button>
            <div class="dropdown-menu" >
                ${dropdown}
            </div>
        </div>
        ${field}
    </div>
`
}

function WidgetLabeledLed(context, args) {
    let {
        side = 'middle', ['data-var-name']: dataVarName, buttonType = '', buttonVarName = '', ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['input-group', 'form-control', 'label-led'])

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
            }))
        }
        attr += `data-var-name='${buttonVarName}'`
    }
    return `
    <div class="${classList.join(' ')}" ${attr}>
    <div class='led webhmi-led' data-led-false='led-off' data-led-true='led-green' data-var-name='${dataVarName}' ${attr}></div>
    <div class='led-label' style='${labelStyle}' >${finalResult}</div>
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
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return `
    <div class="${classList.join(' ')}" ${attr} >
    <input class='form-control webhmi-num-value' ${dataVarName ? 'data-var-name="' + dataVarName + '"' : '' } ${attr}/>
    <span class='input-group-addon'>${finalResult}</span>
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

    let nodes = $(jQuery.parseHTML(args.children)).not('text')
    let count = nodes.length

    maxColumns = maxColumns > 12 ? 12 : maxColumns
    let columns = count > maxColumns ? maxColumns : count
    let columnSize = Math.floor(12 / columns)
    let rows = Math.ceil(count / columns)
    classList.push(`col-sm-${columnSize}`)

    let children = ''
    nodes.each((i, el) => {
        if (i % columns == 0) {
            children += `<div class="row">`
        }
        children += `<div class="${classList.join(' ')}" style='${style}'>${el.outerHTML}</div>`
        if (i % columns == (columns - 1)) {
            children += `</div>`
        }
    })
    return `
<!--    <div class="container"> -->
        ${children}
        <!--    </div> -->
   `
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
    let nodes = $(jQuery.parseHTML(args.children)).not('text')
    let count = nodes.length
    let children = ''
    nodes.each((i, el) => {
        children += `${el.outerHTML}`
    })
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
    let nodes = $(jQuery.parseHTML(args.children)).not('text')
    let count = nodes.length
    let children = ''
    nodes.each((i, el) => {
        children += `${el.outerHTML}`
    })
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
$(document).on({
    "click": luiIncrementValue
}, '.lui-increment');

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
    "mousemove": LuiSlider.luiSlideChange
});
$(document).on({
    "touchmove": LuiSlider.luiSlideChange
});

$(document).on({
    "mouseup": LuiSlider.luiSlideEnd
});
$(document).on({
    "touchend": LuiSlider.luiSlideEnd
});

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

        if (click) {
            try {
                eval(click)
            } catch (e) {
                throw `error from user event: '${click}' ` + e
            }
        }
        multiOptionSelector.updateSelection(scope, +index)
    }
    static updateSelection(scope, value){
        let options = scope.querySelectorAll('.option')
        options.forEach((option)=>{
            let dataValue =  option.getAttribute('data-value')
            if( (dataValue == null && option.getAttribute('data-index') == Math.floor(value)) ||  dataValue == value )
            {
                option.classList.add('active')
            }
            else{
                option.classList.remove('active')
            }
        })        
    }
    static setSelected(evt) {
        let scope = evt.target.classList.contains('select-scope') ? evt.target : evt.target.closest('.select-scope')
        multiOptionSelector.updateSelection(scope, +evt.target.getAttribute('value'))
    }    
}

$(document).on({
    "change": multiOptionSelector.setSelected,
}, '.lui-select-value');

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
    $(jQuery.parseHTML(trimmed)).each((i, el) => {
        if (el.tagName == 'OPTION') {
            let e = el
            let dataValue = e.getAttribute('data-value')
            let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
            e = jQuery.parseHTML(`<div class="option"> ${e.innerHTML} </div>`)
            if( dataValue != null ){
                e[0].setAttribute('data-value', dataValue)            
            }
            e[0].setAttribute('onclick', click)            
            e[0].setAttribute('data-index', index)
            index++
            options += e[0].outerHTML
        }
        if (el.tagName == 'OPTIONS') {
            el.childNodes.forEach((e) => {
                if (e.getAttribute) {
                    let dataValue = e.getAttribute('data-value')
                    let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                    e = jQuery.parseHTML(`<div class="option"> ${e.outerHTML} </div>`)
                    if( dataValue != null){
                        e[0].setAttribute('data-value', dataValue)            
                    }
                    e[0].setAttribute('onclick', click)
                    e[0].setAttribute('data-index', index)
                    index++
                    options += e[0].outerHTML
                }
            })
        }
    })
    options += `<invisible-input class="lui-select-value webhmi-num-value" style="display:none" value="${context}" ${dataVarName?'data-var-name="' + dataVarName +'"':''} ></invisible-input>`

    args.children = options
    let inner = WidgetColumns( context, args)
    return `
<div class="${classList.join(' ')}">${inner}</div>    
    ` 
}


//Handle setting active if a tab is clicked
function selectTab(selected) {
    selected = $(selected.currentTarget)
    let tabs = selected.closest('.nav-tabs').children('.nav-tabs-item')
    tabs.removeClass('active')
    selected.addClass('active')
}
$(document).on({
    "click": selectTab
}, '.nav-tabs-item');

//Handle changing the page if a tab is clicked
function selectPage(selected) {
    selected = $(selected.currentTarget)
    let page = selected.attr('data-page')
    let dom = selected.attr('data-target-dom')
    widgets.loadPage(dom, page)
}
$(document).on({
    "click": selectPage
}, '[data-page]');

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