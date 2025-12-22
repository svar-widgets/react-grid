import { useMemo, useContext } from 'react';
import { Toolbar } from '@svar-ui/react-toolbar';
import {
	defaultToolbarButtons,
	assignChecks,
	handleAction,
} from '@svar-ui/grid-store';
import { locale } from '@svar-ui/lib-dom';
import { en } from '@svar-ui/grid-locales';
import { context } from '@svar-ui/react-core';
import { useStoreLater } from '@svar-ui/lib-react';

export default function ToolbarComponent({
	api,
	items = [...defaultToolbarButtons],
	onClick,
	...restProps
}) {
	const i18nContext = useContext(context.i18n);
	const _ =
		i18nContext?.getGroup('grid') || locale(en).getGroup('grid');

	const selectedRows = useStoreLater(api, 'selectedRows');
	const data = useStoreLater(api, 'data');
	const history = useStoreLater(api, 'history');
	const reorder = useStoreLater(api, 'reorder');
	const undo = useStoreLater(api, 'undo');

	const rowActions = [
		'open-editor',
		'delete-row',
		'copy-row',
		'cut-row',
		'paste-row',
		'move-item:up',
		'move-item:down',
	];
	const historyActions = ['undo', 'redo'];

	const normalizedItems = useMemo(() => {
		const filtered = filterItems(items);
		const normalized = assignChecks(filtered);
		applyLocale(normalized);
		return normalized;

		function filterItems(items) {
			if (undo && reorder) return items;
			return items.filter(({ id }) => {
				return !(
					(!undo && (id === 'undo' || id === 'redo')) ||
					(!reorder &&
						(id === 'move-item:up' || id === 'move-item:down'))
				);
			});
		}

		function applyLocale(options) {
			options.forEach(op => {
				if (op.text) op.text = _(op.text);
				if (op.menuText) op.menuText = _(op.menuText);
				if (op.items) op.items = applyLocale(op.items);
			});
		}
	}, [items, undo, reorder, _]);

	const buttons = useMemo(() => {
		const finalButtons = [];
		const selected = selectedRows?.length;
		normalizedItems.forEach(item => {
			const action = item.id;
			if (action === 'add-row') {
				finalButtons.push(item);
			} else if (rowActions.includes(action)) {
				if (!selected) return;
				finalButtons.push({
					...item,
					disabled:
						item.isDisabled &&
						item.isDisabled(
							action === 'paste-row' ? api : selectedRows,
							data
						),
				});
			} else if (historyActions.includes(action)) {
				finalButtons.push({
					...item,
					disabled: item.isDisabled(history),
				});
			} else {
				finalButtons.push(item);
			}
		});
		return finalButtons;
	}, [normalizedItems, selectedRows, data, history, api, rowActions, historyActions]);

	const handleClicks = ev => {
		const option = ev.item;
		if (option) handleAction(api, option.id);
		onClick && onClick(ev);
	};

	return <Toolbar items={buttons} onClick={handleClicks} {...restProps} />;
}
