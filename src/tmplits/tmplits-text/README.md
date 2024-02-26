# TmplitText

This is a tmplit for texts. The texts can be given a title as the first context and a type as an argument.

Loupe Docs Link: https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs/tmplitcomponents/numerictextfields.html

# Usage

```
{{tmplit 'Text' 'Text Output' type='output' data-var-name='tmplitTest:tmplit.TextOutput'}}
```

# CSS

Below are the css vars used for styling. These are read into the css properties and are empty by default. If they are null the html uses static default values. See the example on how to populate these variable in an application:

### .tmplit-text-container
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-text-container-position |||
| --tmplit-text-container-display |||
| --tmplit-text-container-border-collapse |||

### .tmplit-text-label
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-text-label-border-right |||
| --tmplit-text-label-padding |||
| --tmplit-text-label-font-size |||
| --tmplit-text-label-font-weight |||
| --tmplit-text-label-line-height |||
| --tmplit-text-label-text-align |||
| --tmplit-text-label-border-radius |||
| --tmplit-text-label-width |||
| --tmplit-text-label-white-space |||
| --tmplit-text-label-vertical-align |||
| --tmplit-text-label-display |||
| --tmplit-text-label-border-width |||
| --tmplit-text-label-border-style |||
| --tmplit-text-label-background-color | --md-sys-color-primary ||
| --tmplit-text-label-border-color | --md-sys-color-outline-variant ||
| --tmplit-text-label-color | --md-sys-color-on-primary ||

### .tmplit-text-label:first-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-text-label-border-top-right-radius |||
| --tmplit-text-label-border-bottom-right-radius |||
| --tmplit-text-label-border-right-width |||

### .tmplit-text-label:last-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-text-label-border-top-left-radius |||
| --tmplit-text-label-border-bottom-left-radius |||

### .tmplit-text-field
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-text-field-display |||
| --tmplit-text-field-position |||
| --tmplit-text-field-z-index |||
| --tmplit-text-field-float |||
| --tmplit-text-field-width |||
| --tmplit-text-field-margin-bottom |||
| --tmplit-text-field-height |||
| --tmplit-text-field-padding |||
| --tmplit-text-field-font-size |||
| --tmplit-text-field-line-height |||
| --tmplit-text-field-border-radius |||
| --tmplit-text-field-border-width |||
| --tmplit-text-field-border-style |||
| --tmplit-text-field-background-color | --md-sys-color-surface ||
| --tmplit-text-field-border-color | --md-sys-color-outline-variant ||
| --tmplit-text-field-color | --md-sys-color-on-surface ||

### .tmplit-text-field:last-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-text-field-border-top-left-radius |||
| --tmplit-text-field-border-bottom-left-radius |||

### .tmplit-text-field:first-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-text-field-border-top-right-radius |||
| --tmplit-text-field-border-bottom-right-radius |||
| --tmplit-text-field-border-right-width |||

### .tmplit-text-field:only-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-text-field-border-radius |||
| --tmplit-text-field-border-width |||

```
<style>
    :root {
        --tmplit-text-field-color: blue;
    }
</style>
```

The "md-sys-color-..." vars are intended to be used with material design themes. However the theme can be overriden if assigned to the tmplit-text-field-color for example.

## Licensing

This project is licensed under the [MIT License]LICENSE.