// Generated from: tests/account-manager-app/features/login.feature
import { test } from "playwright-bdd";

test.describe("Account Manager Login", () => {
	test("User logs in successfully", async ({ Given, When, Then, page }) => {
		await Given("I am on the login page", null, { page });
		await When("I enter my credentials", null, { page });
		await Then("I should be redirected to the dashboard", null, { page });
	});
});

// == technical section ==

test.use({
	$test: [({}, use) => use(test), { scope: "test", box: true }],
	$uri: [
		({}, use) => use("tests/account-manager-app/features/login.feature"),
		{ scope: "test", box: true },
	],
	$bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [
	// bdd-data-start
	{
		pwTestLine: 6,
		pickleLine: 3,
		tags: [],
		steps: [
			{
				pwStepLine: 7,
				gherkinStepLine: 4,
				keywordType: "Context",
				textWithKeyword: "Given I am on the login page",
				stepMatchArguments: [],
			},
			{
				pwStepLine: 8,
				gherkinStepLine: 5,
				keywordType: "Action",
				textWithKeyword: "When I enter my credentials",
				stepMatchArguments: [],
			},
			{
				pwStepLine: 9,
				gherkinStepLine: 6,
				keywordType: "Outcome",
				textWithKeyword: "Then I should be redirected to the dashboard",
				stepMatchArguments: [],
			},
		],
	},
]; // bdd-data-end
