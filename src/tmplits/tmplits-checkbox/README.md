# TmplitCheckbox

This is a tmplit for checkboxes. The checkboxes can be given a title as the first context and a buttonType as an argument.

Loupe Docs Link: https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs/tmplitcomponents/booleantmplit.html

# Usage

```
{{tmplit 'CheckBox' 'Checkbox' buttonType='toggle' data-var-name='tmplitTest:tmplit.Led'}}
```

# CSS

Below are the css vars used for styling. These are read into the css properties and are empty by default. If they are null the html uses static default values. See the example on how to populate these variable in an application:

### .tmplit-checkbox-checked
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-checkbox-checked-color | --md-sys-color-primary ||

### .tmplit-checkbox-unchecked
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-checkbox-unchecked-color | --md-sys-color-on-surface-variant ||

### .tmplit-checkbox-container
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-checkbox-label-display | --md-sys-color-on-surface-variant ||
| --tmplit-checkbox-label-align-items |||
| --tmplit-checkbox-label-border-collapse |||
| --tmplit-checkbox-label-width |||
| --tmplit-checkbox-label-height |||
| --tmplit-checkbox-padding |||
| --tmplit-checkbox-label-border-width |||
| --tmplit-checkbox-label-border-style |||
| --tmplit-checkbox-label-border-radius |||
| --tmplit-checkbox-button-cursor |||
| --tmplit-checkbox-label-user-select |||
| --tmplit-checkbox-label-position |||
| --tmplit-checkbox-label-background-color | --md-sys-color-surface ||
| --tmplit-checkbox-label-border-color | --md-sys-color-outline-variant ||

### .tmplit-checkbox-label
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-checkbox-label-family | --md-sys-color-on-surface-variant ||
| --tmplit-checkbox-label-font-size |||
| --tmplit-checkbox-label-border-collapse |||
| --tmplit-checkbox-label-font-weight |||
| --tmplit-checkbox-label-line-height |||
| --tmplit-checkbox-color | --md-sys-color-on-surface ||

```
<style>
    :root {
        --tmplit-checkbox-checked-color: red;
    }
</style>
```

The "md-sys-color-..." vars are intended to be used with material design themes. However the theme can be overriden if assigned to the tmplit-checkbox-background-color for example.

## Licensing

This project is licensed under the [MIT License]LICENSE.