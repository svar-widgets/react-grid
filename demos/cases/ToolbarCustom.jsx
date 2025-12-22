import { useState, useCallback, useContext } from "react";
import { getData } from "../data";
import {
	Grid,
	Toolbar,
	defaultToolbarButtons,
	getEditorConfig,
} from "../../src";
import { Editor, registerEditorItem } from "@svar-ui/react-editor";
import { RichSelect, DatePicker, context } from "@svar-ui/react-core";

const { data, countries } = getData();

registerEditorItem("richselect", RichSelect);
registerEditorItem("datepicker", DatePicker);

// filter default buttons
const outButtons = ["copy-row", "cut-row", "paste-row"];
const items = defaultToolbarButtons.filter(b => {
	return !outButtons.includes(b.id);
});

items.splice(1, 0, {
	id: "my-action",
	comp: "icon",
	icon: "wxi-cat",
});

export default function ToolbarCustom() {
	const helpers = useContext(context.helpers);
	const [api, setApi] = useState(null);
	const [dataToEdit, setDataToEdit] = useState(null);

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

	function handleClick(ev) {
		if (ev.item.id === "my-action") {
			helpers.showNotice({ text: "'My action' clicked" });
		}
	}

	const init = useCallback((obj) => {
		setApi(obj);

		obj.intercept("open-editor", () => {
			const id = obj.getState().selectedRows[0];
			if (id) setDataToEdit(obj.getRow(id));
			return false;
		});
	}, []);

	return (
		<div style={{ padding: "20px" }}>
			<Toolbar api={api} items={items} onClick={handleClick} />
			<Grid data={data} columns={columns} init={init} undo />
			{dataToEdit ? (
				<Editor
					values={dataToEdit}
					items={getEditorConfig(columns)}
					placement="sidebar"
					onsave={({ values }) => {
						api.exec("update-row", {
							id: dataToEdit.id,
							row: values,
						});
					}}
					onaction={() => setDataToEdit(null)}
				/>
			) : null}
		</div>
	);
}
