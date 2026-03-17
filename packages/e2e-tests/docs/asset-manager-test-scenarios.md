# Test Scenarios for Asset Manager App

This document outlines the test scenarios for the Asset Manager application. The scenarios are based on the application's features, which have been identified by analyzing the source code.

## 1. Authentication

### Feature: User Login and Logout

#### Scenario 1: Successful Login

- **Given** the user is on the login page
- **When** the user enters valid credentials (username and password)
- **And** clicks the "Login" button
- **Then** the user should be redirected to the dashboard page
- **And** the user's name should be visible in the header

#### Scenario 2: Invalid Login

- **Given** the user is on the login page
- **When** the user enters invalid credentials
- **And** clicks the "Login" button
- **Then** an error message should be displayed
- **And** the user should remain on the login page

#### Scenario 3: Logout

- **Given** the user is logged in
- **When** the user clicks on the "Logout" button
- **Then** the user should be redirected to the login page

## 2. Dashboard

### Feature: Dashboard View

#### Scenario 1: Display Dashboard

- **Given** the user is logged in
- **When** the user navigates to the dashboard
- **Then** the dashboard page should be displayed
- **And** it should contain a summary of the assets, such as total value, number of assets, etc.
- **And** it should display a chart or graph visualizing the asset performance.

## 3. Inventory Management

### Feature: View and Manage Assets

#### Scenario 1: View Asset Inventory

- **Given** the user is logged in
- **When** the user navigates to the inventory page
- **Then** a table of assets should be displayed
- **And** the table should contain columns for asset name, category, value, status, etc.
- **And** the user should be able to sort the table by each column.
- **And** the user should be able to paginate through the list of assets.

#### Scenario 2: Filter Assets

- **Given** the user is on the inventory page
- **When** the user applies a filter (e.g., by category or status)
- **Then** the table should only display the assets that match the filter criteria.

#### Scenario 3: View Asset Details

- **Given** the user is on the inventory page
- **When** the user clicks on an asset in the table
- **Then** the user should be redirected to the asset details page for that asset.

## 4. Asset Creation

### Feature: Create a New Asset

#### Scenario 1: Successfully Create a New Asset

- **Given** the user is on the "Create Asset" page
- **When** the user fills in all the required fields with valid data
- **And** clicks the "Create" button
- **Then** a success message should be displayed
- **And** the user should be redirected to the inventory page
- **And** the newly created asset should be visible in the inventory table.

#### Scenario 2: Fail to Create an Asset with Invalid Data

- **Given** the user is on the "Create Asset" page
- **When** the user fills in the form with invalid data (e.g., missing required fields, incorrect data format)
- **And** clicks the "Create" button
- **Then** error messages should be displayed for the invalid fields
- **And** the user should remain on the "Create Asset" page.

## 5. Asset Details

### Feature: View and Edit Asset Details

#### Scenario 1: View Asset Details

- **Given** the user has navigated to the asset details page for a specific asset
- **Then** the page should display all the details of the asset, such as its name, description, category, value, etc.
- **And** it should display the asset's history and audit log.

#### Scenario 2: Edit an Asset

- **Given** the user is on the asset details page
- **When** the user clicks the "Edit" button
- **And** changes some of the asset's details
- **And** clicks the "Save" button
- **Then** a success message should be displayed
- **And** the updated details should be visible on the page.

#### Scenario 3: Delist an Asset

- **Given** the user is on the asset details page
- **When** the user clicks the "Delist" button
- **And** confirms the action in the confirmation dialog
- **Then** the asset's status should be updated to "Delisted"
- **And** the asset should be marked as delisted in the inventory.

#### Scenario 4: Mint New Supply for an Asset

- **Given** the user is on the asset details page for a compatible asset
- **When** the user clicks the "Mint Supply" button
- **And** enters a valid amount in the mint supply dialog
- **And** confirms the action
- **Then** the asset's supply should be increased by the specified amount.

## 6. Pricing

### Feature: Manage Asset Pricing

#### Scenario 1: View Asset Pricing

- **Given** the user has navigated to the pricing page for a specific asset
- **Then** the page should display the current price of the asset
- **And** a history of the asset's price over time.

#### Scenario 2: Set a New Price for an Asset

- **Given** the user is on the pricing page for a specific asset
- **When** the user sets a new price for the asset
- **And** clicks the "Update Price" button
- **Then** the new price should be reflected on the page
- **And** the price history should be updated.

## 7. Market Settings

### Feature: Configure Market Settings

#### Scenario 1: View Market Settings

- **Given** the user is an admin
- **When** the user navigates to the market settings page
- **Then** the page should display the current market settings, such as trading hours, fees, etc.

#### Scenario 2: Update Market Settings

- **Given** the user is an admin on the market settings page
- **When** the user updates the market settings
- **And** clicks the "Save" button
- **Then** a success message should be displayed
- **And** the new settings should be applied to the system.

## 8. Order Resolution

### Feature: Manage and Resolve Orders

#### Scenario 1: View Pending Orders

- **Given** the user is on the order resolution page
- **Then** a list of pending orders should be displayed
- **And** the user should be able to view the details of each order.

#### Scenario 2: Approve an Order

- **Given** there is a pending order
- **When** the user approves the order
- **Then** the order's status should be updated to "Approved"
- **And** the order should be removed from the pending orders list.

#### Scenario 3: Reject an Order

- **Given** there is a pending order
- **When** the user rejects the order
- **Then** the order's status should be updated to "Rejected"
- **And** the order should be removed from the pending orders list.

## 9. Reconciliation

### Feature: Reconcile Financial Data

#### Scenario 1: View Reconciliation Reports

- **Given** the user is on the reconciliation page
- **Then** the user should be able to view and download reconciliation reports.

## 10. Audit Log

### Feature: View Audit Log

#### Scenario 1: View Audit Log

- **Given** the user is on the audit log page
- **Then** a table of audit log entries should be displayed
- **And** the table should show the user, action, and timestamp for each entry.
- **And** the user should be able to filter the audit log by user or action.

## 11. Income Calendar

### Feature: View Income Calendar

#### Scenario 1: View Income Calendar

- **Given** the user is logged in
- **When** the user navigates to the income calendar page
- **Then** a calendar view should be displayed
- **And** it should show expected income events on their respective dates.

## 12. LP Performance

### Feature: View LP Performance

#### Scenario 1: View LP Performance

- **Given** the user is logged in
- **When** the user navigates to the LP performance page
- **Then** a report or dashboard should be displayed showing the performance of the liquidity pool.

## 13. Payment Results

### Feature: View Payment Results

#### Scenario 1: View Payment Results

- **Given** a payment has been processed
- **When** the user navigates to the payment results page for that payment
- **Then** the details of the payment result should be displayed.

## 14. Scheduled Payments

### Feature: View Scheduled Payments

#### Scenario 1: View Scheduled Payments

- **Given** the user is logged in
- **When** the user navigates to the scheduled payments page
- **Then** a list of scheduled payments should be displayed.
  