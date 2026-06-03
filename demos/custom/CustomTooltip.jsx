import { useMemo } from 'react';
import './CustomTooltip.css';

export default function CustomTooltip({ data }) {
  const stars = useMemo(() => {
    const res = [];
    const max = 5;
    const n = Math.round((data.row.stars / 10000) * max);
    for (let i = 0; i < max; i++) {
      if (i < n) res.push({ filled: true });
      else res.push({});
    }
    return res;
  }, [data]);

  return (
    <div className="wx-RZBhyix5 data">
      <div className="wx-RZBhyix5 line">
        <b>Name:</b> {data.row.firstName} {data.row.lastName}
      </div>
      <div className="wx-RZBhyix5 line">
        <b>City:</b> {data.row.city || 'Unknown'}
      </div>
      <div className="wx-RZBhyix5 line">
        <b>Email:</b> {data.row.email}
      </div>
      <div className="wx-RZBhyix5 line">
        <b>Address:</b> {data.row.street}, {data.row.zipCode}
      </div>
      <div className="wx-RZBhyix5 line stars">
        {stars.map((star, idx) => (
          <i
            key={idx}
            className={`wx-RZBhyix5 wxi-cat${star.filled ? ' filled' : ''}`}
          ></i>
        ))}
        ({data.row.stars})
      </div>
      <div className="wx-RZBhyix5 line">
        <b>Followers:</b> {data.row.followers}
      </div>
    </div>
  );
}
