import { useState } from 'react';
import { getData } from '../data';
import { Grid, Tooltip } from '../../src/';
import CustomTooltip from '../custom/CustomTooltip.jsx';

const { data, columns } = getData();

const columnsTooltip = [
  { id: 'id', width: 50, tooltip: false },
  {
    id: 'city',
    width: 100,
    header: 'City',
    footer: 'City',
  },
  {
    id: 'firstName',
    header: 'First Name',
    footer: 'First Name',
    width: 150,
    tooltip: false,
  },
  {
    id: 'lastName',
    header: 'Last Name',
    footer: 'Last Name',
    width: 150,
    tooltip: false,
  },
  { id: 'email', header: 'Email', footer: 'Email' },
  { id: 'companyName', header: 'Company', footer: 'Company' },
  { id: 'stars', tooltip: false },
  { id: 'date', tooltip: (obj) => obj.date?.toDateString() },
];

export default function Tooltips() {
  const [api, setApi] = useState(null);
  const [api1, setApi1] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h4>Default text tooltips for specific columns</h4>
      <p>The tooltip is only shown for cells with overflow</p>
      <div>
        <Tooltip overflow api={api}>
          <Grid data={data} columns={columnsTooltip} init={setApi} />
        </Tooltip>
      </div>

      <h4>Custom tooltips</h4>
      <div>
        <Tooltip content={CustomTooltip} api={api1}>
          <Grid data={data} columns={columns} init={setApi1} />
        </Tooltip>
      </div>
    </div>
  );
}
