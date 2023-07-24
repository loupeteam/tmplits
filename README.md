Dynamic templating based on handlebars

There are 3 (as of writing this) packages in this repo that are all managed and distrubuted sepearatly

1. src/HMI - Main widget library
2. example/HMI/ - Template hmi project using the widget system
3. example/gizmo/ - Template widget package


This repo currently published using github actions when there is a new commit pushed to main

To manual publish:
- navigating to each folder that is updated
- incrementing the version in the package json
- publishing using:
```
lpm publish
```
