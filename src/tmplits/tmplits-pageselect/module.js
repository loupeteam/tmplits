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

    attr = util.appendContextToAttr(attr, ctx)

    return `
<li class="${classList.join(' ')}" >
    <a data-page='${template}' data-target-dom='${dom}' ${attr}>${context[0]}</a>
</li>
`
}