import { Button, Form, Input } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FC } from "react";
import { useOpenAccount } from "./useOpenAccount";

export const OpenAccountView: FC<ReturnType<typeof useOpenAccount>> = ({
	onSubmit,
	initialValues,
	products,
}) => {
	return (
		<div className="bg-gray-50 min-h-screen">
			<header className="p-4 flex items-center border-b bg-white">
				<Link to="/dashboard">
					<Button variant="ghost">
						<ArrowLeft className="h-6 w-6" />
					</Button>
				</Link>
				<h1 className="text-lg font-semibold ml-4">Open Account</h1>
			</header>

			<main className="p-6">
				<Form initialValues={initialValues} onSubmit={onSubmit}>
					<div className="space-y-4">
						<Input name="accountType" label="Account Type" />
						<Input
							name="productName"
							label="Product Name"
							type="select"
							options={
								products
									?.filter((product) => product.name && product.id)
									.map((product) => ({
										label: product.name as string,
										value: product.id as number,
									})) || []
							}
						/>
					</div>
					<Button type="submit" className="w-full mt-8">
						Create Account
					</Button>
				</Form>
			</main>
		</div>
	);
};
