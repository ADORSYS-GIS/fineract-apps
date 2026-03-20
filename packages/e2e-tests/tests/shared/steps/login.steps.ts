import { test } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given("I am on the login page", async ({ page }) => {
	await page.goto("/");
});

When("I enter my credentials", async ({ page }) => {
	await page.getByLabel("Username").fill(process.env.E2E_USERNAME || "admin");
	await page
		.getByLabel("Password")
		.fill(process.env.E2E_PASSWORD || "password");
	await page.getByRole("button", { name: "Login" }).click();
});

Then("I should be redirected to the dashboard", async ({ page }) => {
	await test.expect(page).toHaveURL("/dashboard");
});
