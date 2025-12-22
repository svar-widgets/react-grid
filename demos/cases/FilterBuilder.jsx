import { useMemo, useRef, useCallback, useEffect } from 'react';
import {
  FilterBuilder as FilterBuilderComponent,
  createFilter,
  getOptions,
} from '@svar-ui/react-filter';
import { getData } from '../data';
import { Grid } from '../../src';

function FilterBuilder() {
  const { data, columns } = useMemo(() => {
    const { data, columns } = getData();
    columns.push({ id: 'comments', flexgrow: 1, header: 'Comments' });
    return { data, columns };
  }, []);

  const value = useMemo(
    () => ({
      glue: 'or',
      rules: [
        {
          field: 'city',
          filter: 'equal',
          value: 'Eulaliabury',
        },
        {
          field: 'city',
          filter: 'equal',
          value: 'West Meda',
        },
      ],
      }),
    [],
  );

  const api = useRef(null);

  const applyFilter = useCallback(({ value }) => {
    const filter = createFilter(value);
    api.current.exec('filter-rows', { filter });
  }, []);

  useEffect(() => {
    if (api.current) applyFilter({ value });
  }, [api.current, applyFilter, value])

  const options = useMemo(
    () => ({
      city: getOptions(data, 'city'),
      firstName: getOptions(data, 'firstName'),
      lastName: getOptions(data, 'lastName'),
      email: getOptions(data, 'email'),
    }),
    [data],
  );

  const fields = useMemo(
    () => [
      { id: 'city', label: 'City', type: 'text' },
      { id: 'firstName', label: 'Name', type: 'text' },
      { id: 'lastName', label: 'Last Name', type: 'text' },
      { id: 'email', label: 'Email', type: 'text' },
    ],
    [],
  );

  return (
    <div style={{ padding: '20px' }}>
      <h4>Filter grid data executing "filter-rows" action</h4>
      <FilterBuilderComponent
        value={value}
        fields={fields}
        options={options}
        type="line"
        onChange={applyFilter}
      />
      <Grid data={data} columns={columns} ref={api} />
    </div>
  );
}

export default FilterBuilder;
