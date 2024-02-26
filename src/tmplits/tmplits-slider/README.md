# TmplitSlider

This is a tmplit for Slider.

Loupe Docs Link: https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs/tmplitcomponents/numerictmplit.html

# Usage

```
    {{tmplit 'Slider' screenScale=1 min=0 max=100 direction=1 data-var-name='tmplitTest:tmplit.Slider'}}
```

# CSS

Below are the css vars used for styling. These are read into the css properties and are empty by default. If they are null the html uses static default values. See the example on how to populate these variable in an application:

### .tmplit-slider-container
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-slider-container-position |||
| --tmplit-slider-container-border-width |||
| --tmplit-slider-container-border-style |||
| --tmplit-slider-container-border-radius |||
| --tmplit-slider-container-display |||
| --tmplit-slider-container-margin |||
| --tmplit-slider-container-border-color | --md-sys-color-outline-variant ||
| --tmplit-slider-container-background-color | --md-sys-color-surface ||

### .tmplit-slider-bar
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-slider-bar-background-color |||
| --tmplit-slider-bar-cursor |||

```
<style>
    :root {
        --tmplit-slider-bar-background-color: red;
    }
</style>
```

The "md-sys-color-..." vars are intended to be used with material design themes.

## Licensing

This project is licensed under the [MIT License]LICENSE.