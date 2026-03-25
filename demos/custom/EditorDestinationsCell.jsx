import { useMemo } from 'react';
import './EditorDestinationsCell.css';

function EditorDestinationsCell(props) {
  const { data } = props;

  const countriesCount = useMemo(() => data.length, [data]);

  if (Array.isArray(data)) {
    return (
      <div className="wx-uHkWSzv3">
        <span className="wx-uHkWSzv3">
          {countriesCount && countriesCount <= 3 ? (
            data.map(item => item.label).join(', ')
          ) : countriesCount > 3 ? (
            <>
              {data.slice(0, 3).map(item => item.label).join(', ')} and{' '}
              {countriesCount - 3} more
            </>
          ) : (
            <span className="empty wx-uHkWSzv3">not selected</span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="custom-option wx-uHkWSzv3">
      <div className="info wx-uHkWSzv3">
        <div className="label wx-uHkWSzv3">
          {data.flag} {data.label}
        </div>
        <div className="code wx-uHkWSzv3">({data.code})</div>
      </div>
    </div>
  );
}

export default EditorDestinationsCell;
