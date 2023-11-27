# Info
Library is provided by Loupe  
https://loupe.team  
info@loupe.team  
1-800-240-7042  

# Description
Tmplits is a framework for building HMI’s using the Handlebars template system. Tmplits manages loading assets and making them available as Partials to use throughout the HMI. This allows mixing standard HTML with a powerful template system, out of the box.

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

For more documentation and examples, see https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs.html

# Installation
To install using the Loupe Package Manager (LPM), in the main HMI application directory run `lpm install tmplits`.
If you want to install all tmplits components, in the main HMI application directory run `lpm install tmplit-basic` . For more information about LPM, see https://loupeteam.github.io/LoupeDocs/tools/lpm.html

## Licensing

This project is licensed under the [MIT License](LICENSE).