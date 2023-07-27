function WidgetPage(context, args) {
    return `
<div class='container' style="width: 100%; height: 94vh; overflow:auto; border-style: solid; border-radius: 10px;">
    <div class='row'>
        <div class='col-sm-12'>
            ${args.children}    
        </div>
    </div>
</div>`
}