import AutoConfigColumns from './cases/AutoConfigColumns.jsx';
import BasicInit from './cases/BasicInit.jsx';
import CollapsibleColumns from './cases/CollapsibleColumns.jsx';
import ColumnsToContent from './cases/ColumnsToContent.jsx';
import ContextMenu from './cases/ContextMenu.jsx';
import CustomCells from './cases/CustomCells.jsx';
import CustomContextMenu from './cases/CustomContextMenu.jsx';
import CustomEmbedingActions from './cases/CustomEmbedingActions.jsx';
import DynamicData from './cases/DynamicData.jsx';
import EventHandling from './cases/EventHandling.jsx';
import ExternalEditor from './cases/ExternalEditor.jsx';
import ExternalEditorComments from './cases/ExternalEditorComments.jsx';
import ExternalEditorTasklist from './cases/ExternalEditorTasklist.jsx';
import FillspaceColumns from './cases/FillspaceColumns.jsx';
import FilterBar from './cases/FilterBar.jsx';
import FilterBuilder from './cases/FilterBuilder.jsx';
import FilterQuery from './cases/FilterQuery.jsx';
import Filters from './cases/Filters.jsx';
import FiltersCustom from './cases/FiltersCustom.jsx';
import FiltersCustomHandler from './cases/FiltersCustomHandler.jsx';
import ExternalFilters from './cases/ExternalFilters.jsx';
import FixedColumns from './cases/FixedColumns.jsx';
import InlineEditors from './cases/InlineEditors.jsx';
import InlineEditorsCells from './cases/InlineEditorsCells.jsx';
import InlineEditorsHandler from './cases/InlineEditorsHandler.jsx';
import InlineEditorsDisabled from './cases/InlineEditorsDisabled.jsx';
import MultilineRows from './cases/MultilineRows.jsx';
import Overlay from './cases/Overlay.jsx';
import HotkeysCustom from './cases/HotkeysCustom.jsx';
import Paging from './cases/Paging.jsx';
import Resize from './cases/Resize.jsx';
import Reordering from './cases/Reordering.jsx';
import RestBackend from './cases/RestBackend.jsx';
import RowMultiSelection from './cases/RowMultiSelection.jsx';
import RowSelection from './cases/RowSelection.jsx';
import ResponsiveMode from './cases/ResponsiveMode.jsx';
import ScrollTable from './cases/ScrollTable.jsx';
import SelectionCheckboxes from './cases/SelectionCheckboxes.jsx';
import SizeToContainer from './cases/SizeToContainer.jsx';
import SizeToContent from './cases/SizeToContent.jsx';
import Sort from './cases/Sort.jsx';
import SortCustom from './cases/SortCustom.jsx';
import StaticData from './cases/StaticData.jsx';
import Styling from './cases/Styling.jsx';
import TableHeaderFooterSpans from './cases/TableHeaderFooterSpans.jsx';
import TableHeaderFooterVertical from './cases/TableHeaderFooterVertical.jsx';
import Tooltips from './cases/Tooltips.jsx';
import VisibilityColumns from './cases/VisibilityColumns.jsx';
import Localization from './cases/Localization.jsx';
import TreeTable from './cases/TreeTable.jsx';
import Print from './cases/Print.jsx';
import PrintWideGrid from './cases/PrintWideGrid.jsx';
import UndoRedo from './cases/UndoRedo.jsx';
import Toolbar from './cases/Toolbar.jsx';
import ToolbarCustom from './cases/ToolbarCustom.jsx';
import CustomRowHeight from './cases/CustomRowHeight.jsx';
import ExportCSV from './cases/ExportCSV.jsx';


