var widgets = new Widgets("./widgets.json", (data) => {
  widgets.loadPage(data.startPage.container, data.startPage.name)
})

machine = new WEBHMI.Machine({
  port: 8000,
  ipAddress: '127.0.0.1',
  maxReconnectCount: 5000
});  

