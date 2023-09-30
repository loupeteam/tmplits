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

/* Example Page Select Usage
{{tmplit 'PageSelect' 'Page 1' dom="container1" template="page1"}}
{{tmplit 'PageSelect' 'Page 2' dom="container1" template="page2"}}

<script id="page1" type="text/x-handlebars-template">
<!-- write your page 2 with normal html -->
page1
</script>

<script id="page2" type="text/x-handlebars-template">
<!-- write your page 2 with normal html -->
page2
</script>

<div id="container1">
</div>
*/

import * as util from "../tmplits-utilities/module.js"

export function TmplitPageSelect(context, args) {
    let {
        active,
        template,
        dom,
        ctx,
        ..._args
    } = args.hash
    //Get cleaned values
    let {
        classList,
        attr
    } = util.cleanArgs(_args)
    classList = classList.concat(['nav-tabs-item'])
    if (active) {
        classList = classList.concat(['active'])
    }

    if( typeof ctx == 'string'){
        attr = attr.concat(`data-context='${ctx}'`)
    }
    else if( typeof ctx == 'object'){
        attr = attr.concat(`data-context='${JSON.stringify(ctx)}'`)
    }
    else if( typeof ctx == 'number'){
        attr = attr.concat(`data-context=${ctx}`)
    }
    return `
<li class="${classList.join(' ')}" >
    <a data-page='${template}' data-target-dom='${dom}' ${attr}>${context[0]}</a>
</li>
`
}