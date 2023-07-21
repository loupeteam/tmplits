Dynamic templating based on handlebars

There are 3 (as of writing this) packages in this repo that are all managed and distrubuted sepearatly

src/HMI - Main widget library
example/HMI/ - Template hmi project using the widget system
example/gizmo/ - Template widget package

This repo currently needs to be manually published by
- navigating to each folder that is updated
- incrementing the version in the package json
- publishing using:
```
lpm publish
```
