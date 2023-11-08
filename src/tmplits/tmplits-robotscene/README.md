# tmplits-robotscene

This template will instantiate a scene with the given glb file and allow you to manipulate the scene in the onrender callback.

## install

```bash
npm install @loupeteam/tmplits-robotscene
```

## usage

### Add the an import map to your html file

This is required because the template uses three.js and three.js addons which typically require a build step to be used in the browser. The import map allows you to use the modules directly in the browser by mapping the module name to the file path.

```html
<head>
  ...
  <script type="importmap">
    {
      "imports": {
        "three": "./three/build/three.module.js",
        "three/addons/": "./three/examples/jsm/"
      }
    }
  </script>
  ...
</head>
```

### Use the template and use it in your html file

```handlebars
{{tmplit
  "RobotScene"
  robotFile="./@loupeteam/tmplits-robotscene/Robot.glb"
  style="width:300px;height:300px"
  onrender="UpdateScene"
  lightColor="0xCC6666"
  lightIntensity="1.5"
}}
```

### Define the onrender callback in your javascript file

```Javascript
//This function will be called every frame
function UpdateScene(scene, userData) {
    if (userData.init) {
        userData.joint1.rotation.x += 0.1;
    }
    else {
        //Cache the objects we want to manipulate
        userData.init = true;
        userData.joint1 = scene.getObjectByName("Cube");
    }
}
```
