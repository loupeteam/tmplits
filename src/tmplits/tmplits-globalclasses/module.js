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

import { evalContext } from "../tmplits-utilities/module.js"


export class multiOptionSelector{

    // Handle the user clicking on an option
    static selected(el, click) {
                
        //selected() is called when the user clicks on an option
        //  it writes the index or value of the option to the lui-select-value element
        //  and raises the change event on the lui-select-value element
        //This does not change the lui-select-text element; that is handled by the render() 
        //  function since those elements need to be updated when the source changes as well as when the selection changes

        //Find the scope of the select element
        let scope = el.closest('.select-scope')

        //Figure out what the value should be
        let value = el.getAttribute('data-value')
        let index = el.getAttribute('data-index')
        scope.setAttribute('selectedIndex', index)

        let setValue = value || +index;

        // Go through all the value elements and set their value to the data-index or data-value
        // This will trigger the change event on the lui-select-value element
        let targets = scope.querySelectorAll('.lui-select-value')
        targets.forEach((target) => {
            target.value = setValue;
            target.dispatchEvent(new Event("change", {
                "bubbles": true,
                "cancelable": true
            }));
        })

        // If the user provided a click, run it
        if (click) {
            try {
                evalInContext(click, el)
            } catch (e) {
                throw `error from user event: '${click}' ` + e
            }
        }

        // Do whatever we should do any time the selection changes
        multiOptionSelector.updateSelectOptions(scope, setValue)
    }

    //Re-render the element when the underlying data changes
    static render(evt) {
        //When render is called, value element has already been updated. We just need to "redraw"
        // This does not raise the change event on the lui-select-value element, since that would cause an infinite loop
        let scope = evt.target.classList.contains('select-scope') ? evt.target : evt.target.closest('.select-scope')
        let valueHolder = scope.querySelector('.lui-select-value') // evt.target should be this value; for some reason, using evt.target sometimes doesn't work here.
        if (valueHolder != null) {
            multiOptionSelector.updateSelectOptions(scope, valueHolder.getAttribute('value'))
        }
    }

    //Called any time the selection changes
    static updateSelectOptions(scope, value){
        
        //To update the select options, we need to:
        //  1. Find the option that is selected
        //  2. Update the lui-select-text element and raise an event on it, so it can be written to the source
        //  3. Load the page if the user provided a page. 

        let selection = '';
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

                //This would ideally be done by triggering a click. 
                //  This would cause it to do whatever the user has 
                //  set up for the on click event,
                //  But that could cause a recursive loop                
                selectPage({currentTarget:option})                
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
    }        
}

