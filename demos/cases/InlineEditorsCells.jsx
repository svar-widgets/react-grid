import { useMemo } from 'react';
import { Grid, registerInlineEditor } from '../../src';
import { getData } from '../data';
import SelectEditorCell from '../custom/SelectEditorCell.jsx';
import EditorDateCell from '../custom/EditorDateCell.jsx';
import EditorSelectCell from '../custom/EditorSelectCell.jsx';
import EditorDestinationsCell from '../custom/EditorDestinationsCell.jsx';
import DestinationCell from '../custom/DestinationCell.jsx';
import ColorEditor from '../custom/ColorEditor.jsx';
import ColorCell from '../custom/ColorCell.jsx';

export default function InlineEditorsCells() {
  const { allData: data, countries, users } = useMemo(() => getData(), []);

  registerInlineEditor('color', ColorEditor);

  const columns = useMemo(
    () => [
      { id: 'id', width: 50 },
      {
        id: 'country',
        header: 'Country - "combo"',
        editor: {
          type: 'combo',
          config: { cell: EditorSelectCell },
        },
        options: countries,
        cell: SelectEditorCell,
        width: 180,
      },
      {
        id: 'date',
        header: 'Date - "datepicker"',
        width: 180,
        editor: {
          type: 'datepicker',
          config: { cell: EditorDateCell },
        },
        template: (v) => (v ? v.toLocaleDateString() : ''),
      },
      {
        id: 'user',
        header: 'User - "richselect"',
        width: 180,
        editor: {
          type: 'richselect',
          config: { cell: EditorSelectCell },
        },
        options: users,
        cell: SelectEditorCell,
      },
      {
        id: 'destinations',
        header: 'Destinations - "multiselect"',
        editor: {
          type: 'multiselect',
          config: {
            cell: EditorDestinationsCell,
            dropdown: { width: 'auto' },
          },
        },
        options: countries,
        width: 130,
        cell: DestinationCell,
      },
      /*{
        id: 'destinations-template',
        header: 'Destinations - "multiselect" with template',
        editor: {
          type: 'multiselect',
          config: {
            template: (value) => {
              if (Array.isArray(value)) {
                return value.map(v => `${v.flag}`).join(' ');
              }
              return `${value.label} ${value.flag}`;
            },
          },
        },
        options: countries,
        width: 300,
        template: (value) => {
          return value
            .map(v => countries.find(c => c.id === v)?.flag)
            .join(' ');
        },
      },*/
      {
        id: 'color',
        header: 'Color - custom "color"',
        editor: 'color',
        width: 180,
        cell: ColorCell,
      },
    ],
    [countries, users],
  );

  useMemo(() => {
    data.forEach(row => {
      row['destinations-template'] = [...row.destinations];
    });
  }, [data]);

  return (
    <div style={{ padding: '20px' }}>
      <h4>Editable cells: inline editors with custom cells</h4>
      <div style={{ height: '500px' }}>
        <Grid data={data} columns={columns} />
      </div>
    </div>
  );
}
