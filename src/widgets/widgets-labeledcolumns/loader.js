function WidgetLabeledColumns(context, args) {
    //Pull out any attributes we need
    let {
        style = '', centerItems, maxColumns = 3, columnFlow = 0, ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)

    //Add our classes
    classList = classList.concat(['lui-grid', 'lui-grid-labeled'])

    //Get the header
    let header = context?.[0] || ' '

    //Read the nodes and clean them up to figure out how many columns/rows
    let nodes = htmlToElements(args.children)
    let children = ''
    let count = 0
    for( let i in nodes){
        let el = nodes[i]
        switch (el.tagName) {
            case undefined:
                break
            default:
            children += el.outerHTML        
            count++;
        }
    }
    let columns = count > maxColumns ? maxColumns : count
    let rows = Math.floor(count / columns)

    //Generate the style
    style += `;display:grid; grid-gap:5px;`
    style += `grid-auto-rows: max-content;`
    if (centerItems) {
        style += `align-items:center;justify-items:center;`
    }
    //Setup columns and rows based on the flow direction
    style += `${ columnFlow > 0 ? `grid-template: repeat(${rows},1fr) / repeat(${columns},1fr); grid-auto-flow : column;` : `grid-template-columns : repeat(${columns},1fr);`}`
    //This ensures the size is the same but there is a small gap for the border
    // style += `padding: 2px; margin: -2px;`

    return `
    <div ${attr} class='${classList.join(' ')}' style="${style};">
        <div class='lui-grid-heading' style="grid-column: span ${columns}; margin: auto;">${header}</div>
        ${children}
    </div>
   `
}