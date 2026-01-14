import { FC } from "react";
import { FooterProps } from "./Footer.types";

export const FooterView: FC<FooterProps> = ({ version }) => {
	return (
		<footer className="bg-gray-50 px-4 py-3 text-ml text-gray-500">
			<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
				<span className="rounded bg-gray-100 px-2 py-1 font-mono text-gray-600">
					v {version}
				</span>
			</div>
		</footer>
	);
};
