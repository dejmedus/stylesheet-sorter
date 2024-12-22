<div align="center">
<h1>Stylesheet Sorter</h1>
</div>

Automatically sort CSS properties on save. Use your preferred sort order to keep your stylesheets organized.



## Extension Settings

Custom sort order and categories can be configured in settings.

1. Open settings
   - Click the gear icon in the bottom left corner, or
   - Navigate to `File > Preferences > Settings`
2. Search for "Stylesheet Sorter" in the search bar at the top of the settings window.
3. Modify the settings according to your preferences:
   - `Stylesheet Sorter: Sort Order`: Defines the sort order of categories.
   - `Stylesheet Sorter: Categories`: Group properties by category.

The default sort order is: `Box Model, Grid, Flexbox, Margin and Padding, Border, Width and Height, Typography, Background and Visual, Transformations and Animations, and Other`

Category example:

``` json
"Box Model": [
   "display",
   "position",
   "top",
   "right",
   "bottom",
   "left",
   "z-index",
   "float",
   "clear",
   "box-sizing"
]
```

---

Built with [CSSTree](https://github.com/csstree/csstree)

