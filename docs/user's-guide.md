# System Administration User Guide  
## Online Banking System

---

## 1. Purpose of the System Administration Application

The **System Administration Application** is the foundation of the Online Banking System.  
It is used to manage **who can access the system**, **what they are allowed to do**, and **how security is enforced**.

All other applications depend on the configurations done here.  
Without proper system administration, no staff member can safely perform banking operations.

---

## 2. Who Can Access This Application

Only authorized personnel should have access to this application, typically:

- System Administrators
- IT or Operations Supervisors (where applicable)

Access to this application is strictly controlled due to its impact on security and compliance.

---

## 3. Getting Started

### 3.1 Logging In
- The System Administrator logs in using assigned credentials.
- Upon first login, the system may require a password change.

> 📸 *Screenshot: System Admin Login Page*

---

### 3.2 Dashboard Overview
After logging in, the dashboard provides:
- Overview of active users
- User status indicators (active, inactive, locked)
- Security notifications (e.g. password resets, unusual activity)

The dashboard serves as a quick control center for system access.

> 📸 *Screenshot: System Admin Dashboard*

---

## 4. Managing Staff Users

### 4.1 Creating a New User
The System Administrator can create new staff users by:
- Entering staff identification details
- Assigning a role based on job function
- Associating the user with a branch where applicable

New users are created with restricted access until properly configured.

> 📸 *Screenshot: Create User Form*

---

### 4.2 Assigning Roles and Permissions
Each user is assigned a role that defines:
- What actions they can perform
- Which application they can access
- Which data they can view or modify

Roles ensure **separation of duties** and prevent unauthorized actions.

> 📸 *Screenshot: Role Assignment Screen*

---

### 4.3 Activating and Deactivating Users
The System Administrator can:
- Activate users when they are ready to start work
- Deactivate users when staff leave or change roles
- Temporarily lock users in case of suspicious activity

Deactivated users immediately lose access to the system.

---

## 5. Security Controls

### 5.1 Password Management
The System Administrator can:
- Force password resets
- Enforce password changes after suspected security breaches
- Ensure users comply with password policies

This helps protect the institution from unauthorized access.

---

### 5.2 Handling Suspected Security Breaches
In case of suspected credential compromise:
- The affected user account is locked
- A password reset is enforced
- Audit logs are reviewed to assess impact

> 📸 *Screenshot: User Security Actions*

---


## 6. How This App Connects to Other Applications

The System Administration Application enables:
- Account Managers to access client and loan systems
- Branch Managers to approve accounts and loans
- Cashiers to process transactions
- Accountants to manage financial records
- Report users to access reporting tools

Without proper user setup here, no operational work can begin.

---

## 8. End-of-Task Checklist for System Administrators

Before handing over to operational teams, ensure that:
- All staff users are created and activated
- Roles are correctly assigned
- Branch associations are correct
- Initial password policies are enforced
- Audit logs show no unresolved security issues

---

## 9. Key Controls and Compliance Notes

- Access is role-based and controlled
- All actions are audited
- User management supports regulatory and internal audit requirements
- Proper setup reduces fraud and operational risk

---

## 10. Summary

The System Administration Application ensures that the Online Banking System operates in a **secure, controlled, and compliant environment**.  
It is the first and most critical step in deploying and operating the system successfully.

---

# Account Manager / Loan Officer User Guide  
## Online Banking System

---

## 1. Purpose of the Account Manager / Loan Officer Application

The **Account Manager / Loan Officer Application** is used to manage **clients, accounts, and loans** throughout their lifecycle.

This application supports:
- Client onboarding and compliance
- Account creation and activation
- Loan application, disbursement, and follow-up
- Client communication and reporting

It plays a central role in ensuring accurate client data and responsible lending.

---

## 2. Who Can Access This Application

Authorized roles include:
- Account Managers
- Loan Officers

Access is granted by the System Administrator and is limited based on assigned responsibilities.

---

## 3. Getting Started

### 3.1 Logging In
- Log in using your assigned credentials.
- If required, update your password on first login.

> 📸 *Screenshot: Account Manager Login Page*

---

