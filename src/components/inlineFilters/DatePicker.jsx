import { DatePicker } from '@svar-ui/react-core';
import './DatePicker.css';

export default function DatePickerFilter({ filter, column, action, filterValue }) {
  function filterRows({ value }) {
    action({ value, key: column.id });
  }

  return (
    <div className="wx-aaaK5VYO" style={{ width: '100%' }}>
      <DatePicker
        placeholder={''}
        clear={true}
        {...(filter?.config ?? {})}
        value={filterValue}
        onChange={filterRows}
      />
    </div>
  );
}
