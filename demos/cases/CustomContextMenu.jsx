import { useContext, useState, useCallback } from 'react';
import { context } from '@svar-ui/react-core';
import { getData } from '../data';
import { Grid } from '../../src/';
import { ContextMenu } from '@svar-ui/react-menu';

export default function CustomContextMenu() {
  const { data, flexibleColumns: columns } = getData();

  const options = [
    {
      id: 'add',
      text: 'Add before',
      icon: 'wxi-table-row-plus-before',
    },
    { id: 'duplicate', text: 'Duplicate', icon: 'wxi-duplicate' },
    { id: 'delete', text: 'Delete', icon: 'wxi-delete-outline' },
    { comp: 'separator' },
    { id: 'info', text: 'Info', icon: 'wxi-alert' },
    { id: 'view', text: 'View', icon: 'wxi-external' },
  ];

  const helpers = useContext(context.helpers);

  const [table, setTable] = useState(null);
  const bindTable = useCallback((node) => {
    if (node) setTable(node);
  }, []);

  const handleClicks = (ev) => {
    const option = ev.action;
    if (option) {
      const id = table.getState().selectedRows[0];
      switch (option.id) {
        case 'add':
          table.exec('add-row', { row: {}, before: id });
          break;
        case 'duplicate':
          table.exec('add-row', {
            row: { ...table.getRow(id), id: null },
            after: id,
          });
          break;
        case 'delete':
          table.exec('delete-row', { id });
          break;
        default:
          helpers.showNotice({ text: `You clicked ${option.text}` });
      }
    }
  };

  function getItem(id) {
    if (id) table.exec('select-row', { id });
    return id;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h4>Context menu with custom actions</h4>
      <ContextMenu
        options={options}
        onClick={handleClicks}
        at="point"
        resolver={getItem}
        api={table}
      >
        <Grid data={data} columns={columns} ref={bindTable} />
      </ContextMenu>
    </div>
  );
}
