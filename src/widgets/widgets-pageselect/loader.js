function WidgetPageSelect(context, args) {
    let {
        active,
        template,
        dom,
        ..._args
    } = args.hash
    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)
    classList = classList.concat(['nav-tabs-item'])
    if (active) {
        classList = classList.concat(['active'])
    }
    return `
<li class="${classList.join(' ')}" >
    <a data-page='${template}' data-target-dom='${dom}' ${attr}>${context[0]}</a>
</li>
`
}