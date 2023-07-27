function WidgetNumGrid(context, args) {
    let {
        style = '',
            ['data-var-name-num-rows']: dataVarNameNumRows,
            ['data-var-name-num-cols']: dataVarNameNumCols,
            ['data-var-name-data-table']: dataVarNameDataTable,
            ['label-rows']: labelRows,
            ['label-cols']: labelCols,
            ..._args
    } = args.hash

    // Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)

    classList = classList.concat(['grid'])

    if (args.children == "" && context[0]) {
        args.children = `${context[0]}`
    }
    const result = args.children.replace(/([A-Z])+("")/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    return`
        <table class="${classList.join(' ')} ${attr}" data-var-name-num-rows=${dataVarNameNumRows} data-var-name-num-cols=${dataVarNameNumCols} data-var-name-data-table=${dataVarNameDataTable} label-rows=${labelRows} label-cols=${labelCols}>${context[0]}</table>

    `
}