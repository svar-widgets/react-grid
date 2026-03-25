<div align="center">
	
# SVAR React DataGrid | Data Table

[Website](https://svar.dev/react/datagrid/) • [Getting Started](https://docs.svar.dev/react/grid/getting_started/) • [Demos](https://docs.svar.dev/react/grid/samples/)

[![npm](https://img.shields.io/npm/v/@svar-ui/react-grid.svg)](https://www.npmjs.com/package/@svar-ui/react-grid)
[![License](https://img.shields.io/github/license/svar-widgets/react-grid)](https://github.com/svar-widgets/react-grid/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-grid.svg)](https://www.npmjs.com/package/@svar-ui/react-grid)

</div>

[SVAR React DataGrid](https://svar.dev/react/datagrid/) is a ready-to-use component that helps you integrate feature-rich and lightning-fast data tables into React apps. It efficiently handles large datasets and supports virtual scrolling, in-cell editing, sorting, filtering, and full customization to fit complex projects.

Built as a pure React component (no wrappers), it integrates naturally with modern React apps and includes full TypeScript support. The data grid supports responsive layouts, light and dark themes, and is compatible with React 18 and 19.

<div align="center">
  <img src="https://svar.dev/images/github/github-grid.png" alt="SVAR React DataGrid - Examples" width="700">
</div>

### :sparkles: Key Features

**Handling large datasets**
-   Virtual scrolling (rows and columns)
-   Dynamic data loading
-   Paging

**Data editing**
-   In-cell editing with different cell editors (datepicker, combo, select, rich select)
-   External editor for grid data
-   Custom in-cell editors
-   Context menu and toolbar
-   Undo/redo

**Columns**
-   Multi-column sorting
-   Frozen columns
-   Expandable/collapsible columns
-   Hide/show columns
-   Auto-sizing based on content

**Rows**
-   Row reordering with drag-and-drop
-   Tree data
-   Auto-sizing to content

**Cells**
-   Custom HTML content
-   Tooltips

**Filtering**
-   Built-in column filters
-   External filter controls
-   Advanced query builder (with [SVAR React Filter](https://github.com/svar-widgets/react-filter))
-   Structured queries & natural language (with [SVAR React Filter](https://github.com/svar-widgets/react-filter))

**Accessibility**
-   Keyboard navigation
-   [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) compliant

**Data & export**
-   Print support
-   Export to CSV
-   RestDataProvider for easy backend data binding

### :hammer_and_wrench: How to Use

Install SVAR React DataGrid via npm:

```bash
npm install @svar-ui/react-grid
```

Import the package and include the data grid component in your React file:

```jsx
import { Grid } from "@svar-ui/react-grid";
import "@svar-ui/react-grid/all.css"; // required styles

const data = [
  {
    id: 1,
    email: "Leora13@yahoo.com",
    firstName: "Ernest",
    lastName: "Schuppe",
  },
  {
    id: 2,
    email: "Mose_Gerhold51@yahoo.com",
    firstName: "Janis",
    lastName: "Vandervort",
  },
];

const columns = [
  {
    id: "id",
    width: 50,
  },
  {
    id: "firstName",
    header: "First Name",
    footer: "First Name",
    width: 150,
  },
  {
    id: "lastName",
    header: "Last Name",
    footer: "Last Name",
    width: 150,
  },
];

export default function App() {
  return <Grid data={data} columns={columns} />;
}
```

See the [getting started guide](https://docs.svar.dev/react/grid/getting_started/) to quickly set up and begin using SVAR React DataGrid component in your React projects.

### :speech_balloon: Need Help?

[Post an Issue](https://github.com/svar-widgets/react-grid/issues/) or use our [community forum](https://forum.svar.dev).

### ⭐ Show Your Support

If SVAR React DataGrid helps your project, give us a star [on GitHub](https://github.com/svar-widgets/react-grid/)! It helps more developers discover this component and keeps our team motivated to ship new features.
