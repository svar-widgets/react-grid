## 2.7.0

### New features

- Multi-select filter for Grid columns
- Scroll-to action to force and listen to scroll movements

### Updates

- Extra Tooltip settings: arrow, delay, at, overlow, etc
- Ability to set input type for "text" editor

### Fixes

- Closing an inline editor by clicking on another cell doesn't focus the cell clicked
- Incorrect type for header cells
- Columns flicker when a new row is added in a Grid with flexgrow
- Incorrect type for `filterValues`
- Multiselect editor value is not applied

### Breaking changes

- Parameters of Tooltip content component changed from `{ row, column }` to `{ data: row, column } `

## 2.6.1

### Fixes

- Impossible to configure inline editor dropdown
- Inline editor dropdown is detached during scroll
- Editor state object is mutated instead of being reset
- DataProvider adds trailing slash to getData url
- Inline filters throw the error upon initialization

## 2.6.0

### New features

- Multiselect inline editor
- Ability to register custom inline editors

### Updates

- Integration with FilterQuery

### Fixes

- Dropdown editors are cut off in small tables
- DataGrid fails to initialize in SvelteKit with serverside rendering
- Items with string ids fail in some operations
- Multiple sorting and selection does not work on MacOs
- Error in fetching Typescript definitions from store
- API `ref` is not recognized in Typescript projects
- Select editors: random rows are selected on value change
- Datepicker editor: clicking on dates outside this month set the incorrect date

## Version 2.5.2

### Fixes

- Checkboxes within cells are not clickable

## Version 2.5.1

### New features

- Export to CSV

### Fixes

- Text filtering fails for numeric values
- Sourcemap included

## Version 2.4

### New features

- Toolbar for common operations
- Ability to define custom row height
- Ability to provide a custom function for sorting rows

### Updates

- Extra options for ContextMenu: Copy/Cut/Paste, Move up and down

### Fixes

- Switching ContextMenu locale
- Correct triggers for select and focus action
- Print view contains initial HTML
- Performance enhancements

## Version 2.3

### New features

- TypeScript definitions

### Updates

- The package migrated from `wx-react-grid` to `@svar-ui/react-grid`

### Fixes

- Default locale is not applied to ContextMenu

## Version 2.2

### New features

- Undo/redo for data and column actions
- Ability to tune responsive behaviour
- Dynamic inline editors for column cells
- Integration with SVAR Filter

### Updates

- Non-persistent filtering: table is not re-filtered on data changes

### Fixes

- Inline "date" editor is not closed on Enter key
- Shift+tab hotkey makes extra step with inline editors
- Enter hotkey calls "open-row" action for non-branches in `tree` mode
- Changing any property reverts data in `tree` mode

### Breaking changes

- `sort` state property renamed to `sortMarks`

## Version 2.1.5

### Fixes

- Resize observer error in corner cases

## Version 2.1.4

### Fixes

- Filters are cleared when other properties change
- Regression in paddings of collapsible columns

## Version 2.1.3

### Fixes

- Regression with table borders

## Version 2.1.2

### Fixes

- Up/down navigation on dynamic data: selected node hides under header/footer
- Incorrect position of sort markers when sorting by multiple columns
- Fully collapsed columns invoke unneeded scrollbars

## Version 2.1.1

### Fixes

- Data with empty fields is filtered out when filters are cleared
- Column sorting should use `getter` to get the field value

## Version 2.1

### New features

- Accessibility: compatibility with WAI-ARIA standard
- Built-in filters in header
- Row reordering via drag-n-drop
- Print support
- Focus management API
- Custom content for header and footer cells
- Ability to integrate an external Editor

### Updates

- Improved key navigation
- Extra parameters to filter-rows action
- Custom content for combo editor options
- Clickable vertical overlay for fully collapsed columns

### Fixes

- HeaderMenu breaks scrolling
- Richselect editor dropdown goes over footer
- Tree node marker is not changed when opening and closing

### Breaking changes

- `handler` parameter renamed to `filter` for the `filter-rows` action
- `colWidth` parameter renamed to `columnWidth` for the `sizes` property
- `rowsCount` and `colsCount` parameters renamed to `rowCount` and `columnCount` for the `dynamic`
- `col` renamed to `column` for `props` received by custom cell content
- No need to import and use `Cell` when embedding custom components

## Version 2.0

- Full functionality of Svelte DataGrid
- `data-request` action renamed to `request-data`
- `selected` property removed

## Version 1.3.2

### Updates

- Using React Core v1.3.1

### Fixes

- Editors in the tree mode are not applied correctly
- TypeScript definitions are not precise

## Version 1.3.0

### Updates

- Released under MIT
- A more convenient way of using the built-in and external ContextMenu
- Using React Core v1.3.0

## Version 1.2.4

### Updates

- Using React Core v1.2.4

### Fixes

- DataProvider package is not compatible with toolchain

## Version 1.2.3

- Using React Core v1.2.3

## Version 1.2.0

### Updates

- `flatData` state property added
- Using core 1.2.x

### Fixes

- Column auto-sizing for the tree structure improved
- Column auto-sizing and sorting markers

## Version 1.1.3

### Updates

- For a column with header spans, sorting marker is only shown for the last (lowest) header span

### Fixes

- Sorting for hierarchical datasets
- The column auto-size for the tree structure
- Resizing columns with flex-grow
- Text overflow for vertical headers
- Impossible to define the initial selection
- Table editor doesn't reflect changes in the related state properties
- Error after collapsing the first column in the table

## Version 1.0.0

Initial version released
