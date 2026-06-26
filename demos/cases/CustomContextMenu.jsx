import { useContext, useState, useCallback } from 'react';
import { context } from '@svar-ui/react-core';
import { getData } from '../data';
import { Grid, ContextMenu, defaultMenuOptions } from '../../src/';

export default function CustomContextMenu() {
  const { data, flexibleColumns: columns } = getData();

  // take the grid's default option set and alter it:
  // drop copy/cut/paste, then append our own options
  const options = [
    ...defaultMenuOptions.filter(
      (op) => !['copy-row', 'cut-row', 'paste-row'].includes(op.id),
    ),
    { comp: 'separator' },
    { id: 'info', text: 'Row info', icon: 'wxi-alert' },
    { id: 'view', text: 'View details', icon: 'wxi-external' },
  ];

  const helpers = useContext(context.helpers);

  const [grid, setGrid] = useState(null);
  const bindGrid = useCallback((node) => {
    if (node) setGrid(node);
  }, []);

  // built-in options (add/delete/move...) are executed by the grid itself;
  // here we only react to the custom options we added above
  const handleClicks = (ev) => {
    const option = ev.action;
    if (!option) return;

    if (option.id === 'info' || option.id === 'view') {
      const id = grid.getState().selectedRows[0];
      const row = id ? grid.getRow(id) : null;
      helpers.showNotice({
        text: row
          ? `${option.text} — ${row.firstName} ${row.lastName}`
          : `${option.text} clicked`,
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h4>Context menu with customized options</h4>
      <ContextMenu api={grid} options={options} onClick={handleClicks}>
        <Grid data={data} columns={columns} ref={bindGrid} multiselect reorder />
      </ContextMenu>
    </div>
  );
}
