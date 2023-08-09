[![Publish Tmplit](https://github.com/loupeteam/tmplits/actions/workflows/npm-publish-github-packages.yml/badge.svg)](https://github.com/loupeteam/tmplits/actions/workflows/npm-publish-github-packages.yml)

Dynamic templating based on handlebars

This is the core library for the tmplit system

## Minimal HTML page:

```HTML
<!DOCTYPE html>
<html lang="en">

<head>

	<!-- Make the entire app run from within the node modules folder -->
	<base href="./node_modules/">

</head>

<body>

	<!-- Begin page content - This is a placeholder that tmplits will load the page into after loading-->
	<div class="container" id="main">

	</div>

	<!-- we require manually loading  before the tmplit system handlebars -->
	<script src="handlebars/dist/handlebars.min.js" ></script>

	<!--Default tmplit setup, you may need to copy this file 
		into your app and modify it if you have a special case-->
	<script src="@loupeteam/tmplits/index.js" type="module"></script>

</body>

</html>

```

## Installing Tmplits 
Tmplits can be installed using 
```
lpm install tmplits-[tmplitname]
```

## Using installed tmplits
Tmplit system will search for installed tmplits in the order:

1. tmplits.json
1. package.json
1. package-lock.json

The name of the tmplit when installed can be referenced using:

@loupeteam/tmplits-[NameToReference]

The tmplits built are built using handlebars, so you can use them like any handlebars template

If it is a template (Defined in a *.handlebars using html) use

```
{{> tmplitname}}
```

If it is a tmplit (Defined in *.js using javascript) use

```
{{w "CustomTmplit"}}
```

## loading a page

By default, after loading the tmplit system, the start page will be loaded into the start container. This is defined in the tmplits.json

```JSON
{
    "startPage" : {
        "name": "mainLayout", //Template named mainLayout will be loaded into the
        "container" : "main", //container named main
    },
}
```

## Publishing a new tmplit release
Pushing to main with an updated package.json version will publish automatically using github actions

To manually publish:
```
lpm publish
```
