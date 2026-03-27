export function getStyle(width, flexgrow, fixed, left, right, height) {
  const style = {};

  if (width) {
    style.width = `${width}px`;
    style.minWidth = `${width}px`;
  }

  if (flexgrow) {
    style.flexGrow = flexgrow;
  }

  if (height) {
    style.height = `${height}px`;
  }

  if (fixed) {
    style.position = 'sticky';
    if (fixed.left) {
      style.left = `${left}px`;
    }
    if (fixed.right) {
      style.right = `${right}px`;
    }
  }

  return style;
}

export function getCssName(column, cell, columnStyle) {
  let css = '';

  if (column.fixed) {
    for (const pos in column.fixed) {
      let isShadow = column.fixed[pos] === -1;
      if (!isShadow && column.fixed.leftSize && cell.colspan) {
        const spanIndex = cell.colspan + column._colindex - 1;
        isShadow = spanIndex === column.fixed.leftSize;
      }
      css += isShadow ? 'wx-shadow ' : 'wx-fixed ';
    }
  }
  css += cell.rowspan > 1 ? 'wx-rowspan ' : '';
  css += cell.colspan > 1 ? 'wx-colspan ' : '';
  css += cell.vertical ? 'wx-vertical ' : '';
  css += columnStyle ? columnStyle(column) + ' ' : '';
  return css;
}
