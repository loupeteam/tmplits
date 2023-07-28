import * as util from "../widgets-utilities/module.js"

export function WidgetCheckBox(context, args) {
    let {
        ['data-var-name']: dataVarName, buttonType = '', buttonVarName = '', ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    classList = classList.concat(['label-led'])

    if (args.children == "" && context[0]) {
        args.children = `<h3>${context[0]}</h3><h3/>`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    if (util.getButtonType(buttonType, classList)) {
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