export const links = [
  ['/base/:skin', 'Basic DataGrid', BasicInit, 'BasicInit'],
  ['/bigdata/:skin', 'Render big data', StaticData, 'StaticData'],

  { group: 'Columns' },
  [
    '/auto-config/:skin',
    'Automatically generated columns',
    AutoConfigColumns,
    'AutoConfigColumns',
  ],
  [
    '/fillspace/:skin',
    'Flexible column widths',
    FillspaceColumns,
    'FillspaceColumns',
  ],
  [
    '/columns-to-content/:skin',
    'Column widths to content',
    ColumnsToContent,
    'ColumnsToContent',
  ],
  ['/fixed/:skin', 'Pinned columns', FixedColumns, 'FixedColumns'],
  ['/resize/:skin', 'Resize columns', Resize, 'Resize'],
  [
    '/visibility/:skin',
    'Hide/show columns',
    VisibilityColumns,
    'VisibilityColumns',
  ],
  [
    '/collapsible-columns/:skin',
    'Collapse columns',
    CollapsibleColumns,
    'CollapsibleColumns',
  ],
  [
    '/spans/:skin',
    'Spans in header and footer',
    TableHeaderFooterSpans,
    'TableHeaderFooterSpans',
  ],
  [
    '/header-vertical/:skin',
    'Vertical text in header',
    TableHeaderFooterVertical,
    'TableHeaderFooterVertical',
  ],

  { group: 'Cells' },
  ['/custom/:skin', 'Custom cells', CustomCells, 'CustomCells'],
  [
    '/embedding-actions/:skin',
    'Custom cell actions',
    CustomEmbedingActions,
    'CustomEmbedingActions',
  ],
  ['/tooltips/:skin', 'Tooltips', Tooltips, 'Tooltips'],
  ['/editors/:skin', 'Cell editors', InlineEditors, 'InlineEditors'],
  [
    '/editors-custom/:skin',
    'Custom cell editors',
    InlineEditorsCells,
    'InlineEditorsCells',
  ],
  [
    '/editors-different/:skin',
    'Different editors in a column',
    InlineEditorsHandler,
    'InlineEditorsHandler',
  ],
  [
    '/editors-disabled/:skin',
    'Disabled cell editors',
    InlineEditorsDisabled,
    'InlineEditorsDisabled',
  ],

  { group: 'Rows' },
  ['/selection/:skin', 'Row selection', RowSelection, 'RowSelection'],
  [
    '/multi-selection/:skin',
    'Multiple row selection',
    RowMultiSelection,
    'RowMultiSelection',
  ],
  [
    '/check-selection/:skin',
    'Selection with checkboxes',
    SelectionCheckboxes,
    'SelectionCheckboxes',
  ],
  [
    '/custom-row-height/:skin',
    'Custom row heights',
    CustomRowHeight,
    'CustomRowHeight',
  ],
  ['/multiline-row/:skin', 'Auto row heights', MultilineRows, 'MultilineRows'],
  ['/reordering/:skin', 'Reordering rows', Reordering, 'Reordering'],
  ['/treetable/:skin', 'Tree rows', TreeTable, 'TreeTable'],

  { group: 'Data operations' },
  ['/filters/:skin', 'Filters', Filters, 'Filters'],
  ['/filters-custom/:skin', 'Filter settings', FiltersCustom, 'FiltersCustom'],
  [
    '/filters-handler/:skin',
    'Filters with custom handler',
    FiltersCustomHandler,
    'FiltersCustomHandler',
  ],
  [
    '/filters-external/:skin',
    'External filters',
    ExternalFilters,
    'ExternalFilters',
  ],
  ['/filterbar/:skin', 'Integration with FilterBar', FilterBar, 'FilterBar'],
  [
    '/filterbuilder/:skin',
    'Integration with FilterBuilder',
    FilterBuilder,
    'FilterBuilder',
  ],
  [
    '/filterquery/:skin',
    'Integration with FilterQuery',
    FilterQuery,
    'FilterQuery',
  ],
  ['/sort/:skin', 'Sort data', Sort, 'Sort'],
  [
    '/sort-custom/:skin',
    'Sort data with custom functions',
    SortCustom,
    'Custom data sorting',
  ],
  ['/pagination/:skin', 'Pagination', Paging, 'Paging'],
  ['/undo-redo/:skin', 'Undo/redo', UndoRedo, 'UndoRedo'],
  ['/events/:skin', 'Action handlers', EventHandling, 'EventHandling'],

  { group: 'UI / Interactions' },
  ['/toolbar/:skin', 'Toolbar: built-in', Toolbar],
  ['/toolbar-custom/:skin', 'Toolbar: custom', ToolbarCustom],
  ['/context/:skin', 'Context menu: built-in', ContextMenu, 'ContextMenu'],
  [
    '/custom-context/:skin',
    'Context menu: custom',
    CustomContextMenu,
    'CustomContextMenu',
  ],
  ['/editpanel/:skin', 'Editor', ExternalEditor, 'ExternalEditor'],
  [
    '/editpanel-comments/:skin',
    'Editor with Comments',
    ExternalEditorComments,
    'ExternalEditorComments',
  ],
  [
    '/editpanel-tasklist/:skin',
    'Editor with Tasklist',
    ExternalEditorTasklist,
    'ExternalEditorTasklist',
  ],
  ['/hotkeys-custom/:skin', 'Custom hotkeys', HotkeysCustom, 'HotkeysCustom'],
  ['/scroll/:skin', 'Scrolling', ScrollTable, 'ScrollTable'],

  { group: 'Load & Save' },
  ['/dynamic/:skin', 'Dynamic loading', DynamicData, 'DynamicData'],
  ['/rest/:skin', 'REST backend', RestBackend, 'RestBackend'],
  ['/export-csv/:skin', 'Export to CSV', ExportCSV, 'ExportCSV'],
  ['/print/:skin', 'Print', Print, 'Print'],
  ['/print-wide/:skin', 'Print: wide DataGrid', PrintWideGrid, 'PrintWideGrid'],


  { group: 'Appearance' },
  ['/styling/:skin', 'Styling', Styling, 'Styling'],
  [
    '/size-container/:skin',
    'Size to container',
    SizeToContainer,
    'SizeToContainer',
  ],
  ['/size-content/:skin', 'Size to content', SizeToContent, 'SizeToContent'],
  [
    '/responsive-mode/:skin',
    'Responsive mode',
    ResponsiveMode,
    'ResponsiveMode',
  ],
  ['/overlay/:skin', 'Overlay', Overlay, 'Overlay'],
  ['/locale/:skin', 'Locales', Localization, 'Localization'],
];
