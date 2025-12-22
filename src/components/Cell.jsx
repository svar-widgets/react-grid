import { useEffect, useMemo, useRef, useContext, useCallback } from 'react';
import storeContext from '../context';
import { useStore } from '@svar-ui/lib-react';
import { useWritableProp } from '@svar-ui/lib-react';
import { getStyle } from '../helpers/columnWidth';
import { getRenderValue } from '@svar-ui/grid-store';
import './Cell.css';

export default function Cell(props) {
  const {
    row,
    column,
    cellStyle = null,
    columnStyle = null,
    children,
  } = props;

  const [focusable, setFocusable] = useWritableProp(props.focusable);

  const api = useContext(storeContext);
  const focusCell = useStore(api, 'focusCell');
  const search = useStore(api, 'search');
  const reorder = useStore(api, 'reorder');

  const shouldHighlight = useMemo(
    () => search?.rows[row.id] && search.rows[row.id][column.id],
    [search, row.id, column.id],
  );

  const style = useMemo(
    () =>
      getStyle(
        column.width,
        column.flexgrow,
        column.fixed,
        column.left,
        column.right,
      ),
    [column.width, column.flexgrow, column.fixed, column.left, column.right],
  );

  function buildCellCss(columnStyleFn, cellStyleFn) {
    let css = 'wx-cell';
    css += column.fixed
      ? ' ' + (column.fixed === -1 ? 'wx-shadow' : 'wx-fixed')
      : '';
    css += columnStyleFn ? ' ' + columnStyleFn(column) : '';
    css += cellStyleFn ? ' ' + cellStyleFn(row, column) : '';
    css += column.treetoggle ? ' wx-tree-cell' : '';
    return css;
  }

  const css = useMemo(
    () => buildCellCss(columnStyle, cellStyle),
    [columnStyle, cellStyle, column, row],
  );

  const isDraggable = useMemo(() => {
    return typeof column.draggable === 'function'
      ? column.draggable(row, column) !== false
      : column.draggable;
  }, [column, row]);

  const cellElRef = useRef(null);

  useEffect(() => {
    if (cellElRef.current && focusable) {
      const needFocus =
        focusCell?.row === row.id && focusCell?.column === column.id;
      if (needFocus) cellElRef.current.focus();
    }
  }, [focusCell, focusable, row.id, column.id]);

  const toggleFocusAction = useCallback(() => {
    if (focusable && !focusCell) {
      api.exec('focus-cell', {
        row: row.id,
        column: column.id,
        eventSource: 'focus',
      });
    }
  }, [api, focusable, focusCell, row.id, column.id]);

  useEffect(() => {
    return () => {
      if (focusable && focusCell) {
        api.exec('focus-cell', { eventSource: 'destroy' });
        setFocusable(false);
      }
    };
  }, [api, setFocusable]);

  function highlightText(text) {
    const regex = new RegExp(`(${search.value.trim()})`, 'gi');
    const parts = String(text).split(regex);

    return parts.map((text) => ({ text, highlight: regex.test(text) }));
  }

  const className = useMemo(() => {
    const shadowToggle =
      (column.fixed && column.fixed.left === -1) || column.fixed.right === -1;
    const fixedRightToggle = column.fixed && column.fixed.right;
    return [
      css,
      shadowToggle ? 'wx-shadow' : '',
      fixedRightToggle ? 'wx-fixed-right' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }, [css, column]);

  const CellComponent = column.cell;

  return (
    <div
      className={'wx-TSCaXsGV ' + className}
      ref={cellElRef}
      onFocus={toggleFocusAction}
      style={style}
      data-row-id={row.id}
      data-col-id={column.id}
      tabIndex={focusable ? '0' : '-1'}
      role={'gridcell'}
      aria-colindex={column._colindex}
      aria-readonly={!column.editor ? true : undefined}
    >
      {reorder && column.draggable ? (
        isDraggable ? (
          <i
            // eslint-disable-next-line react/no-unknown-property
            draggable-data="true"
            className="wx-TSCaXsGV wx-draggable wxi-drag"
          ></i>
        ) : (
          <i className="wx-TSCaXsGV wx-draggable-stub"></i>
        )
      ) : null}

      {column.treetoggle ? (
        <>
          <span style={{ marginLeft: `${row.$level * 28}px` }}></span>
          {row.$count ? (
            <i
              data-action="toggle-row"
              className={`wx-TSCaXsGV wx-table-tree-toggle wxi-menu-${
                row.open !== false ? 'down' : 'right'
              }`}
            ></i>
          ) : null}
        </>
      ) : null}

      {CellComponent ? (
        <CellComponent
          api={api}
          row={row}
          column={column}
          onAction={({ action, data }) => api.exec(action, data)}
        />
      ) : children ? (
        children()
      ) : shouldHighlight ? (
        <span>
          {highlightText(getRenderValue(row, column)).map(
            ({ highlight, text }, index) =>
              highlight ? (
                <mark key={index} className="wx-TSCaXsGV wx-search">
                  {text}
                </mark>
              ) : (
                <span key={index}>{text}</span>
              ),
          )}
        </span>
      ) : (
        getRenderValue(row, column)
      )}
    </div>
  );
}
