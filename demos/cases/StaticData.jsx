import { useEffect, useRef, useState } from 'react';

import { Slider, Button } from '@svar-ui/react-core';
import { Grid } from '../../src';
import { repeatData, repeatColumns } from '../data';
import { timer, timerEnd } from '../custom/timers';

export default function StaticData() {
  // non-reactive data, similar to Svelte's plain let variables
  const dataRef = useRef([]);
  const columnsRef = useRef([]);

  const [stats, setStats] = useState(null);
  const [counter, setCounter] = useState(1);
  const [rows, setRows] = useState(1000);
  const [cols, setCols] = useState(100);

  const renderTimerActiveRef = useRef(false);
  const genTimeRef = useRef(0);

  function genAndLoad() {
    timer('gen');
    setStats(null);
    dataRef.current = repeatData(+rows);
    columnsRef.current = repeatColumns(+cols);
    setCounter((c) => c + 1);
    const gen = timerEnd('gen');

    genTimeRef.current = gen;

    timer('render');
    renderTimerActiveRef.current = true;
  }

  useEffect(() => {
    if (renderTimerActiveRef.current) {
      const id = setTimeout(() => {
        const render = timerEnd('render');
        const gen = genTimeRef.current;
        const full = gen + render;
        setStats({ gen, render, full });
        renderTimerActiveRef.current = false;
      }, 1);
      return () => clearTimeout(id);
    }
  }, [counter]);

  useEffect(() => {
    genAndLoad();
    // run once on mount, same as calling genAndLoad() after declarations in Svelte
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h4>Load and render big data at once</h4>
      <div style={{ width: '320px', paddingBottom: '20px' }}>
        <Slider
          label={`Rows: ${rows}`}
          min={2}
          max={200000}
          value={rows}
          onChange={({ value }) => setRows(value)}
        />
      </div>
      <div style={{ width: '320px', paddingBottom: '20px' }}>
        <Slider
          label={`Columns: ${cols}`}
          min={2}
          max={20000}
          value={cols}
          onChange={({ value }) => setCols(value)}
        />
      </div>
      <div style={{ width: '320px', paddingBottom: '20px' }}>
        <Button type="primary" onClick={genAndLoad}>
          Generate data and load
        </Button>
      </div>
      <div style={{ width: '1000px', height: '600px' }}>
        <Grid key={counter} data={dataRef.current} columns={columnsRef.current} split={{ left: 1 }} />
      </div>
      {stats && (
        <pre>{`${rows} rows, ${cols} columns, ${rows * cols} cells
dataset generation: ${stats.gen}ms
dataset rendering: ${stats.render}ms`}</pre>
      )}
    </div>
  );
}
