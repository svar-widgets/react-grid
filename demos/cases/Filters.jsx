import { useMemo, useRef, useCallback } from 'react';
import { Button } from '@svar-ui/react-core';
import { getData } from '../data';
import { Grid } from '../../src';
import './Filters.css';

export default function Filters() {
  const { allData, data, countries, users } = useMemo(() => getData(), []);

  const columns = useMemo(() => {
    const cols = [
      { id: 'id', width: 50 },
      {
        id: 'firstName',
        header: { filter: 'text' },
        footer: 'First Name',
        width: 150,
      },
      {
        id: 'lastName',
        header: { filter: { type: 'text' } },
        footer: 'Last Name',
        width: 150,
      },
      {
        id: 'email',
        header: 'Email',
        footer: 'Email',
      },
      {
        id: 'country',
        header: {
          filter: {
            type: 'richselect',
            config: {
              options: countries,
            },
          },
        },
        options: countries,
      },
      {
        id: 'stars',
        header: { filter: "text" },
        footer: 'Stars',
      },
    ];

    cols.forEach((c) => {
      c.sort = true;
      c.resize = true;
    });

    return cols;
  }, []);

  const columnsSpans = useMemo(() => {
    const cols = [
      {
        id: 'id',
        width: 50,
        footer: { text: 'All users', colspan: 7 },
      },
      {
        id: 'firstName',
        header: [
          {
            text: 'Main client info',
            colspan: 3,
            collapsible: true,
            open: true,
          },
          { text: 'First Name' },
          { filter: 'text' },
        ],
        width: 150,
      },
      {
        id: 'lastName',
        header: ['', 'Last Name', { filter: 'text' }],
        width: 150,
      },
      {
        id: 'email',
        header: [
          '',
          {
            collapsible: true,
            text: 'Email',
          },
          { filter: 'text' },
        ],
      },
      {
        id: 'companyName',
        header: [
          {
            text: 'Company',
            colspan: 2,
            collapsible: true,
          },
          { text: 'Name', rowspan: 2 },
          '',
        ],
      },
      {
        id: 'country',
        options: countries,
        header: [
          '',
          'Country',
          {
            filter: {
              type: 'richselect',
            },
          },
        ],
      },
      {
        id: 'date',
        template: (obj) => obj.toDateString(),
        header: 'Joined',
      },
      {
        id: 'user',
        header: [
          { text: 'Assigned', rowspan: 2 },
          {
            filter: {
              type: 'richselect',
            },
          },
        ],
        footer: { text: data.length, css: 'right' },
        width: 180,
        options: users,
      },
    ];

    cols.forEach((c) => {
      c.sort = true;
      c.resize = true;
    });

    return cols;
  }, []);

  const grid1 = useRef(null);
  const grid2 = useRef(null);

  const clear = useCallback((grid) => {
    grid.exec('filter-rows', {});
  }, []);

  return (
    <div className="wx-hzsS3BnF demo" style={{ padding: 20 }}>
      <h4>Grids with header filters</h4>
      <Button type="primary" onClick={() => clear(grid1.current)}>
        Clear filters
      </Button>
      <div style={{ height: 400, margin: '10px 0 20px' }}>
        <Grid data={allData} columns={columns} ref={grid1} />
      </div>

      <Button type="primary" onClick={() => clear(grid2.current)}>
        Clear filters
      </Button>
      <div style={{ height: 600, marginTop: 10 }}>
        <Grid data={allData} columns={columnsSpans} footer={true} ref={grid2} />
      </div>
    </div>
  );
}
