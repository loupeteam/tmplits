# TmplitMultiSelect

This is a tmplit for MultiSelect.

Loupe Docs Link: https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs/tmplitcomponents/multiselect.html

# Usage

```
    {{#tmplit 'MultiSelect' maxColumns=10 data-var-name="tmplitTest:tmplit.MultiSelect_INT" data-var-name-field="tmplitTest:tmplit.MultiSelect_STRING"}}
        <options>
            <div>A</div>
            <div>B</div>
            <div>C</div>
            <div>D</div>
        </options>
        {{/tmplit}}
```

# CSS

Below are the css vars used for styling. These are read into the css properties and are empty by default. If they are null the html uses static default values. See the example on how to populate these variable in an application:

### .tmplit-multiselect-item
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-multiselect-item-background-color | --md-sys-color-surface ||
| --tmplit-multiselect-item-border-style |||
| --tmplit-multiselect-item-border-color | --md-sys-color-outline-variant ||
| --tmplit-multiselect-item-border-radius |||
| --tmplit-multiselect-item-padding |||
| --tmplit-multiselect-item-border-width |||
| --tmplit-multiselect-item-cursor |||

### .tmplit-multiselect-item.active
| --tmplit-multiselect-item-background-color | --md-sys-color-secondary ||
| --tmplit-multiselect-item-border-color | --md-sys-color-on-secondary ||

### .tmplit-tableselect-container
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-tableselect-container-width |||
| --tmplit-tableselect-container-position |||
| --tmplit-tableselect-container-display |||
| --tmplit-tableselect-container-border-collapse |||

### .tmplit-tableselect-field
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-tableselect-field-width |||
| --tmplit-tableselect-field-height |||
| --tmplit-tableselect-field-border-width |||
| --tmplit-tableselect-field-border-style |||
| --tmplit-tableselect-field-border-color | --md-sys-color-outline-variant ||
| --tmplit-tableselect-field-border-radius |||
| --tmplit-tableselect-background-color | --md-sys-color-surface ||
| --tmplit-tableselect-color | --md-sys-color-on-surface ||

### .tmplit-tableselect-field:first-child 
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-table-select-field-border-top-right-radius |||
| --tmplit-table-select-field-border-bottom-right-radius |||

### .tmplit-tableselect-button
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-tableselect-button-font-weight |||
| --tmplit-tableselect-button-color | --md-sys-color-on-primary ||
| --tmplit-tableselect-button-background-color | --md-sys-color-primary ||
| --tmplit-tableselect-button-border-width |||
| --tmplit-tableselect-button-border-style |||
| --tmplit-tableselect-button-border-color | --md-sys-color-outline-variant ||
| --tmplit-tableselect-button-border-radius |||
| --tmplit-tableselect-button-padding |||
| --tmplit-tableselect-button-cursor |||

### .tmplit-tableselect-button:last-child
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-table-select-button-border-left |||
| --tmplit-table-select-button-border-top-left-radius |||
| --tmplit-table-select-button-border-bottom-left-radius |||

### table styling
Note: tableselect generates a table form the child elements with a javascript function. Therefore some of the css was applied to classes such as .table>tbody>tr>td which were originally applied by bootstrap. These were duplicated here so the tables look reasonable without bootstrap.

```
<style>
    :root {
        --tmplit-multiselect-item-background-color: green;
    }
</style>
```

The "md-sys-color-..." vars are intended to be used with material design themes.

## Licensing

This project is licensed under the [MIT License]LICENSE.
