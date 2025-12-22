import { useState, useEffect, useMemo, useCallback } from "react";
import { getData } from "../data";
import { Grid, getEditorConfig } from "../../src";
import { Toolbar } from "@svar-ui/react-toolbar";
import { Editor, registerEditorItem } from "@svar-ui/react-editor";
import { RichSelect, DatePicker } from "@svar-ui/react-core";

const { data, countries } = getData();

registerEditorItem("richselect", RichSelect);
registerEditorItem("datepicker", DatePicker);

export default function ExternalToolbar() {
	const [api, setApi] = useState(null);
	const [dataToEdit, setDataToEdit] = useState(null);

	const historyStore = useMemo(
		() => (api ? api.getReactiveState()?.history : null),
		[api]
	);
	const [history, setHistory] = useState(undefined);

	const selectedRowsStore = useMemo(
		() => (api ? api.getReactiveState()?.selectedRows : null),
		[api]
	);
	const [selectedRows, setSelectedRows] = useState(undefined);

	useEffect(() => {
		if (!historyStore) {
			setHistory(undefined);
			return;
		}
		const unsubscribe = historyStore.subscribe((v) => {
			setHistory(v);
		});
		return () => {
			if (typeof unsubscribe === "function") unsubscribe();
		};
	}, [historyStore]);

	useEffect(() => {
		if (!selectedRowsStore) {
			setSelectedRows(undefined);
			return;
		}
		const unsubscribe = selectedRowsStore.subscribe((v) => {
			setSelectedRows(v);
		});
		return () => {
			if (typeof unsubscribe === "function") unsubscribe();
		};
	}, [selectedRowsStore]);

	const init = useCallback((obj) => {
		setApi(obj);

		obj.intercept("open-editor", () => {
			return false;
		});
	}, []);

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: "First Name",
			editor: "text",
			width: 160,
		},
		{
			id: "lastName",
			header: "Last Name",
			editor: "text",
			width: 160,
		},
		{
			id: "country",
			header: "Country",
			editor: "richselect",
			options: countries,
			width: 160,
		},
		{
			id: "date",
			header: "Date",
			width: 100,
			editor: "datepicker",
			template: v => (v ? v.toLocaleDateString() : ""),
		},
		{
			id: "companyName",
			header: "Description",
			editor: "textarea",
			flexgrow: 1,
		},
	];

	function onClick(item) {
		switch (item.id) {
			case "add-before": {
				const { selectedRows, data } = api.getState();
				const id = selectedRows[0];
				if (id) api.exec("add-row", { row: {}, before: id });
				else if (data.length)
					api.exec("add-row", { row: {}, before: data[0].id });
				break;
			}
			case "add-after": {
				const id = api.getState().selectedRows[0];
				if (id) api.exec("add-row", { row: {}, after: id });
				else api.exec("add-row", { row: {} });
				break;
			}
			case "delete": {
				const id = api.getState().selectedRows[0];
				if (id) api.exec("delete-row", { id });
				break;
			}
			case "edit": {
				const id = api.getState().selectedRows[0];
				if (id) setDataToEdit(api.getRow(id));
				break;
			}
			case "undo":
				api.exec("undo");
				break;
			case "redo":
				api.exec("redo");
				break;
		}
	}

	const items = [
		{
			id: "add-before",
			comp: "button",
			icon: "wxi-plus",
			text: "Add: before",
			type: "primary",
			handler: onClick,
		},
		{
			id: "add-after",
			comp: "button",
			icon: "wxi-plus",
			text: "Add: after",
			type: "primary",
			handler: onClick,
		},
		{ comp: "separator" },
		{
			id: "edit",
			comp: "icon",
			icon: "wxi-edit",
			handler: onClick,
		},
		{
			id: "delete",
			comp: "icon",
			icon: "wxi-delete",
			handler: onClick,
		},
		{ comp: "spacer" },
		{
			id: "undo",
			comp: "icon",
			icon: "wxi-undo",
			handler: onClick,
		},
		{
			id: "redo",
			comp: "button",
			icon: "wxi-redo",
			handler: onClick,
		},
	];

	const normalizedItems = useMemo(() => {
		if (api) {
			return items.map(item => {
				switch (item.id) {
					case "edit":
					case "delete": {
						return {
							...item,
							disabled: !selectedRows?.length,
						};
					}
					case "undo": {
						return {
							...item,
							disabled: !history?.undo,
						};
					}
					case "redo": {
						return {
							...item,
							disabled: !history?.redo,
						};
					}
					default: {
						return item;
					}
				}
			});
		}
	}, [api, selectedRows, history]);

	return (
		<div style={{ padding: "20px" }}>
			<Toolbar items={normalizedItems} />
			<Grid data={data} columns={columns} init={init} undo />
			{dataToEdit ? (
				<Editor
					values={dataToEdit}
					items={getEditorConfig(columns)}
					placement="sidebar"
					onSave={({ values }) => {
						api.exec("update-row", {
							id: dataToEdit.id,
							row: values,
						});
					}}
					onAction={() => setDataToEdit(null)}
				/>
			) : null}
		</div>
	);
}
