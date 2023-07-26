function WidgetLabeledTextOutput(context, args) {

    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)

    classList = classList.concat(['input-group'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return `
    <div class="${classList.join(' ')}" ${attr} >
    <span class='input-group-addon'>${finalResult}</span>
    <div class='form-control webhmi-text-value' ${attr}></div>
    </div>
   `
}
