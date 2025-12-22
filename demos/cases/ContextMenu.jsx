import { useMemo, useState } from 'react';
import { getData } from '../data';
import { Grid, ContextMenu as ContextMenuLib, HeaderMenu } from '../../src/';
import { Locale } from '@svar-ui/react-core';
import { en } from '@svar-ui/grid-locales';

function ContextMenu() {
  const { data, flexibleColumns: columns } = useMemo(() => getData(), []);
  const [grid, setGrid] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h4>Context menu with default actions</h4>
      <Locale words={en} optional={true}>
        <ContextMenuLib api={grid}>
          <HeaderMenu api={grid}>
            <Grid data={data} columns={columns} init={setGrid} multiselect reorder />
          </HeaderMenu>
        </ContextMenuLib>
      </Locale>
    </div>
  );
}

export default ContextMenu;
