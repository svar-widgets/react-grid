import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Button } from '@svar-ui/react-core';
import { RestDataProvider } from '@svar-ui/grid-data-provider';
import { Grid } from '../../src/';

function RestBackend() {
  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Title',
        flexgrow: 1,
        sort: true,
        editor: 'text',
      },
      {
        id: 'year',
        header: 'Year',
        width: 100,
        sort: true,
        editor: 'text',
      },
      {
        id: 'votes',
        header: 'Votes',
        width: 100,
        sort: true,
        editor: 'text',
      },
    ],
    [],
  );

  const [data, setData] = useState([]);

  const provider = useMemo(
    () =>
      new RestDataProvider(
        'https://master--svar-grid-go--dev.webix.io/films',
        (obj) => {
          obj.year = obj.year * 1;
          obj.votes = obj.votes * 1;
        },
      ),
    [],
  );

  useEffect(() => {
    provider.getData().then((v) => setData(v));
  }, [provider]);

  const apiRef = useRef(null);

  const deleteRow = useCallback(() => {
    const id = apiRef.current.getState().selectedRows[0];
    if (id) {
      apiRef.current.exec('delete-row', { id });
    }
  }, []);

  const addRow = useCallback(() => {
    apiRef.current.exec('add-row', {
      row: { name: 'New Film', year: '2022', votes: 1 },
    });
  }, []);

  const init = useCallback(
    (api) => {
      api.setNext(provider);
    },
    [provider],
  );

  return (
    <div style={{ padding: 20, height: 600 }}>
      <div style={{ paddingBottom: 10 }}>
        <Button onClick={addRow} type="primary">
          Add row
        </Button>
        <Button onClick={deleteRow}>Delete row</Button>
      </div>

      <Grid data={data} columns={columns} init={init} ref={apiRef} />
    </div>
  );
}

export default RestBackend;
