# Tmplit-material

This tmplit is a prebuilt material design library for tmplits. By installing this library you can use material design components in your tmplits project. Tmplits will automatically load the material design css and javascript files for you after installing this library.

### Usage

npm install tmplits-material

Use it in your tmplits project:

```html
<md-filled-button >I'm a button!</md-filled-button>
```

### To use a theme
    
```html
    <!-- Include the themes you support -->
    <link href="app/css/dark.css" rel="stylesheet">
	<link href="app/css/light.css" rel="stylesheet">

    <!-- Add the class for the active theme to the body tag-->
    <body class='light'>
    ...
```


### Updating the library

Install the version of material you want to use:

```bash
npm install --save-dev @material/web
```

Then run the build script:
```bash
npm run build
```