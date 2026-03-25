import { useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';
import {
  FilterQuery as FilterQueryComponent,
  createFilter,
  getQueryString,
  getOptionsMap,
} from '@svar-ui/react-filter';
import { context } from '@svar-ui/react-core';
import { Grid } from '../../src';
import { getData } from '../data';
import './FilterQuery.css';

function FilterQuery() {
  const helpers = useContext(context.helpers);

  const { allData, allColumns, countries } = useMemo(() => getData(), []);

  const [textValue, setTextValue] = useState(
    'Country: Brasil and Email: contains yahoo',
  );
  const api = useRef(null);
  const [filter, setFilter] = useState(undefined);

  useEffect(() => {
    if (api.current && filter !== undefined)
      api.current.exec('filter-rows', { filter });
  }, [api.current, filter]);

  const options = useMemo(() => getOptionsMap(allData), [allData]);

  const fields = useMemo(
    () => [
      {
        id: 'country',
        label: 'Country',
        type: 'tuple',
        format: (n) => countries.find((c) => c.id == n)?.label,
      },
      { id: 'city', label: 'City', type: 'text' },
      { id: 'firstName', label: 'First Name', type: 'text' },
      { id: 'lastName', label: 'Last Name', type: 'text' },
      { id: 'email', label: 'Email', type: 'text' },
      { id: 'companyName', label: 'Company', type: 'text' },
      { id: 'stars', label: 'Stars', type: 'number' },
      { id: 'date', label: 'Start Date', type: 'date' },
    ],
    [countries],
  );

  const url =
    'https://master--svar-filter-natural-text--dev.webix.io/text-to-json';

  const text2filter = useCallback(
    async (text) => {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ text, fields }),
      });
      const json = await response.json();
      if (!response.ok) {
        helpers.showNotice({
          text: json.error || 'Request failed',
          type: 'danger',
        });
        return null;
      }
      return json;
    },
    [fields, helpers],
  );

  const handleFilter = useCallback(
    async ({ value, error, text, startProgress, endProgress }) => {
      if (text) {
        error = null;
        try {
          startProgress();
          value = await text2filter(text);
          setTextValue(value ? getQueryString(value).query : '');
        } catch (e) {
          error = e;
        } finally {
          endProgress();
        }
      }

      if (error) {
        helpers.showNotice({
          text: error.message,
          type: 'danger',
        });

        if (error.code !== 'NO_DATA') return;
      }

      setFilter(() => createFilter(value, {}, fields));
    },
    [text2filter, helpers, fields],
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1330px' }}>
      <h4 className="wx-aa3sKnKN">
        Filter grid data with FilterQuery in AI-powered mode
      </h4>
      <FilterQueryComponent
        value={textValue}
        placeholder="E.g. Stars: >3000"
        fields={fields}
        options={options}
        onChange={handleFilter}
      />
      <p className="hint wx-aa3sKnKN">
        Type filter conditions using query syntax or natural language. Examples:
      </p>
      <ul className="examples wx-aa3sKnKN">
        <li className="wx-aa3sKnKN">Stars: &gt;500 and City: Eulaliabury</li>
        <li className="wx-aa3sKnKN">StartDate: &gt;= 2026-03-01</li>
        <li className="wx-aa3sKnKN">FirstName: Erick, Hubert</li>
        <li className="wx-aa3sKnKN">Started in winter</li>
        <li className="wx-aa3sKnKN">Live in Europe</li>
      </ul>
      <div style={{ height: '550px' }}>
        <Grid data={allData} columns={allColumns} ref={api} />
      </div>
    </div>
  );
}

export default FilterQuery;
