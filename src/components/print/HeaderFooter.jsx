import { useContext } from 'react';
import { getPrintCellStyle, getPrintFilterValue } from '@svar-ui/grid-store';
import storeContext from '../../context';
import { styleObject } from '@svar-ui/lib-react';
import './HeaderFooter.css';

export default function HeaderFooter(props) {
  const { columns, type, columnStyle } = props;

  const api = useContext(storeContext);
  const { filterValues, _columns, _sizes: sizes } = api.getState();

  function getColumnCss(column) {
    return columnStyle ? ' ' + columnStyle(column) : '';
  }

  return (
    <>
      {columns.map((row, i) => (
        <tr key={i}>
          {row.map((cell) => {
            const column = _columns.find((c) => c.id === cell.id);
            const className =
              `wx-print-cell-${type}` +
              `${getColumnCss(column)}` +
              `${cell.filter ? ' wx-print-cell-filter' : ''}` +
              `${cell.vertical ? ' wx-vertical' : ''}`;

            const CellComp = cell.cell;

            return (
              <th
                key={cell.id}
                style={styleObject(getPrintCellStyle(cell, sizes.columnWidth))}
                className={'wx-Gy81xq2u ' + className}
                rowSpan={cell.rowspan}
                colSpan={cell.colspan}
              >
                {CellComp ? (
                  <CellComp
                    api={api}
                    cell={Object.fromEntries(
                      Object.entries(cell).filter(([key]) => key !== 'cell'),
                    )}
                    column={column}
                    row={i}
                  />
                ) : cell.filter ? (
                  <div className="wx-Gy81xq2u wx-print-filter">
                    {getPrintFilterValue(filterValues, _columns, cell)}
                  </div>
                ) : (
                  <div className="wx-Gy81xq2u wx-text">{cell.text ?? ''}</div>
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </>
  );
}
