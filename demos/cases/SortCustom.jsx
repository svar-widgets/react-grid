import { useState, useMemo } from "react";
import { Grid } from "../../src";
import { getData } from "../data";
import { Button } from "@svar-ui/react-core";

import "./SortCustom.css";

export default function SortCustom() {
	const { data } = useMemo(() => getData(), []);
	const [api, setApi] = useState();

	const columnsCustomSort = useMemo(
		() => [
			{ id: "id", width: 50, sort: true },
			{ id: "city", header: "City", width: 160, sort: true },
			{
				id: "street",
				header: "Street",
				width: 200,
				sort: (a, b) => {
					return a.zipCode.localeCompare(b.zipCode);
				},
				template: (value, row) => `${row.street}, ${row.zipCode}`,
			},
			{ id: "firstName", header: "First Name", sort: true },
			{ id: "lastName", header: "Last Name", sort: true },
		],
		[]
	);

	const columnsSort = useMemo(
		() => [
			{ id: "id", width: 50, sort: false },
			{ id: "city", header: "City", width: 160, sort: true },
			{ id: "firstName", header: "First Name", sort: true },
			{ id: "lastName", header: "Last Name", sort: true },
		],
		[]
	);

	const [sortMarks, setSortMarks] = useState();

	function onclick() {
		setSortMarks({
			lastName: {
				order: sortMarks?.lastName?.order === "asc" ? "desc" : "asc",
			},
		});

		api.exec("sort-rows", {
			sort: (a, b) => {
				return sortMarks?.lastName?.order === "asc"
					? a.lastName.localeCompare(b.lastName)
					: -a.lastName.localeCompare(b.lastName);
			},
		});
	}

	return (
		<div className="demo-container">
			<div>
				<h4>Custom sorting function can be specified in columns config</h4>
				<Grid data={data} columns={columnsCustomSort} />
			</div>
			<div>
				<h4>Sorting via sort-rows action call</h4>
				<Button onClick={onclick} css="demo-button-sort" type="primary">
					Click to sort by last name
				</Button>

				<Grid data={data} init={setApi} sortMarks={sortMarks} columns={columnsSort} />
			</div>
		</div>
	);
}
