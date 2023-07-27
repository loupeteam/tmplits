function WidgetDirectoryBrowser( context, args){
    let {        
        ['data-var-name']:dataVarName,
        ['data-var-name-files']:dataVarNameFiles,
        style = '', ..._args
    } = args.hash
    if(dataVarNameFiles){
        args.hash['data-var-name-field'] = dataVarName
    }
    delete args.hash['data-var-name']
    args.hash.set = false
    args.children += `<invisible-input style='display:none' class='webhmi-text-value lui-directory-data' data-var-name='${dataVarNameFiles}'></invisible-input><dropdown>No Data</dropdown>`
    return `    
    ${WidgetDropdown( context, args )}
`
}