# TmplitValueUpDown

This is a tmplit for ValueUpDown. It allows incrementing or decrementing of a bound variable with increase or decrease buttons. A value can also be entered by clicking on the numeric field. The increment amount can be specified as an argument. A minimum and maximum value can also be specified as arguments.

Loupe Docs Link: https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs/tmplitcomponents/numerictmplit.html

# Usage

```
{{tmplit 'ValueUpDown' increment=2 min=0 max=100 data-var-name='tmplitTest:tmplit.NumericOutput'}}
```

# CSS

Below are the css vars used for styling. These are read into the css properties and are empty by default. If they are null the html uses static default values. See the example on how to populate these variable in an application:

### .tmplit-valueupdown-container
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-valueupdown-container-display |||
| --tmplit-valueupdown-container-width |||
| --tmplit-valueupdown-container-border-height |||

### .tmplit-valueupdown-button
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-valueupdown-valueupdown-padding |||
| --tmplit-valueupdown-valueupdown-font-size |||
| --tmplit-valueupdown-valueupdown-border-radius |||
| --tmplit-valueupdown-valueupdown-border-width |||
| --tmplit-valueupdown-valueupdown-border-style |||
| --tmplit-valueupdown-valueupdown-cursor |||
| --tmplit-valueupdown-valueupdown-user-select |||
| --tmplit-valueupdown-valueupdown-background-color | --md-sys-color-primary ||
| --tmplit-valueupdown-valueupdown-button-color | --md-sys-color-on-primary ||
| --tmplit-valueupdown-valueupdown-border-color | --md-sys-color-primary ||

### .tmplit-valueupdown-button:active
| --tmplit-valueupdown-valueupdown-background-color | --md-sys-color-primary-container ||
| --tmplit-valueupdown-valueupdown-button-color | --md-sys-color-on-primary-container ||
| --tmplit-valueupdown-valueupdown-border-color | --md-sys-color-primary-container ||

### .tmplit-valueupdown-button:first-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-valueupdown-button-border-top-right-radius |||
| --tmplit-valueupdown-button-border-bottom-right-radius |||

### .tmplit-valueupdown-button:last-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-valueupdown-label-border-top-left-radius |||
| --tmplit-valueupdown-label-border-bottom-left-radius |||

### .tmplit-valueupdown-field
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-valueupdown-field-padding |||
| --tmplit-valueupdown-field-text-align |||
| --tmplit-valueupdown-field-width |||
| --tmplit-valueupdown-field-font-size |||
| --tmplit-valueupdown-field-font-weight |||
| --tmplit-valueupdown-field-border-width |||
| --tmplit-valueupdown-field-border-style |||
| --tmplit-valueupdown-field-border-color | --md-sys-color-outline-variant ||
| --tmplit-valueupdown-field-outline-radius |||
| --tmplit-valueupdown-field-background-color | --md-sys-color-surface ||
| --tmplit-valueupdown-field-color | --md-sys-color-on-surface ||

```
<style>
    :root {
        --tmplit-valueupdown-field-color: blue;
    }
</style>
```

The "md-sys-color-..." vars are intended to be used with material design themes. However the theme can be overriden if assigned to the tmplit-valueupdown-field-color for example.

## Licensing

This project is licensed under the [MIT License]LICENSE.