### 3.2 Dashboard Overview
The dashboard provides visibility into:
- Clients in the branch with their account numbers and emails
- Notifications and alerts

This dashboard helps prioritize daily tasks.

> 📸 *Screenshot: Account Manager Dashboard*

---

## 4. Client Onboarding

### 4.1 Creating a New Client
To onboard a client:
- Click the create client button on the dashbaord to get started
- Enter clients required infomation
- Collect required identification documents
- Ensure all information complies with KYC and COBAC requirements

Once saved, the client profile becomes available for account and loan operations.

> 📸 *Screenshot: Create Client Form*

---

### 4.2 Updating Client Information
Client information can be updated when:
- Contact details change
- Additional documents are required
- Corrections are necessary

All changes are recorded in the audit logs.

---

## 5. Account Management

### 5.1 Creating Client Accounts
Account Managers can create:
- Savings accounts
- Current accounts
- Other institution-defined products

New accounts are created as **pending approval**.

> 📸 *Screenshot: Create Account Screen*

---

### 5.2 Account Approval Workflow
- Submitted accounts await Branch Manager review
- Approved accounts remain inactive
- Account Managers activate approved accounts

This process enforces separation of duties.

> 📸 *Screenshot: Pending Account Approvals*

---

## 6. Loan Management

### 6.1 Creating a Loan Application
When a client requests a loan:
- Select open account in the client's profile and choose loan account
- Select the appropriate loan product
- Enter loan amount and duration
- Configure the loan details: poduct, purpose, fund, expected disbursment date and account to link
- Configure the loan terms:
- Review all details with the client
- Submit the application

Submitted loans are marked as **Pending**.

> 📸 *Screenshot: Loan Application Form*

---

### 6.2 Loan Review and Approval
- Branch Managers and the Loan Committee review submitted applications
- Additional information may be requested
- Loans are approved or rejected based on policy

Account Managers are notified of the decision.

---

### 6.3 Loan Disbursement
For approved loans:
- The Account Manager disburses the loan to the client’s main account
- The disbursement is recorded immediately
- The loan becomes active

> 📸 *Screenshot: Loan Disbursement Screen*

---

### 6.4 Loan Follow-Up and Monitoring
Account Managers monitor:
- Repayment schedules
- Missed or late payments
- Outstanding balances

Based on loan performance, loans may be:
- Marked as fully repaid
- Classified as non-performing
- Written off as a loss where applicable

> 📸 *Screenshot: Loan Monitoring Dashboard*

---

## 7. Client Transactions Visibility

Account Managers can:
- View client transaction history and print client bank statements
- Review deposits, withdrawals, and repayments
- Investigate suspicious activity
- Communicate with clients when needed

---

## 8. Reports and Documents

Available reports include:
- Client account statements
- Loan status and repayment reports
- Client activity summaries

Reports can be viewed or printed based on access rights.

> 📸 *Screenshot: Client Reports Page*


---

## 9. How This App Connects to Other Applications

- Branch Managers approve accounts and loans
- Cashiers handle withdrawals and repayments
- Accountants reflect loan and transaction data in financial records
- Reporting users access aggregated data for oversight

---

## 11. End-of-Task Checklist

Before ending your workday:
- Confirm all client data is complete
- Check pending approvals and notifications
- Review active loans requiring follow-up
- Ensure all actions were completed correctly

---

## 12. Summary

The Account Manager / Loan Officer Application ensures that clients are properly onboarded, accounts are accurately managed, and loans are responsibly processed and monitored.

---
# Branch Manager User Guide  
## Online Banking System

---

## 1. Purpose of the Branch Manager Application

The **Branch Manager Application** is used to supervise and control all banking operations within a branch.

It provides oversight over:
- Staff activities
- Client account approvals
- Loan application approvals
- Cash allocation and settlement
- Branch-level reporting

This application ensures that branch operations are secure, compliant, and well controlled.

---

## 2. Who Can Access This Application

Authorized roles include:
- Branch Managers

Access is granted by the System Administrator and is limited to assigned branches.

---

## 3. Getting Started

### 3.1 Logging In
- Log in using your assigned credentials.
- First-time users may be required to change their password.
- All access activity is recorded in the system audit logs.

