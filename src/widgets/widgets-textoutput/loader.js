function WidgetTextOutput(context, args) {

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
    <div class='form-control webhmi-text-value' ${attr}></div>
    </div>
   `
}