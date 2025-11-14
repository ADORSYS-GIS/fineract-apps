import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface AccountDetailsLayoutProps {
	header: React.ReactNode;
	tabs: {
		title: string;
		content: React.ReactNode;
	}[];
	clientId?: number;
}

export const AccountDetailsLayout = ({
	header,
	tabs,
	clientId,
}: AccountDetailsLayoutProps) => {
	const [activeTab, setActiveTab] = useState(tabs[0].title);

	return (
		<div className="bg-gray-100 min-h-screen font-sans">
			<header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
				<div className="flex items-center gap-4 mb-4">
					{clientId && (
						<Link
							to="/client-details/$clientId"
							params={{ clientId: String(clientId) }}
							className="text-white hover:bg-white/20 p-2 rounded-full"
						>
							<ArrowLeft className="h-6 w-6" />
						</Link>
					)}
				</div>
				{header}
			</header>

			<main className="p-4 md:p-6 ">
				<div className="bg-white rounded-lg shadow">
					<nav className="flex border-b">
						{tabs.map((tab) => (
							<button
								key={tab.title}
								onClick={() => setActiveTab(tab.title)}
								className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
									activeTab === tab.title
										? "border-b-2 border-blue-600 text-blue-600"
										: "text-gray-500 hover:text-blue-500"
								}`}
							>
								{tab.title}
							</button>
						))}
					</nav>

					{tabs.map(
						(tab) =>
							activeTab === tab.title && (
								<div key={tab.title} className="p-4">
									{tab.content}
								</div>
							),
					)}
				</div>
			</main>
		</div>
	);
};
