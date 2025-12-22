import { useState, useMemo } from 'react';
import { getData } from '../data';
import { Grid, Toolbar } from '../../src';

function ToolbarDemo() {
  const { data, countries } = useMemo(() => getData(), []);
  const [api, setApi] = useState(null);

  const columns = useMemo(
    () => [
      { id: 'id', width: 50 },
      {
        id: 'firstName',
        header: 'First Name',
        editor: 'text',
        width: 160,
      },
      {
        id: 'lastName',
        header: 'Last Name',
        editor: 'text',
        width: 160,
      },
      {
        id: 'country',
        header: 'Country',
        editor: 'richselect',
        options: countries,
        width: 160,
      },
      {
        id: 'date',
        header: 'Date',
        width: 100,
        template: (v) => (v ? v.toLocaleDateString() : ''),
      },
      {
        id: 'companyName',
        header: 'Description',
        flexgrow: 1,
      },
    ],
    [countries],
  );

  return (
    <div style={{ padding: '20px' }}>
      <Toolbar api={api} />
      <Grid
        data={data}
        columns={columns}
        init={setApi}
        reorder
        undo
        multiselect
      />
    </div>
  );
}

export default ToolbarDemo;
