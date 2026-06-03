import { getRenderValue } from '@svar-ui/grid-store';
import { Tooltip as BaseTooltip } from '@svar-ui/react-core';
import { getID } from '@svar-ui/lib-dom';

function Tooltip(props) {
  const {
    api,
    at = 'point',
    overflow = false,
    content: Content = null,
    resolver,
    ...restProps
  } = props;

  function defaultResolver(element) {
    if (!api) return null;

    const rowId = getID(element, 'data-row-id');
    const columnId = getID(element, 'data-col-id');

    if (!rowId || !columnId) return null;

    const row = api.getRow(rowId);
    const column = api.getColumn(columnId);

    if (column.tooltip === false) return null;
    if (overflow && element.scrollWidth <= element.clientWidth) return null;

    if (Content) {
      return { data: { row, column } };
    } else {
      if (typeof column.tooltip === 'function') {
        return column.tooltip(row);
      }
      return getRenderValue(row, column);
    }
  }

  const resolverFn = resolver || defaultResolver;

  return (
    <BaseTooltip
      at={at}
      content={Content}
      resolver={resolverFn}
      {...restProps}
    />
  );
}

export default Tooltip;
