/*Example Button usage
{{#tmplit 'button' style="color:red" }}
    My Button
{{/tmplit}}
{{tmplit 'button' class="led-on" style="color:blue" children="Thank you" }}
*/

import * as util from "../tmplits-utilities/module.js"

export function TmplitButton(context, args) {

    let {
        buttonType = '', ..._args
    } = args.hash

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    //Add class items from this component
    classList = classList.concat(['btn'])

    //If there are no children, the first item in the context is the label
    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }

    util.getButtonType(buttonType, classList)

    return `<button type='button' class="${classList.join(" ")}"  ${attr}> ${args.children ? args.children : 'Label'} </button>`
}