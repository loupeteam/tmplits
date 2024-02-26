# TmplitTable

This is a container tmplit for TmplitTableRows. It can be given a title as the first context.

<img src="example.png" width="400">

# Usage

```
{{#tmplit 'Table' 'Inputs'}}
        {{#tmplit 'TableRow'}}
            <span>Channel</span>
            <span>Description</span>
            <span>Status</span>
        {{/tmplit}}
        {{#tmplit 'TableRow'}}
            <span>Ch 0</span>
            <span>This is an example of a digital input</span>
            {{tmplit 'Led' data-var-name='tmplitTest:tmplit.SetButton'}}
        {{/tmplit}}
        {{#tmplit 'TableRow'}}
            <span>Ch 1</span>
            <span>This is an example of a analog input</span>
            {{tmplit 'Numeric' data-var-name='tmplitTest:tmplit.NumericOutput'}}
        {{/tmplit}}
        {{#tmplit 'TableRow'}}
            <span>Ch 2</span>
            <span>Description</span>
            {{tmplit 'Numeric' data-var-name='tmplitTest:tmplit.NumericOutput'}}
        {{/tmplit}}
        {{#tmplit 'TableRow'}}
            <span>Ch 3</span>
            <span>Description</span>
            {{tmplit 'Led' data-var-name='tmplitTest:tmplit.SetButton'}}
        {{/tmplit}}
        {{#tmplit 'TableRow'}}
            <span>Ch 4</span>
            <span>Description</span>
            {{tmplit 'Led' data-var-name='tmplitTest:tmplit.SetButton'}}
        {{/tmplit}}
        {{#tmplit 'TableRow'}}
            <span>Ch 5</span>
            <span>Description</span>
            {{tmplit 'Led' data-var-name='tmplitTest:tmplit.SetButton'}}
        {{/tmplit}}
        {{#tmplit 'TableRow'}}
            <span>Ch 6</span>
            <span>Description</span>
            {{tmplit 'Led' data-var-name='tmplitTest:tmplit.SetButton'}}
        {{/tmplit}}
        {{#tmplit 'TableRow'}}
            <span>Ch 7</span>
            <span>Description</span>
            {{tmplit 'Led' data-var-name='tmplitTest:tmplit.SetButton'}}
        {{/tmplit}}
    {{/tmplit}}
```

# CSS

Below are the css vars used for styling. These are read into the css properties and are empty by default. If they are null the html uses static default values. See the example on how to populate these variable in an application:

### Table Header
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-table-header-font-size | --md-sys-typescale-title-large-font-size ||
| --tmplit-table-header-font-weight |||
| --tmplit-table-header-padding |||
| --tmplit-table-header-text-align |||
| --tmplit-table-header-color | --md-sys-color-on-surface ||
| --tmplit-table-header-background-color | --md-sys-color-surface-container ||

### Table
| Tmplit Token | Material Design Token | Comment |
| ------------ | --------------------- | ------- |
| --tmplit-table-grid-template-columns || sets the relative spacing of the columns (i.e. 3 columns = 1fr 4fr 1fr ). To increase the column count above 10, change the TmplitTableRow's grid-column propery (defaults to 1 /10 i.e. 10 columns)|
| --tmplit-table-padding |||
| --tmplit-table-text-align |||
| --tmplit-table-grid-template-rows || sets the height of each row (overall height may need to be increased as well) |
| --tmplit-table-height || height of the table needs to exceed rowHeight*numberOfRows or there will be scrollbars |
| --tmplit-table-background-color | --md-sys-color-surface-container ||

```
<style>
    :root {
        --tmplit-table-header-font-size: 70px;
    }
</style>
```

The "md-sys-color-..." vars are intended to be used with material design themes. However the theme can be overriden if assigned to the tmplit-table-background-color for example.

## Licensing

This project is licensed under the [MIT License]LICENSE.

