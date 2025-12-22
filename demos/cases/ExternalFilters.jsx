import { useState } from 'react';
import { Field, DateRangePicker, Text } from '@svar-ui/react-core';
import { Grid } from '../../src';
import { getData } from '../data';
import './ExternalFilters.css';

export default function ExternalFilters() {
  const { allData } = getData();

  const columns = [
    { id: 'id', width: 50 },
    {
      id: 'firstName',
      header: 'First Name',
      footer: 'First Name',
    },
    {
      id: 'lastName',
      header: 'Last Name',
      footer: 'Last Name',
    },
    {
      id: 'date',
      header: 'Date',
      template: (v) => v.toDateString(),
      width: 160,
    },
    {
      id: 'companyName',
      header: 'Company',
      flexgrow: 1,
    },
  ];

  const [tableApi, setTableApi] = useState();
  const [dateValue, setDateValue] = useState();
  const [companyValue, setCompanyValue] = useState('');

  function init(api) {
    setTableApi(api);
  }

  function handleFilter(dateValue, companyValue) {
    const filterValues = {
      date: dateValue,
      companyName: companyValue,
    };

    const filter = createFilter(filterValues);
    if (tableApi) tableApi.exec('filter-rows', { filter });
  }

  function createFilter(filterValues) {
    const filters = Object.keys(filterValues)
      .filter((key) => filterValues[key])
      .map((key) => {
        const value = filterValues[key];

        switch (key) {
          case 'companyName': {
            return (v) => {
              if (v[key])
                return v[key].toLowerCase().indexOf(value.toLowerCase()) !== -1;
            };
          }
          case 'date': {
            return (v) => {
              if (v[key]) return isDateInRange(v[key], value);
            };
          }
          default:
            return () => true;
        }
      });

    return (obj) => {
      for (let i = 0; i < filters.length; i++) {
        if (!filters[i](obj)) {
          return false;
        }
      }
      return true;
    };
  }

  function isDateInRange(date, range) {
    const { start, end } = range;
    const nDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return nDate >= start && nDate <= end;
  }

  return (
    <div className="wx-vYEb13Ba demo" style={{ padding: 20 }}>
      <h4>Grid with external filters</h4>
      <div style={{ maxWidth: 810 }}>
        <div className="wx-vYEb13Ba controls">
          <Field label={'Filter "Date" column'}>
            <DateRangePicker
              value={dateValue}
              clear
              onChange={({ value }) => {
                setDateValue(value);
                handleFilter(value, companyValue);
              }}
            />
          </Field>
          <Field label={'Filter "Company" column'}>
            <Text
              value={companyValue}
              clear
              icon={'wxi-search'}
              onChange={({ value }) => {
                setCompanyValue(value);
                handleFilter(dateValue, value);
              }}
            />
          </Field>
        </div>
        <div style={{ height: 400 }}>
          <Grid data={allData} columns={columns} init={init} />
        </div>
      </div>
    </div>
  );
}
