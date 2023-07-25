Dynamic templating based on handlebars

This is the core library for the widget system

## Minimal HTML page:

```HTML
<!DOCTYPE html>
<html lang="en">

<head>

	<!-- Make the entire app run from within the node modules folder -->
	<base href="./node_modules/">

</head>

<body>

	<!-- Begin page content - This is a placeholder that widgets will load the page into after loading-->
	<div class="container" id="main">

	</div>

	<!-- we require manually loading  before the widget system handlebars -->
	<script src="handlebars/dist/handlebars.min.js" ></script>

	<!--Default widget setup, you may need to copy this file 
		into your app and modify it if you have a special case-->
	<script src="@loupeteam/widgets/index.js" type="module"></script>

</body>

</html>

```

## Installing Widgets 
Widgets can be installed using 
```
lpm install widgets-[widgetname]
```

## Using installed widgets
Widget system will search for installed widgets in the order:

1. widgets.json
1. package.json
1. package-lock.json

The name of the widget when installed can be referenced using:

@loupeteam/widgets-[NameToReference]

The widgets built are built using handlebars, so you can use them like any handlebars template

If it is a template (Defined in a *.handlebars using html) use

```
{{> widgetname}}
```

If it is a widget (Defined in *.js using javascript) use

```
{{w "CustomWidget"}}
```

## loading a page

By default, after loading the widget system, the start page will be loaded into the start container. This is defined in the widgets.json

```JSON
{
    "startPage" : {
        "name": "mainLayout", //Template named mainLayout will be loaded into the
        "container" : "main", //container named main
    },
}
```

## Publishing a new widget release
Pushing to main with an updated package.json version will publish automatically using github actions

To manually publish:
```
lpm publish
```
