import { useContext } from 'react';
import storeContext from '../../context';
import {
  getRenderValue,
  getHeaderFooterPrintColumns,
  getPrintCellStyle,
} from '@svar-ui/grid-store';
import HeaderFooter from './HeaderFooter.jsx';
import './Grid.css';
import { styleObject } from '@svar-ui/lib-react';

export default function Grid(props) {
  const { columns, rowStyle, columnStyle, cellStyle, header, footer, reorder } =
    props;

  const api = useContext(storeContext);
  const { flatData: data, _sizes: sizes } = api.getState();

  const headerColumns =
    header &&
    getHeaderFooterPrintColumns(columns, 'header', sizes.headerRowHeights);
  const footerColumns =
    footer &&
    getHeaderFooterPrintColumns(columns, 'footer', sizes.footerRowHeights);

  function buildCellCss(row, column) {
    let css = '';
    css += columnStyle ? ' ' + columnStyle(column) : '';
    css += cellStyle ? ' ' + cellStyle(row, column) : '';
    return css;
  }

  function isDraggableIcon(row, column) {
    return typeof column.draggable === 'function'
      ? column.draggable(row, column) !== false
      : column.draggable;
  }

  return (
    <table
      className={`wx-8NTMLH0z wx-print-grid ${columns.some((c) => c.flexgrow) ? 'wx-flex-columns' : ''}`}
    >
      {header ? (
        <thead>
          <HeaderFooter
            columns={headerColumns}
            type={'header'}
            columnStyle={columnStyle}
          />
        </thead>
      ) : null}

      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={
              'wx-8NTMLH0z wx-row' + (rowStyle ? ' ' + rowStyle(row) : '')
            }
            style={{ height: `${row.rowHeight || sizes.rowHeight}px` }}
          >
            {columns.map((column) =>
              !column.collapsed ? (
                <td
                  key={column.id}
                  className={`wx-8NTMLH0z wx-print-cell wx-cell ${buildCellCss(row, column)}`}
                  style={styleObject(
                    getPrintCellStyle(column, sizes.columnWidth),
                  )}
                >
                  {reorder && column.draggable ? (
                    <span className="wx-8NTMLH0z wx-print-draggable">
                      {isDraggableIcon(row, column) ? (
                        <i className="wx-8NTMLH0z wxi-drag"></i>
                      ) : null}
                    </span>
                  ) : null}
                  {column.treetoggle ? (
                    <>
                      <span
                        style={{ marginLeft: row.$level * 28 + 'px' }}
                      ></span>
                      {row.$count ? (
                        <i
                          className={
                            'wx-8NTMLH0z wx-print-grid-tree-toggle ' +
                            `wxi-menu-${row.open !== false ? 'down' : 'right'}`
                          }
                        ></i>
                      ) : null}
                    </>
                  ) : null}
                  {column.cell ? (
                    (() => {
                      const CellComp = column.cell;
                      return <CellComp api={api} row={row} column={column} />;
                    })()
                  ) : (
                    <span>{getRenderValue(row, column)}</span>
                  )}
                </td>
              ) : null,
            )}
          </tr>
        ))}
      </tbody>

      {footer ? (
        <tfoot>
          <HeaderFooter
            columns={footerColumns}
            type={'footer'}
            columnStyle={columnStyle}
          />
        </tfoot>
      ) : null}
    </table>
  );
}
