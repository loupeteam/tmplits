let baseEl = document.querySelector('base')
let base = './'
if( baseEl ){
    //If the base href contains node_modules we need to go up a level
    base = baseEl.href.indexOf('node_modules') > -1 ? '../' : './'
}

var widgets = new Widgets(base + "widgets.json", (data) => {
  widgets.loadPage(data.startPage.container, data.startPage.name)
})

