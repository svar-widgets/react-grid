import { useMemo } from 'react';
import { Grid } from '../../src';
import { getData } from '../data';

function InlineEditors() {
  const { allData: data, countries, users } = useMemo(() => getData(), []);
  const columns = useMemo(
    () => [
      { id: 'id', width: 50 },
      {
        id: 'firstName',
        header: 'Name - "text"',
        editor: 'text',
        width: 180,
      },
      {
        id: 'country',
        header: 'Country - "combo"',
        editor: {
          type: 'combo',
          config: { template: (option) => `${option.id}. ${option.label}` },
        },
        options: countries,
        width: 180,
      },
      {
        id: 'date',
        header: 'Date - "datepicker"',
        width: 180,
        editor: 'datepicker',
        template: (v) => (v ? v.toLocaleDateString() : ''),
      },
      {
        id: 'user',
        header: 'User - "richselect"',
        width: 180,
        editor: 'richselect',
        options: users,
      },
      {
        id: 'destinations',
        header: 'Destinations - "multiselect"',
        editor: {
          type: 'multiselect',
        },
        options: countries,
        width: 250,
      },
    ],
    [countries, users],
  );

  return (
    <div style={{ padding: 20 }}>
      <h4>
        Editable cells: use double click to activate an editor. Use Tab, Enter
        and Esc to navigate
      </h4>
      <div>
        <Grid data={data} columns={columns} />
      </div>
    </div>
  );
}

export default InlineEditors;
