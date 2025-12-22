import { useEffect, useRef, useState } from 'react';
import { getRenderValue } from '@svar-ui/grid-store';
import './Tooltip.css';

function Tooltip(props) {
  const { content: Content = null, api, children } = props;

  const areaRef = useRef(null);
  const tooltipRef = useRef(null);

  const [areaCoords, setAreaCoords] = useState();
  const [tooltipData, setTooltipData] = useState();
  const [pos, setPos] = useState();

  function findAttribute(node) {
    while (node) {
      if (node.getAttribute) {
        const id = node.getAttribute('data-row-id');
        const colId = node.getAttribute('data-col-id');
        if (id && api && colId) {
          const col = api.getColumn(colId);
          return { id, col, target: node };
        }
      }
      node = node.parentNode;
    }
    return { id: null, col: null, target: null };
  }

  useEffect(() => {
    const node = tooltipRef.current;
    if (node && areaCoords && pos) {
      let tooltipCoords = node.getBoundingClientRect();
      let newLeft = pos.left;
      let newTop = pos.top;
      if (tooltipCoords.right >= areaCoords.right) {
        newLeft = areaCoords.width - tooltipCoords.width - 5;
      }
      if (tooltipCoords.bottom >= areaCoords.bottom) {
        newTop = pos.top - (tooltipCoords.bottom - areaCoords.bottom + 2);
      }
      if (newLeft !== pos.left || newTop !== pos.top) {
        setPos({ ...pos, left: newLeft, top: newTop });
      }
    }
  }, [areaCoords, pos]);

  const timerRef = useRef();
  const TIMEOUT = 300;

  const debounce = (code) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      code();
    }, TIMEOUT);
  };

  function move(e) {
    const { id, target, col } = findAttribute(e.target);
    setPos(null);
    if (!id) {
      clearTimeout(timerRef.current);
      return;
    }
    const clientX = e.clientX;

    debounce(() => {
      let text = '';
      if (id) {
        const data = getTooltipData(id);
        setTooltipData(data);
        text = getTooltipText(col, data);
      }
      const targetCoords = target.getBoundingClientRect();
      const areaEl = areaRef.current;
      if (!areaEl) return;
      const areaRect = areaEl.getBoundingClientRect();
      setAreaCoords(areaRect);
      const top = targetCoords.top + targetCoords.height - areaRect.top;
      const left = clientX - areaRect.left;
      setPos({ top, left, col, text });
    });
  }

  function getTooltipData(id) {
    return api.getRow(id);
  }

  function getTooltipText(col, data) {
    data = data || tooltipData;
    if (typeof col.tooltip === 'function') return col.tooltip(data);
    return getRenderValue(data, col) || '';
  }

  return (
    <div className="wx-RYccULtD wx-area" ref={areaRef} onMouseMove={move}>
      {pos && pos.col.tooltip !== false && (Content || pos.text) ? (
        <div
          className="wx-RYccULtD tooltip"
          role="alert"
          tabIndex={0}
          ref={tooltipRef}
          style={{ top: pos.top + 'px', left: pos.left + 'px' }}
        >
          {Content ? <Content data={tooltipData} /> : pos.text}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export default Tooltip;
