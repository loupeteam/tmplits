## Information

The actions object uses tmplits-pageselect.  See https://loupeteam.github.io/LoupeDocs/libraries/tmplitdocs/tmplitcomponents/pagelayout.html for more information.  

label, template, actions, class, footerContent, defaultMainScreen are the attributes from user.

There are 4 layouts with 4 different navigation bar locations:
1. tmplit-basic-layout-left-nav
2. tmplit-basic-layout-right-nav
3. tmplit-basic-layout-top-nav
4. tmplit-basic-layout-bot-nav

## Example: 
```handlebars
{{#> tmplit-basic-layout-top-nav
    defaultMainScreen='testComponents'
    actions=(obj '[
        {label:"<img src=\"app/assets/logo.png\" />", template:"testComponents"},
        {label:"Components Test", template:"testComponents"},
        {label:"OpenBridge Demo", template:"OpenBridge"}
        ]')
}}
{{/tmplit-basic-layout-top-nav}}
```


```css
    /* Nav Bar */
    /* Left/ Right Nav Bar */
    --navBar-minwidth: 10%;
    --navBar-maxwidth: 20%;

    /* Top/ Bottom Nav Bar */
    --navBar-minheight: 10%;
    --navBar-maxheight: 20%;

    --navBar-item-padding: 0 0 0 0;
    --navBar-item-margin: 0 0 0 0;
    --navBar-item-color: none;
    --navBar-text-align: center;
    --navBar-img-width: 70%;
    --navBar-background-color: rgb(230, 230, 230);

    /* Main Content */
    --screen-item-color: none;
    --screen-text-align: left;
    --screen-background-color: rgb(230, 230, 230);

    /* Footer */
    --footer-height: 5%;
    --footer-content-float: left;
    --footer-content-margin: 0 0 0 0;
    --footer-content-padding: 0 0 0 15px;
    --footer-opacity: 70%;
    --footer-background-color: rgb(153, 150, 150);
```
## Licensing

This project is licensed under the [MIT License]LICENSE.