> 📸 *Screenshot: Branch Manager Login Page*

---

### 3.2 Dashboard Overview
The dashboard provides:
- Overview of current teller cashier assignments
- Alerts and notifications

This dashboard helps the Branch Manager monitor branch activities at a glance.

> 📸 *Screenshot: Branch Manager Dashboard*

---

## 4. Staff Supervision

### 4.1 Managing Branch Staff
Branch Managers can:
- View staff assigned to the branch
- Assign or remove cashier (teller) responsibilities
- Monitor staff activity within the branch

> 📸 *Screenshot: Branch Staff Management*

---

## 5. Account Approval Workflow

### 5.1 Reviewing New Client Accounts
When an Account Manager creates a new client account:
- The account appears as **Pending Approval**
- The Branch Manager reviews client details
- The account is either approved or rejected

Approved accounts remain inactive until activated by the Account Manager.

> 📸 *Screenshot: Pending Account Approvals*

---

## 6. Loan Application Review

### 6.1 Reviewing Loan Applications
When a loan application is submitted:
- The Branch Manager receives an alert
- Loan details, collateral, charges, and repayment plans are reviewed
- Additional information may be requested

> 📸 *Screenshot: Loan Application Review*

---

### 6.2 Approving or Rejecting Loans
- Approved loans move to the disbursement stage
- Rejected loans are returned with comments
- Decisions are recorded in audit logs

> 📸 *Screenshot: Loan Approval Decision*

---

## 7. Cash Management

### 7.1 Cash Allocation (Start of Day)
At the beginning of the day:
- Allocate cash to each cashier
- Define starting balances
- Confirm allocation

This enables cashiers to process transactions.

> 📸 *Screenshot: Cash Allocation Screen*

---

### 7.2 Cash Settlement (End of Day)
At the end of the day:
- Review cashier transaction summaries
- Settle cash balances
- Confirm discrepancies if any

This ensures full accountability.

> 📸 *Screenshot: Cash Settlement Screen*


---

## 8. How This App Connects to Other Applications

- Account Managers submit accounts and loans for approval
- Cashiers process transactions based on allocated cash
- Accountants rely on approved transactions for financial reporting

---

## 9. End-of-Day Checklist

Before closing the day:
- Review all pending approvals
- Complete cash settlement for all cashiers
- Review branch alerts and notifications
- Ensure no unresolved discrepancies remain

---

## 10. Summary

The Branch Manager Application provides the necessary controls and visibility to manage branch operations effectively while maintaining compliance and accountability.

---

# Cashier (Teller) User Guide  
## Online Banking System

---

## 1. Purpose of the Cashier Application

The **Cashier (Teller) Application** is used to perform all **front-desk financial transactions** for clients.

It supports:
- Cash deposits
- Cash withdrawals
- Loan repayments
- Receipt and transaction reporting

This application ensures fast, accurate, and auditable handling of client funds.

---

## 2. Who Can Access This Application

Authorized roles include:
- Cashiers (Tellers)

Access is granted by the System Administrator and is limited to assigned branches and teller stations.

---

## 3. Getting Started

### 3.1 Logging In
- Log in using your assigned credentials.
- Access is allowed only after cash has been allocated by the Branch Manager.

> 📸 *Screenshot: Cashier Login Page*

---

### 3.2 Dashboard Overview
The dashboard displays:
- Search bar to search client accounts for transactions
- Assigned teller balance
- Daily transaction summary
- Alerts and notifications

The dashboard reflects real-time cash status.

> 📸 *Screenshot: Cashier Dashboard*

---

## 4. Client Search and Verification

Before processing any transaction:
- Search for the client using account number
- Verify client identity
- Confirm the correct account is selected

This step prevents errors and fraud.

> 📸 *Screenshot: Client Search Screen*

---

## 5. Cash Deposits

### 5.1 Processing a Deposit
To process a deposit:
- Select the client account
- Enter the deposit amount
- Confirm the transaction

The system updates the account balance immediately.

> 📸 *Screenshot: Deposit Transaction Screen*

---

