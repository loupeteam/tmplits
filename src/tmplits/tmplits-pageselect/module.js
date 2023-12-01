/*
 * File: module.js
 * Copyright (c) 2023 Loupe
 * https://loupe.team
 * 
 * This file is part of tmplits, licensed under the MIT License.
 * 
 */

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

//Page select will decide which page to show based on what the user supplies for children
export function TmplitPageSelect(context, args) {

    //Get children if they exist
    let children = args.children

    //If the user provides children, use them and do the minimal amount of processing
    if (children.length > 0) {
        let {
            active,
            template,
            dom,
            ctx,
            ..._args
        } = args.hash
        //Get cleaned values
        let {
            attr
        } = util.cleanArgs(_args)

        attr = util.appendContextToAttr(attr, ctx)
        let nodes = util.htmlToElements(args.children)
        let children = ''
        if (nodes.length == 1 && nodes[0].tagName == undefined) {
            //If the user only provides text, use the div version
            return TmplitPageSelectDiv([nodes[0].textContent], args)
        }
        else {
            //If the user provides html, add the data attributes to the html and return it
            for (let i = 0; i < nodes.length; i++) {
                let el = nodes[i]
                switch (el.tagName) {
                    case undefined:
                        children += el.textContent
                        break
                    default:
                        el.setAttribute('data-page', template)
                        el.setAttribute('data-target-dom', dom)
                        if (active) {
                            el.classList.add('active')
                        }
                        //Go through the _args and add them to the element
                        Object.keys(_args).map((v) => {
                            el.setAttribute(v, _args[v])
                        })
                        //If ctx is provided, append it to the attr
                        if (ctx) {
                            el.setAttribute('data-context', ctx)
                        }
                        children += el.outerHTML
                }
            }
        }
        return children
    }
    //If the user doesn't provide children, fallback to the original behavior
    else {
        return TmplitPageSelectNav(context, args)
    }
}

//Page select to use in a nav tab
export function TmplitPageSelectNav(context, args) {
    let {
        active,
        template,
        dom,
        ctx,
        ["data-value"]: data_value,
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

    attr = util.appendContextToAttr(attr, ctx)
    return `
<li class="${classList.join(' ')}" ${typeof data_value != 'undefined' ? `data-value=${data_value}` : ''} >
    <a data-page='${template}' data-target-dom='${dom}' ${attr}>${context[0]}</a>
</li>
`
}

//Minimal page select to use in a div
export function TmplitPageSelectDiv(context, args) {
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

    if (active) {
        classList = classList.concat(['active'])
    }

    attr = util.appendContextToAttr(attr, ctx)

    return `<div class="${classList.join(' ')}" data-page='${template}' data-target-dom='${dom}' ${attr}>${context[0]}</div>`
}