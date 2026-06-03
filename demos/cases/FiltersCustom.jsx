import { getData } from '../data';
import { Grid } from '../../src';
import StatusCell from '../custom/StatusCell.jsx';
import AvatarCell from '../custom/AvatarCell.jsx';
import './FiltersCustom.css';

const { allData, countries, users } = getData();

const columns = [
  { id: 'id', width: 50 },
  {
    id: 'firstName',
    header: [
      'First Name',
      {
        filter: {
          type: 'text',
          config: {
            icon: 'wxi-search',
            clear: true,
          },
        },
      },
    ],
    footer: 'First Name',
  },
  {
    id: 'lastName',
    header: [
      'Last Name',
      {
        filter: {
          type: 'text',
          config: {
            icon: 'wxi-search',
            clear: true,
          },
        },
      },
    ],
    footer: 'Last Name',
  },
  {
    id: 'country',
    header: [
      'Country',
      {
        filter: {
          type: 'richselect',
          config: {
            options: countries,
            template: (opt) => `${opt.id}. ${opt.label}`,
          },
        },
      },
    ],
    options: countries,
  },
  {
    id: 'checked',
    header: [
      'Active',
      {
        filter: {
          type: 'richselect',
          config: {
            template: (opt) => `● ${opt.label}`,
            options: [
              { id: 1, label: 'active' },
              { id: 2, label: 'non-active' },
            ],
            handler: (value, filter) => {
              if (!filter) return true;
              return value === filter || (!value && filter == 2);
            },
          },
        },
      },
    ],
    cell: StatusCell,
  },
  {
    id: 'assigned',
    header: [
      'Assigned',
      {
        filter: {
          type: 'multiselect',
          config: {
            cell: AvatarCell,
          },
        },
      },
    ],
    options: users.map((user) => ({ ...user, name: user.label })),
    cell: AvatarCell,
  },
];

export default function FiltersCustom() {
  return (
    <div className="wx-aabv6s8T demo" style={{ padding: '20px' }}>
      <h4 className="wx-aabv6s8T">Grid with custom filtering in header</h4>
      <div className="wx-aabv6s8T" style={{ height: '400px' }}>
        <Grid
          data={allData}
          columns={columns}
          cellStyle={(_row, column) =>
            column.id === 'assigned' ? 'vcenter' : ''
          }
        />
      </div>
    </div>
  );
}
