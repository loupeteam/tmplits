[![Publish Widgets](https://github.com/loupeteam/widgets/actions/workflows/publish-widgets.yml/badge.svg)](https://github.com/loupeteam/widgets/actions/workflows/publish-widgets.yml)

[![Publish Widget](https://github.com/loupeteam/widgets/actions/workflows/npm-publish-github-packages.yml/badge.svg)](https://github.com/loupeteam/widgets/actions/workflows/npm-publish-github-packages.yml)

Dynamic templating based on handlebars

There are 3 (as of writing this) packages in this repo that are all managed and distributed separately

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
