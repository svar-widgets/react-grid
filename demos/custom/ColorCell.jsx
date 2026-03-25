import './ColorCell.css';

export default function ColorCell({ row, column }) {
  const value = row[column.id];

  return (
    <>
      {value && (
        <div
          className="color_block wx-LiqCCOWu"
          style={{ backgroundColor: value }}
        >
          <span className="wx-LiqCCOWu">{value}</span>
        </div>
      )}
    </>
  );
}
