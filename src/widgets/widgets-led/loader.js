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