import { useState } from "react";

export function useDashboard() {
	const [query, setQuery] = useState("");
	return { title: "Branch Manager Dashboard", query, setQuery };
}
