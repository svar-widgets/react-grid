import { useMemo, useState } from 'react';
import { getData } from '../data';
import { Grid, ContextMenu, HeaderMenu } from '../../src';
import { Locale, Segmented } from '@svar-ui/react-core';
import { en, cn } from '@svar-ui/grid-locales';
import { en as enCore, cn as cnCore } from '@svar-ui/core-locales';
import './Localization.css';

export default function Localization() {
  const { allData: data, countries, users } = useMemo(() => getData(), []);

  const [table, setTable] = useState();

  function init(api) {
    setTable(api);
  }

  const columns = useMemo(
    () => [
      { id: 'id', width: 50 },
      {
        id: 'firstName',
        header: 'Name',
        editor: 'text',
        width: 180,
      },
      {
        id: 'country',
        header: 'Country',
        editor: {
          type: 'combo',
          config: { template: (option) => `${option.id}. ${option.label}` },
        },
        options: countries,
        width: 180,
      },
      {
        id: 'date',
        header: 'Date',
        width: 180,
        editor: 'datepicker',
        template: (v) => (v ? v.toLocaleDateString() : ''),
      },
      {
        id: 'user',
        header: 'User',
        width: 180,
        editor: 'richselect',
        options: users,
      },
    ],
    [countries, users],
  );

  const [language, setLanguage] = useState('en');

  return (
    <div className="wx-RYpanSmz demo">
      <Segmented
        options={[
          { id: 'en', label: 'English' },
          { id: 'cn', label: 'Chinese' },
        ]}
        value={language}
        onChange={({ value }) => setLanguage(value)}
      />
      {language == 'en' ? (
        <Locale words={{ ...en, ...enCore }}>
          <ContextMenu api={table}>
            <HeaderMenu api={table}>
              <Grid data={data} columns={columns} init={init} />
            </HeaderMenu>
          </ContextMenu>
        </Locale>
      ) : language == 'cn' ? (
        <Locale words={{ ...cn, ...cnCore }}>
          <ContextMenu api={table}>
            <HeaderMenu api={table}>
              <Grid data={data} columns={columns} init={init} />
            </HeaderMenu>
          </ContextMenu>
        </Locale>
      ) : null}
    </div>
  );
}
