import { useRef } from 'react';
import { Grid } from '../../src';
import { Button } from '@svar-ui/react-core';
import { getData } from '../data';

const { clientData, clientColumns, treeData, treeFixedColumns } = getData();

function ProExport() {
  const api1 = useRef(null);
  const api2 = useRef(null);

  function exportCsv(api) {
    api.exec('export-data', {
      format: 'csv',
      fileName: 'clients',
      csv: {
        cols: ';',
      },
    });
  }

  return (
    <>
      <div style={{ padding: '20px' }}>
        <p>
          <Button type="primary" onClick={() => exportCsv(api1.current)}>
            Export to CSV
          </Button>
        </p>
        <div style={{ maxWidth: '800px' }}>
          <Grid
            footer={true}
            data={clientData}
            columns={clientColumns}
            ref={api1}
          />
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <p>
          <Button type="primary" onClick={() => exportCsv(api2.current)}>
            Export to CSV
          </Button>
        </p>
        <div style={{ maxWidth: '800px' }}>
          <Grid
            ref={api2}
            tree={true}
            data={treeData}
            columns={treeFixedColumns}
            footer={true}
          />
        </div>
      </div>
    </>
  );
}

export default ProExport;
