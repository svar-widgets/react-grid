import { useMemo } from 'react';
import { Grid } from '../../src';
import { getData } from '../data';
import './Sort.css';

export default function Sort() {
  const data = useMemo(() => {
    const { data } = getData();
    return data;
  }, []);

  const columns = useMemo(
    () => [
      { id: 'id', width: 50, sort: true },
      { id: 'city', header: 'City', width: 160, sort: true },
      { id: 'email', header: 'Email', width: 250, sort: true },
      { id: 'firstName', header: 'First Name', sort: true },
      { id: 'lastName', header: 'Last Name', sort: true },
    ],
    [],
  );

  const columnsSortOnUpdate = useMemo(
    () => [
      { id: 'id', width: 50, sort: true },
      { id: 'city', header: 'City', width: 160, sort: true, editor: 'text' },
      { id: 'firstName', header: 'First Name', sort: true, editor: 'text' },
      { id: 'lastName', header: 'Last Name', sort: true, editor: 'text' },
    ],
    [],
  );

  function init(api) {
    api.on('update-cell', () => {
      const marks = api.getState().sortMarks;
      for (let key in marks) {
        api.exec('sort-rows', {
          key,
          order: marks[key].order,
          add: marks[key].index ?? true,
        });
      }
    });
  }

  return (
    <div className="demo-container">
      <div>
        <h4>Click on header cells to sort the data</h4>
        <Grid data={data} columns={columns} />
      </div>
      <div>
        <h4>Resort data after editing a cell</h4>
        <Grid data={data} init={init} columns={columnsSortOnUpdate} />
      </div>
    </div>
  );
}
