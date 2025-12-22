import { useContext, useMemo } from 'react';
import { ContextMenu as WxContextMenu } from '@svar-ui/react-menu';
import { context } from '@svar-ui/react-core';
import { useStoreLater } from '@svar-ui/lib-react';

import {
  defaultMenuOptions,
  assignChecks,
  handleAction,
} from '@svar-ui/grid-store';
import { locale } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/grid-locales";
import './ContextMenu.css';

function ContextMenu({
  api,
  options = [...defaultMenuOptions],
  at = 'point',
  resolver,
  dataKey,
  filter,
  css,
  children,
  handler,
  onClick,
}) {
  const i18n = useContext(context.i18n);
  const _ = useMemo(() => i18n ? i18n.getGroup('grid') : locale(en).getGroup('grid'), [i18n]);

  const selectedRows = useStoreLater(api, 'selectedRows');
  const data = useStoreLater(api, 'data');
  const reorder = useStoreLater(api, 'reorder');

  const normalizedOptions = useMemo(() => {
    const filtered = filterItems(options);
    const normalized = assignChecks(filtered);
    applyLocale(normalized);
    return normalized;
  }, [options, reorder, data]);

  function applyLocale(options) {
    options.forEach(op => {
      if (op.text) op.text = _(op.text);
      if (op.subtext) op.subtext = _(op.subtext);
      if (op.data) op.data = applyLocale(op.data);
    });
  }

  const finalOptions = useMemo(() => {
    const opts = [];
    normalizedOptions.forEach(item => {
      switch (item.id) {
        case 'move-item:up':
        case 'move-item:down':
        case 'paste-row': {
          if (!item.isDisabled || !api) {
            opts.push(item);
            return;
          }
          
          const disabled = item.isDisabled(
            item.id === 'paste-row' ? api : selectedRows,
            data
          );

          opts.push({
            ...item,
            disabled,
          });
          break;
        }
        default: {
          opts.push(item);
          break;
        }
      }
    });
    return opts;
  }, [normalizedOptions, selectedRows, data, api]);

  function getItem(id) {
    if (!selectedRows.includes(id)) {
      api.exec('select-row', { id });
    }
    return id;
  }

  const handleClicks = (ev) => {
    const option = ev.action;
    if (option) handleAction(api, option.id);
    onClick && onClick(ev);
  };

  function filterItems(items) {
    if (reorder) return items;
    return items.filter(({ id }) => {
      return !(id === 'move-item:up' || id === 'move-item:down');
    });
  }

  const resolverProp = resolver !== undefined ? resolver : getItem;

  return (
    <WxContextMenu
      css={`wx-KKGLK8TH wx-table-menu ${css}`}
      at={at}
      dataKey={dataKey}
      handler={handler}
      options={finalOptions}
      resolver={resolverProp}
      filter={filter}
      onClick={handleClicks}
    >
      {children}
    </WxContextMenu>
  );
}

export default ContextMenu;
