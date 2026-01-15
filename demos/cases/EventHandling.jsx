import { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { Field, Switch, Button } from '@svar-ui/react-core';
import { EventResolver } from '@svar-ui/lib-state';
import { RestDataProvider } from '@svar-ui/grid-data-provider';
import { context } from '@svar-ui/react-core';
import { getBackend } from '../data';
import { Grid } from '../../src';

export default function EventHandling() {
  const { columns } = useMemo(() => getBackend(), []);
  const helpers = useContext(context.helpers);
  const [blockSelect, setBlockSelect] = useState(false);
  const kapiRef = useRef();

  const [data, setData] = useState([]);
  const provider = useMemo(
    () =>
      new RestDataProvider(
        'https://master--svar-grid-go--dev.webix.io/films',
        (o) => o,
      ),
    [],
  );

  useEffect(() => {
    let mounted = true;
    provider.getData().then((v) => {
      if (mounted) setData(v);
    });
    return () => {
      mounted = false;
    };
  }, [provider]);

  const blockSelectRef = useRef(blockSelect);
  useEffect(() => {
    blockSelectRef.current = blockSelect;
  }, [blockSelect]);

  async function addRow() {
    const ev = await kapiRef.current.exec('add-row', {
      row: {},
      done: (ev) => {
        helpers.showNotice({ text: 'row added, id:' + ev.row.id });
      },
    });
    helpers.showNotice({ text: '[add] finish, server:' + ev.response.id });
  }

  async function deleteRow() {
    await kapiRef.current.exec('delete-row', {
      id: kapiRef.current.getState().selectedRows[0],
      done: () => {
        helpers.showNotice({ text: '[delete] store' });
      },
    });
    helpers.showNotice({ text: '[delete] finish' });
  }

  function init(api) {
    api.setNext(new EventResolver('done')).setNext(provider);

    api.on('select-row', log('[select] on'));
    api.intercept('select-row', () => {
      if (blockSelectRef.current) return false;
      else log('[select] intercept')();
    });

    api.on('add-row', log('[add] on'));
    api.intercept('add-row', log('[add] intercept'));

    api.on('delete-row', log('[delete] on'));
    api.intercept('delete-row', log('[delete] intercept'));

    kapiRef.current = api;
  }

  function log(text) {
    return () => helpers.showNotice({ text });
  }

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <Field label="Prevent selection after adding">
          <Switch
            value={blockSelect}
            onChange={({ value }) => setBlockSelect(value)}
          />
        </Field>
        <Button onClick={addRow} type="primary">
          Add row
        </Button>
        <Button onClick={deleteRow}>Delete row</Button>
        <hr />
        <Grid
          init={init}
          data={data}
          columns={columns}
          onSelectRow={log('[select] handler')}
          onAddRow={log('[add] handler')}
          onDeleteRow={log('[delete] handler')}
        />
      </div>
    </div>
  );
}
