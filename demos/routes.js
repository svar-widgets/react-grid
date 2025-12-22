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
import FilterSimpleFilterBuilder from './cases/FilterSimpleFilterBuilder.jsx';
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
import TableAPI from './cases/TableAPI.jsx';
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
import ExternalToolbar from './cases/ExternalToolbar.jsx';
import CustomRowHeight from './cases/CustomRowHeight.jsx';


export const links = [
  ['/base/:skin', 'Basic DataGrid', BasicInit, 'BasicInit'],
  [
    '/auto-config/:skin',
    'Automatically generated columns',
    AutoConfigColumns,
    'AutoConfigColumns',
  ],
  [
    '/spans/:skin',
    'Header and footer spans',
    TableHeaderFooterSpans,
    'TableHeaderFooterSpans',
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
  ['/resize/:skin', 'Resize columns', Resize, 'Resize'],
  [
    '/collapsible-columns/:skin',
    'Collapse columns',
    CollapsibleColumns,
    'CollapsibleColumns',
  ],
  [
    '/visibility/:skin',
    'Hide/show columns',
    VisibilityColumns,
    'VisibilityColumns',
  ],
  ['/fixed/:skin', 'Fixed columns', FixedColumns, 'FixedColumns'],
  [
    '/header-vertical/:skin',
    'Vertical text in header',
    TableHeaderFooterVertical,
    'TableHeaderFooterVertical',
  ],

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

  ['/styling/:skin', 'Styling', Styling, 'Styling'],

  ['/multiline-row/:skin', 'Multi-line rows', MultilineRows, 'MultilineRows'],
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

  ['/custom/:skin', 'Custom cells', CustomCells, 'CustomCells'],
  [
    '/embedding-actions/:skin',
    'Custom cell actions',
    CustomEmbedingActions,
    'CustomEmbedingActions',
  ],
  ['/tooltips/:skin', 'Tooltips for data cells', Tooltips, 'Tooltips'],

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
    'Disabled cell inline editors',
    InlineEditorsDisabled,
    'InlineEditorsDisabled',
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

  ['/reordering/:skin', 'Reordering rows', Reordering, 'Reordering'],
  ['/sort/:skin', 'Sort data', Sort, 'Sort'],
  [
    '/sort-custom/:skin',
    'Custom data sorting',
    SortCustom,
    'Custom data sorting',
  ],
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
  ['/filterbar/:skin', 'Filter data with FilterBar', FilterBar, 'FilterBar'],
  [
    '/filterbuilder/:skin',
    'Filter data with FilterBuilder',
    FilterBuilder,
    'FilterBuilder',
  ],
  [
    '/filtered-data/:skin',
    'Filter data before parsing',
    FilterSimpleFilterBuilder,
    'FilterSimpleFilterBuilder',
  ],
  ['/pagination/:skin', 'Pagination', Paging, 'Paging'],

  ['/context/:skin', 'Context menu', ContextMenu, 'ContextMenu'],
  [
    '/custom-context/:skin',
    'Custom context menu',
    CustomContextMenu,
    'CustomContextMenu',
  ],

  ['/overlay/:skin', 'Overlay', Overlay, 'Overlay'],
  ['/hotkeys-custom/:skin', 'Custom Hotkeys', HotkeysCustom, 'HotkeysCustom'],
  ['/bigdata/:skin', 'Render big data', StaticData, 'StaticData'],
  ['/dynamic/:skin', 'Dynamic loading', DynamicData, 'DynamicData'],
  ['/rest/:skin', 'REST backend', RestBackend, 'RestBackend'],

  ['/treetable/:skin', 'Tree structure', TreeTable, 'TreeTable'],


  ['/api/:skin', 'API calls', TableAPI, 'TableAPI'],
  ['/events/:skin', 'Event handling', EventHandling, 'EventHandling'],
  ['/scroll/:skin', 'Scroll by API', ScrollTable, 'ScrollTable'],
  ['/print/:skin', 'Print', Print, 'Print'],
  ['/print-wide/:skin', 'Print wide grid', PrintWideGrid, 'PrintWideGrid'],
  ['/locale/:skin', 'Locales', Localization, 'Localization'],
  ['/undo-redo/:skin', 'Undo/redo', UndoRedo, 'UndoRedo'],
  ['/toolbar/:skin', 'Toolbar', Toolbar],
  ['/toolbar-custom/:skin', 'Toolbar: custom', ToolbarCustom],
  ['/external-toolbar/:skin', 'External Toolbar', ExternalToolbar],
  [
    '/custom-row-height/:skin',
    'Custom row heights',
    CustomRowHeight,
    'CustomRowHeight',
  ],
];
