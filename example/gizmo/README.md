This is a template gizmo

Use this template by running:
```
lpm install widgets-gizmo
```
then modify it for your needs.

Settings up the template:

This gizmo can be installed using NPM install and will get loaded by the widget system
the important parts are a 
- library.handlebars - this is your template
- loader.js - js file that will run after loading the templates. This can do work to instantiate things or contain function widgets
- Package.json that includes a name with the prefix 
    - @loupeteam/widget-[your widgets name]
    - Version number
    - Link to repo the repo (the local one or widgets, this is important because it is how the package gets it's access rights)    
```json
{
    "name": "@loupeteam/widgets-[WidgetName]",
    "version": "x.x.x",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/loupeteam/widgets.git"
    },
}
```

The entire page template will be loaded with the name [your widget name] and any widgets inside scripts will also be available

Usage:


```json
//Application Package.json
{
{
  "name": "@loupeteam/widget-template",
  "version": "0.0.2",
  ...
  "dependencies": {
    "@loupeteam/widgets": "0.0.2",
    "@loupeteam/widgets-gizmo": "0.0.1",    
  }
}
}
``````

```json
//Gizmo Package.json
{
    "name": "@loupeteam/widgets-gizmo",
    "version": "0.0.1",
}
``````

```handlebars
<!--library.handlebars-->
<div>Hello World<div>
```

```javascript
//loader.js
console.log("Loaded gizmo!")
function WidgetCustomWidget( ... ){
 ...
}
```
```handlebars
<!--main.handlbars-->
{{> gizmo}}
{{W CustomWidget}}
```