$(document).on({
    "render": multiOptionSelector.render,
}, '.lui-select-value');

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export class LuiSlider {
    //On Slider Start we need to set the start value and the start screen position
    static Start(evt) {

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
    //On Slider End we need to remove the active class
    static End(selected) {
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
    //Handle the slider changing if the mouse is moved
    static Move(evt) {

        evt.preventDefault()
        //We get all the active sliders
        //  This is because with this slider, it is OK if the user goes OFF the slider
        //  This is a FEATURE, not a bug
        let scope = document.querySelectorAll('.lui-slider-scope.lui-slider-active')

        //If there are no active sliders, we don't need to do anything
        if (scope.length == 0) {
            return;
        } else if (scope.length > 1) {
            //If there are multiple active sliders, we need to remove the active class from all of them and stop the function            
            scope.forEach((e) => {
                e.classList.remove('lui-slider-active')
                let target = scope.querySelectorAll('.lui-slider-value')
                target.forEach((input)=>{
                    input.classList.remove('editing')
                })
            })
            return;
        } else {
            //If there is only one active slider, we can continue
            scope = scope[0]
        }

        //We get all the value elements
        let target = scope.querySelectorAll('.lui-slider-value')

        //If there are no value elements, we just raise a change on our scope and stop the function
        if (target.length == 0) {
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            scope.dispatchEvent(evt);
            return
        }

        //We get all the values we need to calculate the new value
        let screenScale = +scope.getAttribute('lui-slider-scale')
        let startValue = +scope.getAttribute('lui-slider-start')
        let direction = scope.getAttribute('direction') > 0
        let max = +scope.getAttribute('lui-slider-max')
        let min = +scope.getAttribute('lui-slider-min')

        //We calculate the new value
        let total = max - min;
        let screenStart = +(direction  ? scope.getAttribute('lui-slider-screen-x-start') : scope.getAttribute('lui-slider-screen-y-start'))
        let screenNew = +(direction ? evt.screenX : evt.screenY)
        let scrollDistance =-(direction ? -scope.clientWidth : scope.clientHeight)
        let scrollBarPercent = (((screenNew - screenStart)/(scrollDistance*0.9)) * screenScale)
        let value = startValue + scrollBarPercent*total
        value = clamp(value, min, max)

        //We update the slider here instead of from the render because we don't want to use the value from the render
        //  The render value is the value from the source, which may not be the same as the value from the slider
        //  So there is some visual bouncing if we use the render value
        LuiSlider.Render(scope, value)

        //We update the value elements and dispatch the change event
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
    //Handle the slider changing if the wheel is moved
    static Wheel(evt) {

        //Get the scope of the slider from the event
        let scope = evt.target.classList.contains('lui-slider-scope') ? evt.target : evt.target.closest('.lui-slider-scope')
        if( scope == null){
            return
        }
        //Prevent the default behavior of the wheel, otherwise the page will scroll
        evt.preventDefault()

        //Remove active so that the mouse move doesn't interact with the slider
        scope.classList.remove('lui-slider-active')
        if (scope.length == 0) {
            return;
        } 

        //Get the value elements
        let target = scope.querySelectorAll('.lui-slider-value')

        //If there are no value elements, we just raise a change on our scope and stop the function
        if (target.length == 0) {
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            scope.dispatchEvent(evt);
            return
        }

        //Get all the values we need to calculate the new value
        let startValue = +target[0].getAttribute('value')
        let max = +scope.getAttribute('lui-slider-max')
        let min = +scope.getAttribute('lui-slider-min')
        let direction = scope.getAttribute('direction') > 0

        //Calculate the new value
        let scrollDistance =(direction ? scope.clientWidth : scope.clientHeight)*10
        let value = startValue + evt.deltaY/scrollDistance
        value = clamp(value, min, max)

        //Update the slider visually
        LuiSlider.Render(scope, value)

        //Update the value elements and dispatch the change event
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

        //Use a timer to remove the editing class after a short delay
        //  This is to prevent debounce issues, since there isn't a good way to debounce the wheel event
        let oldTimeout = scope.getAttribute('timeout')
        if(oldTimeout!=null){
            clearTimeout(oldTimeout)
        }

        let timeout = setTimeout(()=>{
            //If we don't get a new event, we remove the editing class 
            target.forEach((e) => {
                e.classList.remove('editing')
            })    
            scope.removeAttribute('timeout')
        }, 500)

        //Set the timeout attribute so we can clear it later
        scope.setAttribute('timeout', timeout)
    }

    //Handle rendering the slider if the value changes with an event
    static RenderEvt(evt) {
        //Get the scope of the slider from the event
        let scope = evt.target.classList.contains('lui-slider-scope') ? evt.target : evt.target.closest('.lui-slider-scope')
        if(scope == null) return;        

        //Get the value elements
        let target = scope.querySelectorAll('.lui-slider-value')
        if (target.length == 0) return;

        //We don't want to render from the event if we are still editing the value
        if( target[0].classList.contains('editing') ) return;

        //Render the slider
        LuiSlider.Render(scope, +evt.target.getAttribute('value'))
    }

    //Do the actual rendering of the slider with a specific value
    static Render(scope, value) {

        //Get the attributes we need to render the slider
        let direction = scope.getAttribute('direction') > 0
        let sliderBar = scope.querySelectorAll('.slider-bar')
        let max = +scope.getAttribute('lui-slider-max')
        let min = +scope.getAttribute('lui-slider-min')

        //Calculate the percent of the slider that should be filled
        value = clamp(value, min, max)
        let total = max - min;
        let percent = ((max - value) / total) * 90 //90 keeps the bar from going past the bottom

        //Update the slider visually
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
    "mousedown": LuiSlider.Start
}, '.lui-slider-scope');
$(document).on({
    "touchstart": LuiSlider.Start
}, '.lui-slider-scope');

$(document).on({
    "render": LuiSlider.RenderEvt,
}, '.lui-slider-value');

$(document).on({
    "mousemove": LuiSlider.Move
});

$(document).on({
    "touchmove": LuiSlider.Move
});

$(document).on({
    "mouseup": LuiSlider.End
});

$(document).on({
    "touchend": LuiSlider.End
});

window.addEventListener("wheel", LuiSlider.Wheel, { passive:false })

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
            e.nextSibling.innerHTML = `filtering: ${filter}`
        } else {
           let el = document.createElement('div')
           el.innerHTML = `filtering: ${filter}`
           el.classList.add('filter-text');
           el.classList.add('form-control')        
           e.parentNode.appendChild(el);
        }
    }
    static filterKey(e){
        e.preventDefault()
        let key = e.key
        let scope = e.target.closest('.select-scope')
        let target = scope.querySelectorAll('.dropdown-menu,.list-view')
        
        //if the user presses enter, set the value of filter to the html of e
        if( key == 'Enter'){
            let evt = new Event("change", {
                "bubbles": true,
                "cancelable": true
            });
            e.target.dispatchEvent(evt);            
            return
        }

        target.forEach((element)=>{
            element.parentNode.classList.add('open')
            luiDirectory.filter(element.children[0], key)
        })    

        let filter = scope.querySelector('[filter]')
        if (filter) {
            e.target.value = filter.getAttribute('filter')            
        }
    }
}

