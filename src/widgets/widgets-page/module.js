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

export function WidgetPage(context, args) {
    return `
    <div class='container' style="width: 100%; height: 94vh; overflow:auto; border-style: solid; border-radius: 10px;">
        <div class='row'>
            <div class='col-sm-12'>
                ${args.children}    
            </div>
        </div>
    </div>`
}