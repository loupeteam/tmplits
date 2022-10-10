var widgets = new Widgets("./widgets.json", (data) => {
  widgets.loadPage(data.startPage.container, data.startPage.name)
})