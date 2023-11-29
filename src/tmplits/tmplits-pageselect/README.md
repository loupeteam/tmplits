Example Usage:

```handlebars
{{tmplit
  "PageSelect"
  "Page 1: json"
  ctx='{"msg":"hello"}'
  dom="container1"
  template="page1"
}}
{{tmplit
  "PageSelect"
  "Page 2: javascript"
  ctx="this.innerHTML"
  dom="container1"
  template="page2"
}}

<script id="page1" type="text/x-handlebars-template">
    <!-- write your page 2 with normal html -->
    {{msg}} world
</script>

<script id="page2" type="text/x-handlebars-template">
    <!-- write your page 2 with normal html -->
    {{ . }}
</script>

<!--Container to put the page in-->
<div id="container1">
</div>
```

## Licensing

This project is licensed under the [MIT License]LICENSE.
