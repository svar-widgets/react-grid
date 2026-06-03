import { useContext, useMemo } from 'react';
import { locale } from '@svar-ui/lib-dom';
import { en } from '@svar-ui/grid-locales';
import { context } from '@svar-ui/react-core';
import MultiSelect from '../MultiSelect.jsx';
import './MultiSelect.css';

export default function MultiSelectFilter({
  filter,
  column,
  action,
  filterValue,
}) {
  const i18n = useContext(context.i18n);
  const _ = (i18n?.getGroup('grid')) || locale(en).getGroup('grid');

  const config = useMemo(() => {
    const obj = filter?.config || {};
    return { clear: true, ...obj };
  }, [filter]);

  const options = useMemo(
    () => config.options || column.options,
    [config, column],
  );

  const text = useMemo(() => {
    const len = filterValue?.length;
    if (!len) return '';
    if (len < 3)
      return filterValue.map((v) => column.optionsMap.get(v)).join(', ');
    return len + ' ' + _('selected');
  }, [filterValue, column, _]);

  function filterRows({ value }) {
    action({ value, key: column.id });
  }

  function handleKeyDown(ev) {
    if (ev.key !== 'Tab') ev.preventDefault();
  }

  return (
    <div style={{ width: '100%' }} onKeyDown={handleKeyDown}>
      <MultiSelect
        placeholder={''}
        {...config}
        options={options}
        value={filterValue || []}
        text={text}
        onChange={filterRows}
      />
    </div>
  );
}
