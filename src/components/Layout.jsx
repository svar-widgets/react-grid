import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useContext,
  useCallback,
} from 'react';
import storeContext from '../context';
import { onresize } from '../helpers/actions/onresize';
import { reorder as drag, getOffset } from '../helpers/actions/reorder';
import { resetAutoScroll, tryAutoScroll } from '../helpers/actions/dragscroll';
import { clickOutside, locateAttr, locate, id as toId } from '@svar-ui/lib-dom';
import { hotkeys, defaultHotkeys } from '@svar-ui/grid-store';
import { scrollTo } from '@svar-ui/grid-store';
import { useStore, delegateClick, useStoreWithCounter } from '@svar-ui/lib-react';

import Cell from './Cell.jsx';
import HeaderFooter from './HeaderFooter.jsx';
import Overlay from './Overlay.jsx';
import Editor from './inlineEditors/Editor.jsx';
import Print from './print/Print.jsx';
import './Layout.css';

function Layout(props) {
  const {
    header,
    footer,
    overlay,
    multiselect,
    onreorder: onReorder,
    rowStyle,
    columnStyle,
    cellStyle,
    autoRowHeight,
    resize,
    clientWidth,
    clientHeight,
    responsiveLevel,
    hotkeys: hotkeysConfig,
  } = props;

  const api = useContext(storeContext);

  // subscribe to reactive state from api
  const dynamic = useStore(api, 'dynamic');
  const columns = useStore(api, '_columns');
  const data = useStore(api, 'flatData');
  const split = useStore(api, 'split');
  const sizes = useStore(api, '_sizes');
  const [selectedRows, selectionChanged] = useStoreWithCounter(api, 'selectedRows');
  const selectState = useStore(api, 'select');
  const editorState = useStore(api, 'editor');
  const tree = useStore(api, 'tree');
  const focusCell = useStore(api, 'focusCell');
  const printConfig = useStore(api, '_print');
  const undoState = useStore(api, 'undo');
  const reorder = useStore(api, 'reorder');
  const rowHeightFromData = useStore(api, '_rowHeightFromData');

  // will be calculated once, after rendering
  const [SCROLLSIZE, setSCROLLSIZE] = useState(0);
  useEffect(() => {
    setSCROLLSIZE(getScrollSize());
  }, []);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const hasAny = useMemo(() => {
    return (columns || []).some((col) => !col.hidden && col.flexgrow);
  }, [columns]);

  const defaultRowHeight = useMemo(() => sizes?.rowHeight || 0, [sizes]);

  const tableNodeRef = useRef(null);

  // reorder
  const [dragItem, setDragItem] = useState(null);
  const [dragNode, setDragNode] = useState(null);

  const leftColumns = useMemo(() => {
    let cols = [];
    let width = 0;

    if (split && split.left) {
      cols = (columns || [])
        .slice(0, split.left)
        .filter((c) => !c.hidden)
        .map((a) => ({ ...a }));
      cols.forEach((a) => {
        a.fixed = { left: 1 };
        a.left = width;
        width += a.width;
      });
      if (cols.length) cols[cols.length - 1].fixed = { left: -1 };
    }

    return { columns: cols, width };
  }, [split, columns]);

  const rightColumns = useMemo(() => {
    let cols = [];
    let width = 0;

    if (split && split.right) {
      cols = (columns || [])
        .slice(split.right * -1)
        .filter((c) => !c.hidden)
        .map((a) => ({ ...a }));
      for (let i = cols.length - 1; i >= 0; i--) {
        const col = cols[i];
        col.fixed = { right: 1 };
        col.right = width;
        width += col.width;
      }
      if (cols.length) cols[0].fixed = { right: -1 };
    }

    return { columns: cols, width };
  }, [split, columns]);

  const centerColumns = useMemo(() => {
    const center = (columns || [])
      .slice(split?.left || 0, (columns || []).length - (split?.right ?? 0))
      .filter((c) => !c.hidden);
    center.forEach((a) => {
      a.fixed = 0;
    });
    return center;
  }, [columns, split]);

  const fullWidth = useMemo(() => {
    return (columns || []).reduce((acc, col) => {
      if (!col.hidden) {
        acc += col.width;
      }
      return acc;
    }, 0);
  }, [columns]);

  const EXTRACOLUMNS = 1;

  function getHeaderPosition(start, deltaLeft, type) {
    let delta = deltaLeft;
    let index = start;

    if (centerColumns.length) {
      let spanStartInd = centerColumns.length; // max value to compare with
      for (let i = start; i >= 0; i--) {
        const colHeader = centerColumns[i][type];
        colHeader.forEach((h) => {
          if (h.colspan > 1 && i > start - h.colspan && i < spanStartInd) {
            spanStartInd = i;
          }
        });
      }

      if (spanStartInd !== centerColumns.length && spanStartInd < start) {
        for (let i = spanStartInd; i < start; i++) {
          delta -= centerColumns[i].width;
        }
        index = spanStartInd;
      }
    }

    return { index, delta };
  }

  const renderColumns = useMemo(() => {
    let dataCols, headerCols, footerCols;

    const left = scrollLeft;
    const right = scrollLeft + (clientWidth || 0);

    let start = 0;
    let end = 0;
    let sum = 0;

    let d = 0;
    centerColumns.forEach((col, index) => {
      if (left > sum) {
        start = index;
        d = sum;
      }
      sum = sum + col.width;

      if (right > sum) end = index + EXTRACOLUMNS;
    });

    const rightSpanDelta = { header: 0, footer: 0 };
    for (let i = end; i >= start; i--) {
      ['header', 'footer'].forEach((key) => {
        if (centerColumns[i])
          centerColumns[i][key].forEach((hCell) => {
            const colspan = hCell.colspan;
            if (colspan && colspan > 1) {
              const diff = colspan - (end - i + 1);
              if (diff > 0) {
                rightSpanDelta[key] = Math.max(rightSpanDelta[key], diff);
              }
            }
          });
      });
    }

    const headerPos = getHeaderPosition(start, d, 'header');
    const footerPos = getHeaderPosition(start, d, 'footer');

    const dh = headerPos.delta;
    const csH = headerPos.index;

    const df = footerPos.delta;
    const csF = footerPos.index;

    if (hasAny && fullWidth > (clientWidth || 0)) {
      dataCols =
        headerCols =
        footerCols =
          [...leftColumns.columns, ...centerColumns, ...rightColumns.columns];
    } else {
      dataCols = [
        ...leftColumns.columns,
        ...centerColumns.slice(start, end + 1),
        ...rightColumns.columns,
      ];
      headerCols = [
        ...leftColumns.columns,
        ...centerColumns.slice(csH, end + rightSpanDelta.header + 1),
        ...rightColumns.columns,
      ];
      footerCols = [
        ...leftColumns.columns,
        ...centerColumns.slice(csF, end + rightSpanDelta.footer + 1),
        ...rightColumns.columns,
      ];
    }

    return {
      data: dataCols || [],
      header: headerCols || [],
      footer: footerCols || [],
      d,
      df,
      dh,
    };
  }, [
    centerColumns,
    leftColumns,
    rightColumns,
    scrollLeft,
    clientWidth,
    hasAny,
    fullWidth,
  ]);

  const headerHeight = useMemo(
    () => (header ? sizes?.headerHeight || 0 : 0),
    [header, sizes],
  );
  const footerHeight = useMemo(
    () => (footer ? sizes?.footerHeight || 0 : 0),
    [footer, sizes],
  );

  const hasHScroll = useMemo(() => {
    return clientWidth && clientHeight ? fullWidth >= clientWidth : false;
  }, [clientWidth, clientHeight, fullWidth]);

  const visibleRowsHeight = useMemo(() => {
    return (
      (clientHeight || 0) -
      headerHeight -
      footerHeight -
      (hasHScroll ? SCROLLSIZE : 0)
    );
  }, [clientHeight, headerHeight, footerHeight, hasHScroll, SCROLLSIZE]);

  const visibleRows = useMemo(() => {
    return Math.ceil((visibleRowsHeight || 0) / (defaultRowHeight || 1)) + 1;
  }, [visibleRowsHeight, defaultRowHeight]);

  const rowHeightsRef = useRef([]);
  const [renderedHeight, setRenderedHeight] = useState(0);
  const [renderEnd, setRenderEnd] = useState(undefined);

  const renderRows = useMemo(() => {
    let start = 0;
    let deltaTop = 0;
    const EXTRAROWS = 2;

    if (autoRowHeight) {
      let st = scrollTop;
      while (st > 0) {
        st -= rowHeightsRef.current[start] || defaultRowHeight;
        start++;
      }

      deltaTop = scrollTop - st;
      for (let i = Math.max(0, start - EXTRAROWS - 1); i < start; i++)
        deltaTop -= rowHeightsRef.current[start - i] || defaultRowHeight;

      start = Math.max(0, start - EXTRAROWS);
    } else {
      if (rowHeightFromData) {
        let startInd = 0;
        let topHeight = 0;
        for (let i = 0; i < (data || []).length; i++) {
          const height = data[i].rowHeight || defaultRowHeight;
          if (topHeight + height > scrollTop) {
            startInd = i;
            break;
          }
          topHeight += height;
        }
        start = Math.max(0, startInd - EXTRAROWS);

        for (let i = 0; i < start; i++) {
          deltaTop += data[i].rowHeight || defaultRowHeight;
        }

        let visibleRowsCount = 0;
        let currentHeight = 0;
        for (let i = startInd + 1; i < (data || []).length; i++) {
          const height = data[i].rowHeight || defaultRowHeight;
          visibleRowsCount++;
          if (currentHeight + height > visibleRowsHeight) {
            break;
          }
          currentHeight += height;
        }

        const end = Math.min(
          dynamic ? dynamic.rowCount : (data || []).length,
          startInd + visibleRowsCount + EXTRAROWS,
        );

        return { d: deltaTop, start, end };
      }

      start = Math.floor(scrollTop / (defaultRowHeight || 1));
      start = Math.max(0, start - EXTRAROWS);
      deltaTop = start * (defaultRowHeight || 0);
    }

    const totalCount = dynamic ? dynamic.rowCount : (data || []).length;
    const end = Math.min(totalCount, start + (visibleRows || 0) + EXTRAROWS);

    return { d: deltaTop, start, end };
  }, [autoRowHeight, rowHeightFromData, scrollTop, defaultRowHeight, dynamic, data, visibleRows, visibleRowsHeight]);

  const fullHeight = useMemo(() => {
    const count = dynamic ? dynamic.rowCount : (data || []).length;

    if (autoRowHeight) {
      return (
        renderedHeight +
        renderRows.d +
        (count - (renderEnd || 0)) * (defaultRowHeight || 0)
      );
    }
    if (!rowHeightFromData) {
      return count * (defaultRowHeight || 0);
    }

    let totalHeight = 0;
    for (let i = 0; i < count; i++)
      totalHeight += (data[i]?.rowHeight || defaultRowHeight);

    return totalHeight;
  }, [
    dynamic,
    data,
    defaultRowHeight,
    autoRowHeight,
    rowHeightFromData,
    renderedHeight,
    renderRows.d,
    renderEnd,
  ]);

  const hasVScroll = useMemo(() => {
    return clientWidth && clientHeight
      ? fullHeight + headerHeight + footerHeight >=
          clientHeight - (fullWidth >= (clientWidth || 0) ? SCROLLSIZE : 0)
      : false;
  }, [
    clientWidth,
    clientHeight,
    fullHeight,
    headerHeight,
    footerHeight,
    fullWidth,
    SCROLLSIZE,
  ]);

  const contentWidth = useMemo(() => {
    return hasAny && fullWidth <= (clientWidth || 0)
      ? (clientWidth || 0) -
          (hasHScroll ? 0 : 0) -
          (hasVScroll ? SCROLLSIZE : 0) // hasHScroll doesn't affect width here; keep logic as in Svelte
      : fullWidth;
  }, [hasAny, fullWidth, clientWidth, hasVScroll, SCROLLSIZE, hasHScroll]);

  const globalWidth = useMemo(() => {
    return hasAny && fullWidth <= (clientWidth || 0)
      ? clientWidth || 0
      : contentWidth < (clientWidth || 0)
        ? fullWidth + (hasVScroll ? SCROLLSIZE : 0)
        : -1;
  }, [hasAny, fullWidth, clientWidth, contentWidth, hasVScroll, SCROLLSIZE]);

  const lastCallRef = useRef({});
  useEffect(() => {
    if (
      dynamic &&
      (lastCallRef.current.start !== renderRows.start ||
        lastCallRef.current.end !== renderRows.end)
    ) {
      const { start, end } = renderRows;
      lastCallRef.current = { start, end };
      api && api.exec && api.exec('request-data', { row: { start, end } });
    }
  }, [dynamic, renderRows, api]);

  const dataRows = useMemo(() => {
    if (dynamic) return data || [];
    return (data || []).slice(renderRows.start, renderRows.end);
  }, [dynamic, data, renderRows]);

  const visibleSelection = useMemo(() => {
    return (selectedRows || []).filter((s) =>
      (dataRows || []).some((r) => r.id === s),
    );
  }, [selectionChanged, dataRows]);

  const renderStart = useMemo(() => renderRows.start, [renderRows.start]);

  const onScroll = useCallback((ev) => {
    setScrollTop(ev.target.scrollTop);
    setScrollLeft(ev.target.scrollLeft);
  }, []);

  const lockSelection = useCallback((ev) => {
    if (ev.shiftKey) ev.preventDefault();
    tableNodeRef.current &&
      tableNodeRef.current.focus &&
      tableNodeRef.current.focus();
  }, []);

  const checkDraggable = useCallback(() => {
    return !!(columns || []).find((c) => !!c.draggable);
  }, [columns]);

  const postDragRef = useRef(null);
  const movementYRef = useRef(null);

  const bodyClickHandlers = useRef({
    dblclick: (rowId, ev) => {
      const data = { id: rowId, column: locateAttr(ev, 'data-col-id') };
      api.exec('open-editor', data);
    },
    click: (rowId, ev) => {
      if (postDragRef.current) return;
      const column = locateAttr(ev, 'data-col-id');
      if (focusCell?.id !== rowId)
        api.exec('focus-cell', {
          row: rowId,
          column,
          eventSource: 'click',
        });

      if (selectState === false) return;

      const toggle = multiselect && ev.ctrlKey;
      const range = multiselect && ev.shiftKey;

      if (
        toggle ||
        selectedRows.length > 1 ||
        !selectedRows.includes(rowId)
      ) {
        api.exec('select-row', { id: rowId, toggle, range });
      }
    },
    'toggle-row': (rowId) => {
      const row = api.getRow(rowId);
      api.exec(row.open !== false ? 'close-row' : 'open-row', { id: rowId });
    },
    'ignore-click': () => {
      return false;
    },
  });

  const dragScrollConfig = useMemo(() => {
    return {
      top: headerHeight,
      bottom: footerHeight,
      left: leftColumns.width,
      xScroll: hasHScroll,
      yScroll: hasVScroll,
      sense:
        autoRowHeight && dragNode
          ? dragNode.offsetHeight
          : Math.max(sizes?.rowHeight || 0, 40),
      node: tableNodeRef.current && tableNodeRef.current.firstElementChild,
    };
  }, [
    headerHeight,
    footerHeight,
    leftColumns.width,
    hasHScroll,
    hasVScroll,
    autoRowHeight,
    dragNode,
    sizes,
  ]);

  function startDrag(ev, context) {
    const { container, sourceNode, from } = context;
    const hasDraggable = checkDraggable();

    if (hasDraggable && !sourceNode.getAttribute('draggable-data'))
      return false;

    setDragItem(from);

    if (api.getRow(from).open)
      api.exec('close-row', { id: from, nested: true });

    const itemNode = locate(sourceNode, 'data-id');
    const cloned = itemNode.cloneNode(true);
    cloned.classList.remove('wx-selected');
    cloned
      .querySelectorAll('[tabindex]')
      .forEach((element) => element.setAttribute('tabindex', '-1'));
    container.appendChild(cloned);
    setDragNode(cloned);

    const offsetX = scrollLeft - renderColumns.d;
    const vScrollSize = hasVScroll ? SCROLLSIZE : 0;

    container.style.width =
      Math.min(
        (clientWidth || 0) - vScrollSize,
        hasAny && fullWidth <= (clientWidth || 0)
          ? contentWidth
          : contentWidth - vScrollSize,
      ) +
      offsetX +
      'px';

    const itemPos = getOffset(itemNode);
    context.offset = {
      x: offsetX,
      y: -Math.round(itemPos.height / 2),
    };

    if (!movementYRef.current) movementYRef.current = ev.clientY;
  }

  function moveDrag(ev, context) {
    const { from } = context;
    const pos = context.pos;
    const box = getOffset(tableNodeRef.current);

    pos.x = box.x;

    const min = dragScrollConfig.top;
    if (pos.y < min) pos.y = min;
    else {
      const max =
        box.height -
        (hasHScroll && SCROLLSIZE > 0
          ? SCROLLSIZE
          : Math.round(dragScrollConfig.sense / 2)) -
        dragScrollConfig.bottom;
      if (pos.y > max) pos.y = max;
    }

    if (tableNodeRef.current.contains(context.targetNode)) {
      const targetRow = locate(context.targetNode, 'data-id');
      const to = toId(targetRow?.getAttribute('data-id'));

      if (to && to !== from) {
        context.to = to;

        const rowHeight = autoRowHeight
          ? dragNode?.offsetHeight
          : sizes?.rowHeight;

        if (dragNode && (scrollTop === 0 || pos.y > min + rowHeight - 1)) {
          const targetRect = targetRow.getBoundingClientRect();
          const dragNodeOffset = getOffset(dragNode);

          const dragNodePos = dragNodeOffset.y;
          const targetNodePos = targetRect.y;

          const dir = dragNodePos > targetNodePos ? -1 : 1;
          const initialMode = dir === 1 ? 'after' : 'before';
          const diff = Math.abs(api.getRowIndex(from) - api.getRowIndex(to));

          const mode =
            diff !== 1
              ? initialMode === 'before'
                ? 'after'
                : 'before'
              : initialMode;

          if (diff === 1) {
            if (dir === -1 && ev.clientY > movementYRef.current) return;
            if (dir === 1 && ev.clientY < movementYRef.current) return;
          }

          movementYRef.current = ev.clientY;

          api.exec('move-item', {
            id: from,
            target: to,
            mode,
            inProgress: true,
          });
        }
      }

      onReorder && onReorder({ event: ev, context });
    }

    tryAutoScroll(ev, box, context, dragScrollConfig);
  }

  function endDrag(ev, context) {
    const { from, to } = context;

    api.exec('move-item', {
      id: from,
      target: to,
      inProgress: false,
    });

    postDragRef.current = setTimeout(() => {
      postDragRef.current = 0;
    }, 1);

    setDragItem(null);
    setDragNode(null);
    movementYRef.current = null;
    resetAutoScroll(context);
  }

  function getScrollSize() {
    const div = document.createElement('div');
    div.style.cssText =
      'position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;min-height:100px;overflow-y:scroll;';
    document.body.appendChild(div);
    const width = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return width;
  }

  const styleWidth = useMemo(() => {
    return globalWidth > 0 ? { width: `${globalWidth}px` } : undefined;
  }, [globalWidth]);

  const dataElRef = useRef(null);
  function adjustHeight() {
    Promise.resolve().then(() => {
      let rh = 0;
      let re = renderStart;
      const container = dataElRef.current;
      if (!container) return;
      Array.from(container.children).forEach((row, i) => {
        rowHeightsRef.current[renderStart + i] = row.offsetHeight;
        rh += row.offsetHeight;
        re++;
      });

      setRenderedHeight(rh);
      setRenderEnd(re);
    });
  }

  useEffect(() => {
    if (dataRows && autoRowHeight) adjustHeight();
  }, [dataRows, autoRowHeight, renderStart]);

  let [focus, setFocus] = useState();

  useEffect(() => {
    if (
      focusCell &&
      (!selectState ||
        !visibleSelection.length ||
        visibleSelection.includes(focusCell.row))
    ) {
      setFocus({ ...focusCell });
    } else if (dataRows.length && renderColumns.data.length) {
      if (
        !focus ||
        (visibleSelection.length && !visibleSelection.includes(focus.row)) ||
        dataRows.findIndex((r) => r.id == focus.row) === -1 ||
        renderColumns.data.findIndex(
          (c) => c.id == focus.column && !c.collapsed,
        ) === -1
      ) {
        const row = visibleSelection[0] || dataRows[0].id;
        const cind = renderColumns.data.findIndex((c) => !c.collapsed);
        if (cind !== -1) setFocus({ row, column: renderColumns.data[cind].id });
        else setFocus(null);
      }
    } else setFocus(null);
  }, [focusCell]);

  // actions effects
  const scrollRef = useRef(null);
  useEffect(() => {
    const node = tableNodeRef.current;
    if (!node) return;
    const cleanup = onresize(node, resize);
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [resize]);

  const dragState = useRef({});
  Object.assign(dragState.current, {
    start: startDrag,
    move: moveDrag,
    end: endDrag,
    getReorder: () => reorder,
    getDraggableInfo: () => ({ hasDraggable: checkDraggable() }),
  });

  useEffect(() => {
    const node = tableNodeRef.current;
    if (!node) return;
    const cleanup = drag(node, dragState);
    return cleanup.destroy;
  }, [reorder, tableNodeRef.current]);

  useEffect(() => {
    const node = tableNodeRef.current;
    if (!node) return;
    const cleanup = hotkeys(node, {
      keys: hotkeysConfig !== false && {
        ...defaultHotkeys,
        'ctrl+z': undoState,
        'ctrl+y': undoState,
        ...hotkeysConfig,
      },
      exec: (v) => api.exec('hotkey', v),
    });
    return cleanup.destroy;
  }, [api, undoState, hotkeysConfig]);

  const scrollConfig = useRef({
    scroll: api.getReactiveState().scroll,
  });
  scrollConfig.current.getWidth = () =>
    (clientWidth || 0) - (hasVScroll ? SCROLLSIZE : 0);
  scrollConfig.current.getHeight = () => visibleRowsHeight;
  scrollConfig.current.getScrollMargin = () =>
    leftColumns.width + rightColumns.width;

  useEffect(() => {
    scrollTo(scrollRef.current, scrollConfig.current);
  }, []);

  const bodyRef = useRef(null);
  useEffect(() => {
    const node = bodyRef.current;
    if (!node) return;

    const result = [];
    result.push(
      clickOutside(node, () => api.exec('focus-cell', { eventSource: 'click' }))
        .destroy,
    );
    result.push(delegateClick(node, bodyClickHandlers.current));

    return () => result.forEach((r) => r());
  }, []);

  const gridClassName = `wx-grid ${responsiveLevel ? `wx-responsive-${responsiveLevel}` : ''}`;

  return (
    <>
      <div
        className={'wx-4VuBwK2D ' + gridClassName}
        style={{
          ['--header-height']: `${headerHeight}px`,
          ['--footer-height']: `${footerHeight}px`,
          ['--split-left-width']: `${leftColumns.width}px`,
          ['--split-right-width']: `${rightColumns.width}px`,
        }}
      >
        <div
          ref={tableNodeRef}
          className="wx-4VuBwK2D wx-table-box"
          style={styleWidth}
          role={tree ? 'treegrid' : 'grid'}
          aria-colcount={renderColumns.data.length}
          aria-rowcount={dataRows.length}
          aria-multiselectable={tree && multiselect ? true : undefined}
          tabIndex={-1}
        >
          <div
            ref={scrollRef}
            className="wx-4VuBwK2D wx-scroll"
            style={{
              overflowX: hasHScroll ? 'scroll' : 'hidden',
              overflowY: hasVScroll ? 'scroll' : 'hidden',
            }}
            onScroll={onScroll}
          >
            {header ? (
              <div className="wx-4VuBwK2D wx-header-wrapper">
                <HeaderFooter
                  contentWidth={contentWidth}
                  deltaLeft={renderColumns.dh}
                  columns={renderColumns.header}
                  columnStyle={columnStyle}
                  bodyHeight={visibleRowsHeight - +footer}
                />
              </div>
            ) : null}
            <div
              ref={bodyRef}
              className="wx-4VuBwK2D wx-body"
              style={{ width: `${contentWidth}px`, height: `${fullHeight}px` }}
              onMouseDown={(ev) => lockSelection(ev)}
            >
              {overlay ? <Overlay overlay={overlay} /> : null}
              <div
                ref={dataElRef}
                className="wx-4VuBwK2D wx-data"
                style={{
                  paddingTop: `${renderRows.d}px`,
                  paddingLeft: `${renderColumns.d}px`,
                }}
              >
                {dataRows.map((row, rIndex) => {
                  const isSelected = selectedRows.indexOf(row.id) !== -1;
                  const isInactive = dragItem === row.id;
                  const rowClass =
                    'wx-row' +
                    (autoRowHeight ? ' wx-autoheight' : '') +
                    (rowStyle ? ' ' + rowStyle(row) : '') +
                    (isSelected ? ' wx-selected' : '') +
                    (isInactive ? ' wx-inactive' : '');
                  const rowStyleProp = autoRowHeight
                    ? { minHeight: `${row.rowHeight || defaultRowHeight}px` }
                    : { height: `${row.rowHeight || defaultRowHeight}px` };
                  return (
                    <div
                      key={row.id}
                      className={'wx-4VuBwK2D ' + rowClass}
                      data-id={row.id}
                      data-context-id={row.id}
                      style={rowStyleProp}
                      role="row"
                      aria-rowindex={rIndex}
                      aria-expanded={row.open}
                      aria-level={tree ? row.$level + 1 : undefined}
                      aria-selected={tree ? isSelected : undefined}
                      tabIndex={-1}
                    >
                      {renderColumns.data.map((column) => {
                        if (column.collapsed) {
                          return (
                            <div
                              key={column.id}
                              className="wx-4VuBwK2D wx-cell wx-collapsed"
                            ></div>
                          );
                        } else if (
                          editorState?.id === row.id &&
                          editorState.column == column.id
                        ) {
                          return (
                            <Editor key={column.id} row={row} column={column} />
                          );
                        } else {
                          return (
                            <Cell
                              key={column.id}
                              row={row}
                              column={column}
                              columnStyle={columnStyle}
                              cellStyle={cellStyle}
                              reorder={reorder}
                              focusable={
                                focus?.row === row.id &&
                                focus?.column == column.id
                              }
                            />
                          );
                        }
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            {footer && (data || []).length ? (
              <HeaderFooter
                type={'footer'}
                contentWidth={contentWidth}
                deltaLeft={renderColumns.df}
                columns={renderColumns.footer}
                columnStyle={columnStyle}
              />
            ) : null}
          </div>
        </div>
      </div>
      {printConfig ? (
        <Print
          config={printConfig}
          rowStyle={rowStyle}
          columnStyle={columnStyle}
          cellStyle={cellStyle}
          header={header}
          footer={footer}
          reorder={reorder}
        />
      ) : null}
    </>
  );
}

export default Layout;
