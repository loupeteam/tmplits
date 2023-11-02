This is a template gizmo

Use this template by running:
```
lpm install tmplits-gizmo
```
then modify it for your needs.

Settings up the template:

This gizmo can be installed using NPM install and will get loaded by the tmplit system
the important parts are a 
- library.handlebars - this is your template
- loader.js - js file that will run after loading the templates. This can do work to instantiate things or contain function tmplits
- Package.json that includes a name with the prefix 
    - @loupeteam/tmplit-[your tmplits name]
    - Version number
    - Link to repo the repo (the local one or tmplits, this is important because it is how the package gets it's access rights)    
```json
{
    "name": "@loupeteam/tmplits-[TmplitName]",
    "version": "x.x.x",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/loupeteam/tmplits.git"
    },
}
```

The entire page template will be loaded with the name [your tmplit name] and any tmplits inside scripts will also be available

Usage:


```json
//Application Package.json
{
{
  "name": "@loupeteam/tmplit-template",
  "version": "0.0.2",
  ...
  "dependencies": {
    "@loupeteam/tmplits": "0.0.2",
    "@loupeteam/tmplits-gizmo": "0.0.1",    
  }
}
}
``````

```json
//Gizmo Package.json
{
    "name": "@loupeteam/tmplits-gizmo",
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
function TmplitCustomTmplit( ... ){
 ...
}
```
```handlebars
<!--main.handlbars-->
{{> gizmo}}
{{W CustomTmplit}}
```

## Licensing

This project is licensed under the [MIT License]LICENSE.
