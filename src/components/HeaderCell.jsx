import { useEffect, useMemo, useCallback, useRef, useContext } from 'react';
import storeContext from '../context';
import { useStore } from '@svar-ui/lib-react';
import { resize } from '../helpers/actions/resize';
import { getCssName, getStyle } from '../helpers/columnWidth';
import Filter from './inlineFilters/Filter.jsx';
import './HeaderCell.css';

export default function HeaderCell(props) {
  const {
    cell,
    column,
    row,
    lastRow,
    sortRow,
    columnStyle,
    bodyHeight,
    hasSplit,
  } = props;

  const api = useContext(storeContext);
  const sortMarksValue = useStore(api, 'sortMarks');

  const sortMark = useMemo(() => {
    return sortMarksValue ? sortMarksValue[column.id] : undefined;
  }, [sortMarksValue, column.id]);

  const startRef = useRef();

  const down = useCallback(
    (node) => {
      startRef.current = cell.flexgrow
        ? node.parentNode.clientWidth
        : cell.width;
    },
    [cell.flexgrow, cell.width],
  );

  const resizeColumn = useCallback(
    (dx, inProgress) => {
      api.exec('resize-column', {
        id: cell.id,
        width: Math.max(1, (startRef.current || 0) + dx),
        inProgress,
      });
    },
    [api, cell.id],
  );

  const move = useCallback((dx) => resizeColumn(dx, true), [resizeColumn]);
  const up = useCallback((dx) => resizeColumn(dx, false), [resizeColumn]);

  const sort = useCallback(
    (ev) => {
      if (!column.sort || cell.filter) return;
      let order = sortMark?.order;
      if (order) {
        order = order === 'asc' ? 'desc' : 'asc';
      }
      api.exec('sort-rows', { key: cell.id, add: ev.ctrlKey, order });
    },
    [api, cell.id, cell.filter, column.sort, sortMark?.order],
  );

  const collapse = useCallback(
    (ev) => {
      if (ev) ev.stopPropagation();
      api.exec('collapse-column', { id: cell.id, row });
    },
    [api, cell.id, row],
  );

  const toggleCollapseColumn = useCallback(
    (ev) => {
      if (ev.key === 'Enter') collapse();
    },
    [collapse],
  );

  const toggleSortColumn = useCallback(
    (ev) => {
      if (ev.key === 'Enter' && !cell.filter) sort(ev);
    },
    [sort, cell.filter],
  );

  const isCollapsed = useMemo(
    () => cell.collapsed && column.collapsed,
    [cell.collapsed, column.collapsed],
  );
  const overlay = useMemo(
    () => isCollapsed && !hasSplit && cell.collapsible !== 'header',
    [isCollapsed, hasSplit, cell.collapsible],
  );
  const collapsedTextStyle = useMemo(
    () => (overlay ? { top: -bodyHeight / 2, position: 'absolute' } : {}),
    [overlay, bodyHeight],
  );

  const cellStyle = useMemo(
    () =>
      getStyle(
        cell.width,
        cell.flexgrow,
        column.fixed,
        column.left,
        cell.right ?? column.right,
        cell.height + (isCollapsed && overlay ? bodyHeight : 0),
      ),
    [
      cell.width,
      cell.flexgrow,
      column.fixed,
      column.left,
      cell.right,
      column.right,
      cell.height,
      isCollapsed,
      overlay,
      bodyHeight,
    ],
  );

  const css = useMemo(
    () => getCssName(column, cell, columnStyle),
    [column, cell, columnStyle],
  );

  const getCell = useCallback(() => {
    return Object.fromEntries(
      Object.entries(cell).filter(([key]) => key !== 'cell'),
    );
  }, [cell]);

  const collapsedClassName = `wx-cell ${css} ${cell.css || ''} wx-collapsed`;
  const normalClassName = [
    'wx-cell',
    css,
    cell.css || '',
    cell.filter ? 'wx-filter' : '',
    column.fixed && column.fixed.right ? 'wx-fixed-right' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const gripRef = useRef(null);
  useEffect(() => {
    const node = gripRef.current;
    if (!node) return;
    const cleanup = resize(node, { down, move, up });
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [down, move, up, resize]);

  if (isCollapsed) {
    return (
      <div
        className={'wx-RsQD74qC ' + collapsedClassName}
        style={cellStyle}
        role="button"
        aria-label={`Expand column ${cell.text || ''}`}
        aria-expanded={!cell.collapsed}
        tabIndex={0}
        onKeyDown={toggleCollapseColumn}
        onClick={collapse}
        data-header-id={column.id}
      >
        <div className="wx-RsQD74qC wx-text" style={collapsedTextStyle}>
          {cell.text || ''}
        </div>
      </div>
    );
  }

  return (
    <div
      className={'wx-RsQD74qC ' + normalClassName}
      style={cellStyle}
      onClick={sort}
      data-header-id={column.id}
      tabIndex={!cell._hidden && column.sort && !cell.filter ? 0 : undefined}
      role="columnheader"
      aria-colindex={cell._colindex}
      aria-colspan={cell.colspan > 1 ? cell.colspan : undefined}
      aria-rowspan={cell.rowspan > 1 ? cell.rowspan : undefined}
      aria-sort={
        !sortMark?.order || cell.filter
          ? 'none'
          : sortMark?.order === 'asc'
            ? 'ascending'
            : 'descending'
      }
      onKeyDown={toggleSortColumn}
    >
      {cell.collapsible ? (
        <div
          className="wx-RsQD74qC wx-collapse"
          role="button"
          aria-label={cell.collapsed ? 'Expand column' : 'Collapse column'}
          aria-expanded={!cell.collapsed}
          tabIndex={0}
          onKeyDown={toggleCollapseColumn}
          onClick={collapse}
        >
          <i
            className={`wx-RsQD74qC wxi-angle-${cell.collapsed ? 'down' : 'right'}`}
          ></i>
        </div>
      ) : null}

      {cell.cell ? (
        (() => {
          const CellComponent = cell.cell;
          return (
            <CellComponent
              api={api}
              cell={getCell()}
              column={column}
              row={row}
              onAction={({ action, data }) => api.exec(action, data)}
            />
          );
        })()
      ) : cell.filter ? (
        <Filter filter={cell.filter} column={column} />
      ) : (
        <div className="wx-RsQD74qC wx-text">{cell.text || ''}</div>
      )}

      {column.resize && lastRow && !cell._hidden ? (
        <div
          className="wx-RsQD74qC wx-grip"
          role="presentation"
          aria-label="Resize column"
          ref={gripRef}
          onClick={(ev) => ev.stopPropagation()}
        >
          <div></div>
        </div>
      ) : null}

      {sortRow ? (
        <div className="wx-RsQD74qC wx-sort">
          {sortMark ? (
            <>
              {typeof sortMark.index !== 'undefined' ? (
                <div className="wx-RsQD74qC wx-order">{sortMark.index + 1}</div>
              ) : null}
              <i
                className={`wx-RsQD74qC wxi-arrow-${sortMark.order === 'asc' ? 'up' : 'down'}`}
              ></i>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