### 5.2 Deposit Controls
- Deposit transactions are recorded in real time
- All deposits are included in audit logs
- Receipts can be printed for the client

---

## 6. Cash Withdrawals

### 6.1 Processing a Withdrawal
To process a withdrawal:
- Select the client account
- Enter the withdrawal amount
- Confirm sufficient balance
- Complete the transaction

> 📸 *Screenshot: Withdrawal Transaction Screen*

---

### 6.2 Withdrawal Controls
- Withdrawals are validated against account balance
- Transactions exceeding limits are blocked
- All withdrawals are auditable

---

## 7. Loan Repayments

### 7.1 Processing Loan Repayments
Cashiers can process:
- Full loan repayments
- Partial or installment repayments

Steps include:
- Input the client's laon account number in the repayment searchbar
- Entering the repayment amount, payment type and an optional note
- Confirming the transaction

> 📸 *Screenshot: Loan Repayment Screen*

---

### 7.2 Repayment Validation
- Repayments are applied immediately
- Loan balances update in real time
- Receipts can be printed for clients


---

## 8. Audits and Controls

All cashier activities are recorded, including:
- Transaction creation
- Transaction confirmation

Audit logs ensure accountability and traceability.

---

## 9. How This App Connects to Other Applications

- Branch Managers allocate and settle cashier cash
- Account Managers view client transaction history
- Accountants reflect transactions in financial records
- Reporting users generate transaction summaries

---

## 10. End-of-Day Checklist

Before ending the day:
- Stop processing new transactions
- Confirm cash on hand
- Complete cash settlement with the Branch Manager
- Review daily transaction summary

---

## 11. Summary

The Cashier Application ensures secure and accurate handling of daily financial transactions while maintaining full auditability and compliance.

---

# Accounting Application User Guide  
## Online Banking System

---

## 1. Purpose of the Accounting Application

The **Accounting Application** is used to manage the institution’s **financial records, journal entries, and financial reporting**.

It ensures:
- Accurate financial representation of all banking activities
- Strong internal controls through approval workflows
- Compliance with accounting standards and audit requirements

---

## 2. Who Can Access This Application

Authorized roles include:
- Accountants
- Supervisor Accountants

Access is granted by the System Administrator and is strictly controlled due to the sensitivity of financial data.

---

## 3. Getting Started

### 3.1 Logging In
- Log in using assigned credentials
- Password updates may be required on first login

> 📸 *Screenshot: Accounting App Login Page*

---

### 3.2 Dashboard Overview
The dashboard provides:
- Overview of financial status
- Pending journal entries
- Audit and closure summaries
- Alerts requiring attention

> 📸 *Screenshot: Accounting Dashboard*

---

## 4. General Ledger Overview

Accountants can view:
- Chart of accounts
- Account balances
- Transaction summaries

This provides visibility into the financial position of the institution.

> 📸 *Screenshot: General Ledger View*

---

## 5. Journal Entries

### 5.1 Creating Journal Entries (Accountant)

Accountants can:
- Create journal entries for financial adjustments
- Specify debit and credit accounts
- Add descriptions and supporting information

Created journal entries are saved as **Pending Review**.

> 📸 *Screenshot: Create Journal Entry*

---

### 5.2 Reviewing Journal Entries (Supervisor Accountant)

Supervisor Accountants:
- View pending journal entries
- Review details for accuracy and compliance
- Approve or reject entries

Approved entries are posted to the ledger.

> 📸 *Screenshot: Review Journal Entries*

---

### 5.3 Four-Eyes Control Principle

- Journal creation and approval are separated
- No single user can both create and approve an entry
- All decisions are logged for audit purposes

This reduces fraud risk and strengthens financial controls.

---

## 6. Closures and Financial Controls

Accountants and Supervisor Accountants can:
- Review financial closures
- Validate end-of-period balances
- Ensure records are complete before reporting

> 📸 *Screenshot: Financial Closures*


---

## 7. Audits and Traceability

All accounting actions are audited, including:
- Journal entry creation
- Journal entry approval or rejection
- Ledger updates
- Report generation

Audit logs capture:
- User performing the action
- Time and date
- Affected accounts

---

