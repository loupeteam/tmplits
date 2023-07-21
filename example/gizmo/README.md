This is a template gizmo

This gizmo can be installed using NPM install and will get loaded by the widget system
the important parts are a 
- library.handlebars - this is your template
- loader.js - this is an optional js file that will run after loading the templates
- Package.json that includes a name with the prefix 
    - @loupeteam/widget-[your widgets name]
    - Version number
```json
{
    "name": "@loupeteam/widgets-[WidgetName]",
    "version": "x.x.x",
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
```
```handlebars
<!--main.handlbars-->
{{> gizmo}}
```
