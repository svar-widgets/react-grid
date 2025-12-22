import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';

// core widgets lib
import { Locale } from '@svar-ui/react-core';
import { en } from '@svar-ui/grid-locales';

// stores
import { EventBusRouter } from '@svar-ui/lib-state';
import { DataStore } from '@svar-ui/grid-store';

// context
import { context } from '@svar-ui/react-core';
import StoreContext from '../context';

// svelte store factory (used by DataStore)
import { writable } from '@svar-ui/lib-react';

// ui
import Layout from './Layout.jsx';

const camelize = (s) =>
  s
    .split('-')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ''))
    .join('');

const Grid = forwardRef(function Grid(
  {
    data = [],
    columns = [],
    rowStyle = null,
    columnStyle = null,
    cellStyle = null,
    selectedRows,
    select = true,
    multiselect = false,
    header = true,
    footer = false,
    dynamic = null,
    overlay = null,
    reorder = false,
    onReorder = null,
    autoRowHeight = false,
    sizes,
    split,
    tree = false,
    autoConfig = false,
    init = null,
    responsive = null,
    sortMarks,
    undo = false,
    hotkeys = null,
    ...restProps
  },
  ref,
) {
  // keep latest rest props for event routing
  const restPropsRef = useRef();
  restPropsRef.current = restProps;

  // init stores
  const dataStore = useMemo(() => new DataStore(writable), []);
  const firstInRoute = useMemo(() => dataStore.in, [dataStore]);

  const lastInRouteRef = useRef(null);
  if (lastInRouteRef.current === null) {
    lastInRouteRef.current = new EventBusRouter((a, b) => {
      const name = 'on' + camelize(a);
      if (restPropsRef.current && restPropsRef.current[name]) {
        restPropsRef.current[name](b);
      }
    });
    firstInRoute.setNext(lastInRouteRef.current);
  }

  // public API
  const api = useMemo(
    () => ({
      getState: dataStore.getState.bind(dataStore),
      getReactiveState: dataStore.getReactive.bind(dataStore),
      getStores: () => ({ data: dataStore }),
      exec: firstInRoute.exec,
      setNext: (ev) => {
        lastInRouteRef.current = lastInRouteRef.current.setNext(ev);
        return lastInRouteRef.current;
      },
      intercept: firstInRoute.intercept.bind(firstInRoute),
      on: firstInRoute.on.bind(firstInRoute),
      detach: firstInRoute.detach.bind(firstInRoute),
      getRow: dataStore.getRow.bind(dataStore),
      getRowIndex: dataStore.getRowIndex.bind(dataStore),
      getColumn: dataStore.getColumn.bind(dataStore),
    }),
    [dataStore, firstInRoute],
  );

  const [clientWidth, setClientWidth] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [responsiveLevel, setResponsiveLevel] = useState(null);
  const [responsiveConfig, setResponsiveConfig] = useState(null);

  // auto config columns
  const finalColumns = useMemo(() => {
    if (autoConfig && !columns.length && data.length) {
      const test = data[0];
      const autoCols = [];

      for (let key in test) {
        if (key !== 'id' && key[0] !== '$') {
          let col = {
            id: key,
            header: key[0].toUpperCase() + key.slice(1),
          };

          if (typeof autoConfig === 'object') {
            col = { ...col, ...autoConfig };
          }
          autoCols.push(col);
        }
      }

      return autoCols;
    }

    return (responsiveConfig && responsiveConfig.columns) ?? columns;
  }, [autoConfig, columns, data, responsiveConfig]);

  const finalSizes = useMemo(
    () => (responsiveConfig && responsiveConfig.sizes) ?? sizes,
    [responsiveConfig, sizes],
  );

  const resize = useCallback(
    (rect) => {
      setClientWidth(rect.width);
      setClientHeight(rect.height);

      if (responsive) {
        const levels = Object.keys(responsive)
          .map(Number)
          .sort((a, b) => a - b);

        const newLevel = levels.find((level) => rect.width <= level) ?? null;

        if (newLevel !== responsiveLevel) {
          setResponsiveConfig(responsive[newLevel]);
          setResponsiveLevel(newLevel);
        }
      }
    },
    [responsive, responsiveLevel],
  );


  const _skin = useContext(context.theme);

  const initOnceRef = useRef(0);
  useEffect(() => {
    if (!initOnceRef.current) {
      if (init) init(api);
    } else {
      const prev = dataStore.getState();
      dataStore.init({
        data,
        columns: finalColumns,
        split: split || prev.split,
        sizes: finalSizes || prev.sizes,
        selectedRows: selectedRows || prev.selectedRows,
        dynamic,
        tree,
        sortMarks: sortMarks || prev.sortMarks,
        undo,
        reorder,
        _skin,
        _select: select,
      });
    }
    initOnceRef.current++;
  }, [
    dataStore,
    data,
    finalColumns,
    split,
    finalSizes,
    selectedRows,
    dynamic,
    tree,
    sortMarks,
    undo,
    reorder,
    _skin,
    select,
    init,
    api,
  ]);

  if (initOnceRef.current === 0) {
    dataStore.init({
      data,
      columns: finalColumns,
      split: split || { left: 0 },
      sizes: finalSizes || {},
      selectedRows: selectedRows || [],
      dynamic,
      tree,
      sortMarks: sortMarks || {},
      undo,
      reorder,
      _skin,
      select,
    });
  }

  // expose API via ref
  useImperativeHandle(
    ref,
    () => ({
      ...api,
    }),
    [api],
  );

  return (
    <StoreContext.Provider value={api}>
      <Locale words={en} optional={true}>
        <Layout
          header={header}
          footer={footer}
          overlay={overlay}
          rowStyle={rowStyle}
          columnStyle={columnStyle}
          cellStyle={cellStyle}
          onReorder={onReorder}
          multiselect={multiselect}
          autoRowHeight={autoRowHeight}
          clientWidth={clientWidth}
          clientHeight={clientHeight}
          responsiveLevel={responsiveLevel}
          resize={resize}
          hotkeys={hotkeys}
        />
      </Locale>
    </StoreContext.Provider>
  );
});

export default Grid;
