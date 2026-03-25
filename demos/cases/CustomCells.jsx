import { useContext, useMemo, useCallback } from 'react';
import { context } from '@svar-ui/react-core';
import { Grid } from '../../src';
import { getData } from '../data';

import CheckboxCell from '../custom/CheckboxCell.jsx';
import AvatarCell from '../custom/AvatarCell.jsx';
import HeaderTextCell from '../custom/HeaderTextCell.jsx';
import FooterTextCell from '../custom/FooterTextCell.jsx';

import './CustomCells.css';

export default function CustomCells() {
  const helpers = useContext(context.helpers);
  const { data } = useMemo(() => getData(), []);

  const columns = useMemo(
    () => [
      {
        id: 'id',
        width: 50,
        header: [{ cell: HeaderTextCell, colspan: 3 }],
        footer: [
          {
            cell: FooterTextCell,
            colspan: 3,
            text: 'Custom footer content',
          },
        ],
      },
      {
        id: 'checked',
        cell: CheckboxCell,
        width: 36,
      },
      { id: 'avatar', cell: AvatarCell, width: 350 },
    ],
    [],
  );

  const action = useCallback(
    (actionName, ev) => {
      const { value, row, column } = ev;
      const event = `event: ${actionName}\n`;
      const val = `value: ${value}\n`;
      const r = `row ID: ${row}\n`;
      const c = `col ID: ${column}\n`;

      helpers.showNotice({
        text: event + val + r + c,
      });
    },
    [helpers],
  );

  return (
    <div className="wx-YnGZuqct demo" style={{ padding: '20px' }}>
      <h4>Table with custom cells and templates</h4>
      <div style={{ height: '320px', maxWidth: '800px' }}>
        <Grid
          sizes={{ rowHeight: 70 }}
          data={data}
          columns={columns}
          footer
          cellStyle={(row, col) => {
            let css = '';
            if (col.id == 'id') css = 'wx-YnGZuqct vcenter';
            else if (col.id == 'checked') css = 'wx-YnGZuqct vcentercontrol';
            return css;
          }}
          onCustomCheck={(ev) => action('checkbox', ev)}
        />
      </div>
    </div>
  );
}
