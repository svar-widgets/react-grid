import { useMemo, useContext } from 'react';
import HeaderCell from './HeaderCell.jsx';
import FooterCell from './FooterCell.jsx';
import { isCommunity } from '@svar-ui/grid-store';
import storeContext from '../context';
import './HeaderFooter.css';
import { useStore } from '@svar-ui/lib-react';

function HeaderFooter({
  deltaLeft,
  contentWidth,
  columns,
  type = 'header',
  columnStyle,
  bodyHeight,
  ...restProps
}) {
  const api = useContext(storeContext);
  const sizes = useStore(api, '_sizes');
  const split = useStore(api, 'split');

  const rowHeights = useMemo(() => {
    return sizes?.[`${type}RowHeights`];
  }, [sizes, type]);

  const renderedHeader = useMemo(() => {
    let res = [];
    if (columns && columns.length) {
      const rowsCount = columns[0][type].length;
      for (let ri = 0; ri < rowsCount; ri++) {
        let inSpan = 0;
        let left = 0;
        res.push([]);
        columns.forEach((col, ci) => {
          const cell = { ...col[type][ri] };
          if (!inSpan) {
            cell.left = left;
            res[ri].push(cell);
          }

          left += col.width;

          if (cell.colspan > 1) {
            inSpan = cell.colspan - 1;

            if (!isCommunity()) {
              if (col.right) {
                // if column is fixed on the right and have colspan we need to recalculate right position
                let right = col.right;
                for (let i = 1; i < cell.colspan; i++) {
                  right -= columns[ci + i].width;
                }
                cell.right = right;
              }
            }
          } else if (inSpan) {
            inSpan--;
          }
        });
      }
    }
    return res;
  }, [columns, type]);

  const hasSplit = useMemo(() => {
    return split?.left || split?.right;
  }, [split]);

  function getColumn(id) {
    return columns.find((c) => c.id === id);
  }

  function isLast(cell, ind) {
    let idx = ind;
    if (cell.rowspan) idx += cell.rowspan - 1;
    return idx === renderedHeader.length - 1;
  }

  function isSort(cell, ind, column) {
    if (!column.sort) return false;
    for (let i = renderedHeader.length - 1; i >= 0; i--) {
      const cell = column.header[i];
      if (!cell.filter && !cell._hidden) return ind === i;
    }
    return isLast(cell, ind);
  }

  return (
    <div
      className={`wx-sAsPVaUK wx-${type}`}
      style={{ paddingLeft: `${deltaLeft}px`, width: `${contentWidth}px` }}
      role="rowgroup"
    >
      {renderedHeader.map((row, i) => (
        <div
          key={i}
          className={
            type === 'header' ? 'wx-sAsPVaUK wx-h-row' : 'wx-sAsPVaUK wx-f-row'
          }
          style={{ height: `${rowHeights?.[i]}px`, display: 'flex' }}
          role="row"
        >
          {row.map((cell) => {
            const column = getColumn(cell.id);
            return type === 'header' ? (
              <HeaderCell
                key={cell.id}
                cell={cell}
                columnStyle={columnStyle}
                column={column}
                row={i}
                lastRow={isLast(cell, i)}
                bodyHeight={bodyHeight}
                sortRow={isSort(cell, i, column)}
                hasSplit={hasSplit}
                deltaLeft={deltaLeft}
                {...restProps}
              />
            ) : (
              <FooterCell
                key={cell.id}
                cell={cell}
                columnStyle={columnStyle}
                column={column}
                row={i}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default HeaderFooter;
