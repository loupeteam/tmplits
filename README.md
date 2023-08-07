[![Publish Tmplits](https://github.com/loupeteam/tmplits/actions/workflows/publish-tmplits.yml/badge.svg)](https://github.com/loupeteam/tmplits/actions/workflows/publish-tmplits.yml)

[![Publish Tmplit](https://github.com/loupeteam/tmplits/actions/workflows/npm-publish-github-packages.yml/badge.svg)](https://github.com/loupeteam/tmplits/actions/workflows/npm-publish-github-packages.yml)

Dynamic templating based on handlebars

There are 3 (as of writing this) packages in this repo that are all managed and distributed separately

1. src/HMI - Main tmplit library
2. example/HMI/ - Template hmi project using the tmplit system
3. example/gizmo/ - Template tmplit package


This repo currently published using github actions when there is a new commit pushed to main

To manual publish:
- navigating to each folder that is updated
- incrementing the version in the package json
- publishing using:
```
lpm publish
```
