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