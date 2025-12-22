import { useState, useMemo } from 'react';
import { Field, Slider } from '@svar-ui/react-core';
import { Grid } from '../../src';
import { getData } from '../data';
import './FixedColumns.css';

function FixedColumns() {
  const { data, allColumns } = useMemo(() => getData(), []);
  const [left, setLeft] = useState(2);
  const split = useMemo(() => ({ left }), [left]);

  return (
    <div style={{ padding: '20px' }}>
      <h4>Drag the slider to fix columns on the left</h4>
      <div className="wx-VY9RTvAk controls">
        <Field label="Fix columns">
          <Slider
            min={0}
            max={4}
            value={left}
            onChange={({ value }) => setLeft(value)}
          />
        </Field>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <Grid data={data} columns={allColumns} split={split} />
      </div>
    </div>
  );
}

export default FixedColumns;
