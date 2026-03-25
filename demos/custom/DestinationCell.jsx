import { useMemo } from 'react';
import './DestinationCell.css';

export default function DestinationCell({ row, column }) {
  const data = useMemo(() => {
    const ids = row[column.id];
    const options = column.options;
    if (!Array.isArray(ids) || !options) return [];
    return ids.map(id => options.find(o => o.id == id)).filter(Boolean);
  }, [row, column]);

  const countriesCount = useMemo(() => data.length, [data]);

  return (
    <span className="wx-X23D0eJ9">
      {countriesCount && countriesCount <= 3 ? (
        data.map(item => item.label).join(', ')
      ) : countriesCount > 3 ? (
        <>
          {data.slice(0, 3).map(item => item.label).join(', ')} and {countriesCount - 3} more
        </>
      ) : (
        <span className="empty wx-X23D0eJ9">not selected</span>
      )}
    </span>
  );
}
