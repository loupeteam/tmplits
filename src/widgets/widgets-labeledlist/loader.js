function WidgetLabeledList(context, args) {
    let {
        style = '', ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['lui-grid'])

    return `
    <div class="row">
        <div class="col-sm-12">
            ${args.children}
        </div>
    </div> `
}
