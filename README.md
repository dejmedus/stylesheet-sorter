<div align="center">
<h1>CSS Style Sorter</h1>
</div>

Automatically sort CSS properties on save. Use your preferred sort order to keep your stylesheets organized.

## Features

- **Automatic sorting**: CSS properties are sorted upon saving a file.
- **Customizable sort order**: Configure the order properties should be sorted.
- **Flexible categorization**: Properties are grouped into categories for easier sorting.
- Respects editor settings like indent size, collapse/expand brackets, and newlines between rules.
- Can be used alongside formatters like prettier.

 ⚠️ **Limitation: Comments and blank lines in CSS files are removed**

<img width="627" alt="beforeandafter" src="https://github.com/dejmedus/css-style-sorter/assets/59973863/3c79e2f6-81ea-4920-bb11-143bb56d2e6d">

## Extension Settings

Custom sort order and categories can be configured in settings.

1. Open settings
   - Click the gear icon in the bottom left corner, or
   - Press `Ctrl+` (Windows/Linux) / `Cmd+` (Mac).
2. Search for "CSS Style Sorter" in the search bar at the top of the settings window.
3. Modify the settings according to your preferences:
   - `CSS Style Sorter: Sort Order`: Defines the sort order of categories.
   - `CSS Style Sorter: Categories`: Group properties by category.

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

Formatting is based off of editor settings, including:

- Editor: Indent Size
- CSS > Format: Brace Style
- CSS > Format: Newline Between Rules

<!-- ## Release Notes

### 1.0.0

Initial release
-->

## Known Issues

Comments and empty lines are removed during sorting

```css
.beforeSorting {
   /* This comment will be removed */
   color: pink;

   display: grid;
}
.afterSorting {
   display: grid;
   color: pink;
}
```

---

Built with TypeScript & [CSSTree](https://github.com/csstree/csstree)

View the source code on [GitHub](https://github.com/dejmedus/css-style-sorter)
