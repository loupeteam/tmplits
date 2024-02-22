# TmplitButton

This is a tmplit for buttons. The button can be given a title as the first context and a buttonType as an argument.

Loupe Docs Link: https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs/tmplitcomponents/buttons.html

# Usage

```
{{tmplit 'Button' 'Title' buttonType='toggle' data-var-name='tmplitTest:tmplit.Led'}}
```

# CSS

Below are the css vars used for styling. These are read into the css properties and are empty by default. If they are null the html uses static default values. See the example on how to populate these variable in an application:

### .tmplit-button
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-button-display |||
| --tmplit-button-font-weight |||
| --tmplit-button-white-space |||
| --tmplit-button-vertical-align |||
| --tmplit-button-touch-action |||
| --tmplit-button-cursor |||
| --tmplit-button-padding |||
| --tmplit-button-font-size |||
| --tmplit-button-line-height |||
| --tmplit-button-boarder-radius |||
| --tmplit-button-user-select |||
| --tmplit-button-color | --md-sys-color-on-primary ||
| --tmplit-button-background-color | --md-sys-color-primary ||

### .tmplit-button:active
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-button-background-color | --md-sys-color-primary-container ||
| --tmplit-button-color | --md-sys-color-on-primary-container ||

```
<style>
    :root {
        --tmplit-button-vertical-align: left;
    }
</style>
```

The "md-sys-color-..." vars are intended to be used with material design themes. However the theme can be overriden if assigned to the tmplit-button-background-color for example.

## Licensing

This project is licensed under the [MIT License]LICENSE.