## 8. How This App Connects to Other Applications

- Transactions from Cashiers feed into accounting records
- Loan activities reflect in financial balances
- Branch operations impact general ledger accounts
- Reporting users rely on accounting data for financial oversight

---

## 9. End-of-Day / End-of-Period Checklist

Before closing:
- Review pending journal entries
- Confirm approvals are complete
- Validate account balances
- Ensure no unresolved audit issues remain

---

## 10. Summary

The Accounting Application ensures financial accuracy, transparency, and strong governance through controlled workflows and full auditability.

---

# Reporting Application User Guide  
## Online Banking System

---

## 1. Purpose of the Reporting Application

The **Reporting Application** provides authorized users with access to **operational, financial, and regulatory reports** generated from the Online Banking System.

It enables institutions to:
- Monitor daily and long-term performance
- Support decision-making
- Meet internal oversight needs
- Fulfill regulatory and compliance requirements

This application is **read-only** and does not allow transactional actions.

---

## 2. Who Can Access This Application

Access is role-based and granted by the System Administrator.

Authorized users may include:
- Branch Managers
- Account Managers / Loan Officers
- Accountants
- Supervisor Accountants
- Compliance or Regulatory Officers (where applicable)

Each user can only access reports relevant to their role.

---

## 3. Getting Started

### 3.1 Logging In
- Log in using assigned credentials
- Access is restricted to authorized roles
- All access activity is recorded in audit logs

> 📸 *Screenshot: Reporting App Login Page*

---

### 3.2 Dashboard Overview
The dashboard provides:
- Available report categories
- Recently accessed reports
- Filters for date range, branch, or product
- Notifications related to reporting updates

> 📸 *Screenshot: Reporting Dashboard*

---

## 4. Branch-Level Reports (Branch Managers)

Branch Managers can access reports such as:
- Branch performance summaries
- Client listings by branch
- Cash movement reports
- Loan performance by branch

These reports help evaluate operational efficiency and branch health.

> 📸 *Screenshot: Branch Reports*

---

## 5. Client-Level Reports (Account Managers / Loan Officers)

Account Managers can generate:
- Client account statements
- Transaction history reports
- Loan status and repayment schedules
- Client portfolio summaries

These reports support client follow-up and service delivery.

> 📸 *Screenshot: Client Reports*

---

## 6. Financial Reports (Accountants)

Accountants and Supervisor Accountants can access:
- Trial balance
- Balance sheet
- Financial summaries
- Audit-supporting reports

These reports are used for financial oversight and reconciliation.

> 📸 *Screenshot: Financial Reports*

---

## 7. Regulatory and Compliance Reports

Authorized users can access reports required for:
- Regulatory submissions
- Supervisory reviews
- Compliance checks

These reports support alignment with applicable financial regulations and supervisory requirements.

> 📸 *Screenshot: Regulatory Reports*

---

## 8. Report Filters and Exporting

Users can:
- Filter reports by date, branch, product, or client
- View reports directly in the system
- Print reports where permitted

Exporting or printing actions are logged for audit purposes.

---

## 9. System Audits, Traceability and Controls

The Reporting Application enforces:
- Read-only access to prevent data manipulation
- Role-based visibility of reports
- Audit logging for report access and printing

Audit logs capture:
- Who performed an action
- What action was performed
- When the action occurred
- Which user or resource was affected

Audit logs are read-only and cannot be altered.

> 📸 *Screenshot: Audit Log Viewer*

---

This ensures transparency and data integrity.

---

## 10. How This App Connects to Other Applications

- Transaction data comes from Cashier operations
- Loan and client data come from Account Manager activities
- Financial data is sourced from the Accounting Application
- Branch-level data reflects Branch Manager approvals

The Reporting Application consolidates data from all operational systems.

---

## 11. End-of-Task Checklist

Before logging out:
- Confirm the correct report and date range were selected
- Review report accuracy
- Print or save reports according to institutional policy

---

## 12. Summary

The Reporting Application provides secure, accurate, and role-appropriate access to critical information needed for operations, management, and regulatory compliance.

It completes the Online Banking System by offering full visibility into institutional performance.

---
