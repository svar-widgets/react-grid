import './UserCell.css';

export default function UserCell({ row }) {
  return (
    <div className="wx-aacJZmsW container">
      <div className="wx-aacJZmsW avatar">
        <div className="wx-aacJZmsW user-avatar">
          {row.avatar ? (
            <img className="wx-aacJZmsW user-photo" alt="" src={row.avatar} />
          ) : null}
        </div>
      </div>
      <div className="wx-aacJZmsW info">
        <div className="wx-aacJZmsW name">{row.lastName}</div>
        <div className="wx-aacJZmsW mail">{row.email || ''}</div>
      </div>
    </div>
  );
}