$(document).on({
    "render": luiDirectory.updateDirectory,
}, '.lui-directory-data');

$(document).on({
    "keydown": luiDirectory.filterKey
}, '.select-scope input');


//Handle setting active if a tab is clicked
export function selectTab(selected) {
    selected = $(selected.currentTarget)
    let tabs = selected.closest('.nav-tabs').children('.nav-tabs-item')
    tabs.removeClass('active')
    selected.addClass('active')
}

$(document).on({
    "click": selectTab
}, '.nav-tabs-item');

//Handle changing the page if a tab is clicked
export function selectPage(selected) {    
    selected = selected.currentTarget
    let query;

    let page = selected.getAttribute('data-page')
    query = selected.querySelector('[data-page]')
    if( query != null){
        page = query.getAttribute('data-page');
    }                        

    let dom = selected.getAttribute('data-target-dom')
    query = selected.querySelector('[data-target-dom]')
    if( query != null){
        dom = query.getAttribute('data-target-dom');
    }                        

    let context = evalContext.call(selected, selected.getAttribute('data-context'))
    query = selected.querySelector('[data-context]')
    if (query != null) {
        context = evalContext.call(query, query.getAttribute('data-context'))
    }
    
    if (dom && page) {
        //Check if the user has provided a context
        tmplits.loadPage(dom, page, context)
    }
}

$(document).on({
    "click": selectPage
}, '[data-page]');

//Handle Incrementing a variable if a button is clicked
export function luiIncrementValue(selected) {

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

    let increment;
    let max = selected.currentTarget.getAttribute('max');
    let min = selected.currentTarget.getAttribute('min');
    
    // limit with min value
    if ((max === null) && (min !== null)){
        let minValue = Number(min);
        if (value > minValue){
            increment = +selected.currentTarget.getAttribute('increment');
        } else {
            increment = 0;
        }
    }

    // limit with max value
    if ((max !== null) && (min === null)){
        let maxValue = Number(max);
        if (value < maxValue){
            increment = +selected.currentTarget.getAttribute('increment');
        } else {
            increment = 0;
        }
    }

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
