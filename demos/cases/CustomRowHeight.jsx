import { useMemo, useRef } from "react";
import { Button } from "@svar-ui/react-core";
import { Grid } from "../../src/";
import { repeatData, getData } from "../data";

function CustomRowHeight() {
	const { columns } = getData();

	const data = useMemo(
		() =>
			repeatData(50).map((row, i) => {
				const hcase = i % 10;

				if (hcase === 2) return { ...row, rowHeight: 50 };
				if (hcase === 5) return { ...row, rowHeight: 75 };
				if (hcase === 7) return { ...row, rowHeight: 100 };
				return row;
			}),
		[]
	);

	const api = useRef();
	function doScroll(row) {
		api.current.exec("scroll", { row });
	}

	return (
		<div style={{ padding: "20px" }}>
			<h4>DataGrid can have custom row heights</h4>
			<div
				style={{
					paddingBottom: "20px",
					display: "flex",
					flexDirection: "columns",
					gap: "20px",
				}}
			>
				<Button type="primary" onClick={() => doScroll(data[49].id)}>
					Scroll: last row
				</Button>
				<Button type="primary" onClick={() => doScroll(data[0].id)}>
					Scroll: first row
				</Button>
				<Button type="primary" onClick={() => doScroll(data[17].id)}>
					Scroll: row id 18
				</Button>
				<Button type="primary" onClick={() => doScroll(data[42].id)}>
					Scroll: row id 43
				</Button>
			</div>
			<div style={{ height: "510px" }}>
				<Grid
					data={data}
					columns={columns}
					init={(gridApi) => (api.current = gridApi)}
					footer
					reorder
				/>
			</div>
		</div>
	);
}

export default CustomRowHeight;
