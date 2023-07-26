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