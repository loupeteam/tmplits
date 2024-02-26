# TmplitLed

This is a tmplit for Led. The led can be given a title as the first context and a buttonType as an argument.

Loupe Docs Link: https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs/tmplitcomponents/booleantmplit.html

# Usage

```
{{tmplit 'Led' 'Title' data-var-name='tmplitTest:tmplit.Led'}}
```

# CSS

Below are the css vars used for styling. These are read into the css properties and are empty by default. If they are null the html uses static default values. See the example on how to populate these variable in an application:

### .tmplit-led-container
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-led-label-display | --md-sys-color-primary ||
| --tmplit-led-label-align-items |||
| --tmplit-led-label-position |||
| --tmplit-led-label-border-collapse |||
| --tmplit-led-label-width |||
| --tmplit-led-label-height |||
| --tmplit-led-label-border-width |||
| --tmplit-led-label-border-style |||
| --tmplit-led-label-border-radius |||
| --tmplit-led-label-background-color | --md-sys-color-surface ||
| --tmplit-led-label-border-color | --md-sys-color-outline-variant ||

### .tmplit-led-icon
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-led-width |||
| --tmplit-led-height |||
| --tmplit-led-box-shadow |||
| --tmplit-led-display |||
| --tmplit-led-border-radius |||
| --tmplit-led-margin |||
| --tmplit-led-background-color |||

### .tmplit-led-label
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-led-label-font-family |||
| --tmplit-led-label-font-size |||
| --tmplit-led-label-font-weight |||
| --tmplit-led-label-line-height |||
| --tmplit-led-label-color | --md-sys-color-on-surface ||

```
<style>
    :root {
        --tmplit-led-width: 20px;
        --tmplit-led-height: 20px;
    }
</style>
```

The "md-sys-color-..." vars are intended to be used with material design themes. However the theme can be overriden if assigned to the tmplit-led-icon-background-color for example.

## Licensing

This project is licensed under the [MIT License]LICENSE.