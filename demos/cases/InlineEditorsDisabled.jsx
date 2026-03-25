import { useMemo, useCallback } from 'react';
import { Grid } from '../../src';
import { getData } from '../data';
import './InlineEditorsDisabled.css';

const InlineEditorsDisabled = () => {
  const { allData: data, countries, users } = useMemo(() => getData(), []);

  const isBlocked = useCallback((row, column) => {
    return (
      (row.id === 2 && column.id === 'firstName') ||
      (row.id === 3 && ['date', 'user'].indexOf(column.id) > -1)
    );
  }, []);

  const editorHandler = useCallback(
    (config) => {
      return (row, column) => {
        if (!row || !isBlocked(row, column)) return config;
      };
    },
    [isBlocked],
  );

  const columns = useMemo(
    () => [
      { id: 'id', width: 50 },
      {
        id: 'firstName',
        header: 'Name - "text"',
        editor: editorHandler('text'),
        width: 180,
      },
      {
        id: 'country',
        header: 'Country - "combo"',
        editor: editorHandler({
          type: 'combo',
          config: { template: (option) => `${option.id}. ${option.label}` },
        }),
        options: countries,
        width: 180,
      },
      {
        id: 'date',
        header: 'Date - "datepicker"',
        width: 180,
        editor: editorHandler('datepicker'),
        template: (v) => (v ? v.toLocaleDateString() : ''),
      },
      {
        id: 'user',
        header: 'User - "richselect"',
        width: 180,
        editor: editorHandler('richselect'),
        options: users,
      },
    ],
    [countries, users, editorHandler],
  );

  return (
    <div style={{ padding: '20px' }}>
      <h4>
        Editable cells: some cells in the second and third rows are not editable
      </h4>
      <div>
        <Grid
          data={data}
          columns={columns}
          cellStyle={(row, column) => (isBlocked(row, column) ? 'wx-doorlydd blocked' : '')}
        />
      </div>
    </div>
  );
};

export default InlineEditorsDisabled;
