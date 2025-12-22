import { useMemo, useRef } from "react";
import { Grid } from "../../src";
import { getData } from "../data";

function HotkeysCustom() {
	const { allData: data, countries, users } = useMemo(() => getData(), []);
	const api = useRef();

	const hotkeys = useMemo(
		() => ({
			"ctrl+alt+n": (event) => {
				event.preventDefault();
				api.current.exec("add-row", {
					row: {},
				});
			},
			Delete: (event) => {
				event.preventDefault();
				const id = api.current.getState().selectedRows[0];
				if (id) {
					api.current.exec("delete-row", { id });
				}
			},
		}),
		[]
	);

	const columns = useMemo(
		() => [
			{
				id: "firstName",
				header: 'Name - "text"',
				editor: "text",
				width: 180,
			},
			{
				id: "country",
				header: 'Country - "combo"',
				editor: {
					type: "combo",
					config: { template: (option) => `${option.id}. ${option.label}` },
				},
				options: countries,
				width: 180,
			},
			{
				id: "date",
				header: 'Date - "datepicker"',
				width: 180,
				editor: "datepicker",
				template: (v) => (v ? v.toLocaleDateString() : ""),
			},
			{
				id: "user",
				header: 'User - "richselect"',
				width: 180,
				editor: "richselect",
				options: users,
			},
		],
		[countries, users]
	);

	return (
		<div style={{ padding: "20px" }}>
			<h4>You can specify your own hotkeys</h4>
			<p>Press ctrl+alt+n to add row, select and press Delete to delete row</p>
			<div>
				<Grid
					data={data.slice(0, 10)}
					ref={api}
					columns={columns}
					hotkeys={hotkeys}
				/>
			</div>
		</div>
	);
}

export default HotkeysCustom;
