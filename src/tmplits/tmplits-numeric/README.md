# TmplitNumeric

This is a tmplit for numerics. The numerics can be given a title as the first context and a type as an argument.

Loupe Docs Link: https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs/tmplitcomponents/numerictextfields.html

# Usage

```
{{tmplit 'Numeric' 'Numeric Output' type='output' data-var-name='tmplitTest:tmplit.NumericOutput'}}
```

# CSS

Below are the css vars used for styling. These are read into the css properties and are empty by default. If they are null the html uses static default values. See the example on how to populate these variable in an application:

### .tmplit-numeric-container
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-numeric-container-position |||
| --tmplit-numeric-container-display |||
| --tmplit-numeric-container-border-collapse |||

### .tmplit-numeric-label
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-numeric-label-border-right |||
| --tmplit-numeric-label-padding |||
| --tmplit-numeric-label-font-size |||
| --tmplit-numeric-label-font-weight |||
| --tmplit-numeric-label-line-height |||
| --tmplit-numeric-label-text-align |||
| --tmplit-numeric-label-border-radius |||
| --tmplit-numeric-label-width |||
| --tmplit-numeric-label-white-space |||
| --tmplit-numeric-label-vertical-align |||
| --tmplit-numeric-label-display |||
| --tmplit-numeric-label-border-width |||
| --tmplit-numeric-label-border-style |||
| --tmplit-numeric-label-background-color | --md-sys-color-primary ||
| --tmplit-numeric-label-border-color | --md-sys-color-outline-variant ||
| --tmplit-numeric-label-color | --md-sys-color-on-primary ||

### .tmplit-numeric-label:first-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-numeric-label-border-top-right-radius |||
| --tmplit-numeric-label-border-bottom-right-radius |||
| --tmplit-numeric-label-border-right-width |||

### .tmplit-numeric-label:last-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-numeric-label-border-top-left-radius |||
| --tmplit-numeric-label-border-bottom-left-radius |||

### .tmplit-numeric-field
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-numeric-field-display |||
| --tmplit-numeric-field-position |||
| --tmplit-numeric-field-z-index |||
| --tmplit-numeric-field-float |||
| --tmplit-numeric-field-width |||
| --tmplit-numeric-field-margin-bottom |||
| --tmplit-numeric-field-height |||
| --tmplit-numeric-field-padding |||
| --tmplit-numeric-field-font-size |||
| --tmplit-numeric-field-line-height |||
| --tmplit-numeric-field-border-radius |||
| --tmplit-numeric-field-border-width |||
| --tmplit-numeric-field-border-style |||
| --tmplit-numeric-field-background-color | --md-sys-color-surface ||
| --tmplit-numeric-field-border-color | --md-sys-color-outline-variant ||
| --tmplit-numeric-field-color | --md-sys-color-on-surface ||

### .tmplit-numeric-field:last-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-numeric-field-border-top-left-radius |||
| --tmplit-numeric-field-border-bottom-left-radius |||

### .tmplit-numeric-field:first-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-numeric-field-border-top-right-radius |||
| --tmplit-numeric-field-border-bottom-right-radius |||
| --tmplit-numeric-field-border-right-width |||

### .tmplit-numeric-field:only-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-numeric-field-border-radius |||
| --tmplit-numeric-field-border-width |||

```
<style>
    :root {
        --tmplit-numeric-field-color: blue;
    }
</style>
```

The "md-sys-color-..." vars are intended to be used with material design themes. However the theme can be overriden if assigned to the tmplit-numeric-field-color for example.

## Licensing

This project is licensed under the [MIT License]LICENSE.