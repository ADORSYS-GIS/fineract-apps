# Reporting Application

A modern, read-only reporting and analytics application for Apache Fineract, targeting Branch Managers and Administration roles.

## Overview

The Reporting Application provides comprehensive reporting capabilities with:
- **Reports Catalog** - Browse and search 50-150+ available reports
- **Dynamic Parameter Collection** - Automatically generated forms based on report requirements
- **Report Execution** - Real-time report generation with Fineract API
- **Data Visualization** - Formatted tables with type-aware cell rendering
- **Export Functionality** - Download reports as CSV or Excel
- **Audit Trail** - View system actions and Maker/Checker transactions
- **Transaction History** - Filtered transaction views

## Features

### Reports Catalog
- Browse all available Fineract reports
- Search by report name
- View report descriptions and categories
- One-click report execution

### Report Viewing
- **Dynamic Parameters**: Automatically generated forms for report parameters
  - Text inputs for free-form data
  - Dropdowns for selection lists (Office, Loan Product, etc.)
  - Date pickers for date ranges
  - Validation for required fields

- **Data Display**:
  - Responsive data tables
  - Type-aware formatting:
    - DECIMAL: 1,234.56
    - INTEGER: 1,234
    - DATE: 01/15/2024
    - BOOLEAN: Yes/No
  - Loading states and error handling

- **Export Options**:
  - CSV export with proper escaping
  - Excel export (.xlsx format)
  - Automatic filename generation

### Audit Trail
- View all system actions (who, what, when)
- Filter by date range, action type, and entity
- Support for Maker/Checker workflow visibility
- Administration-only access

### Transaction History
- Filtered transaction views
- Date range selection
- Transaction type filtering
- Office-scoped for Branch Managers

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **Fineract API** - Generated API client
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- pnpm 9.6.0+
- Access to a Fineract backend server

### Installation

```bash
# Install dependencies (from repository root)
pnpm install

# Or install for this app only
pnpm --filter reporting-app install
```

### Configuration

Create/edit `.env` file:

```bash
VITE_FINERACT_API_URL=/fineract-provider/api/v1
VITE_FINERACT_USERNAME=mifos
VITE_FINERACT_PASSWORD=password
VITE_FINERACT_TENANT_ID=default
```

### Development

```bash
# Start dev server (from repository root)
pnpm --filter reporting-app dev

# Or from this directory
pnpm dev

# Access at http://localhost:5005
```

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
reporting-app/
├── src/
│   ├── components/
│   │   ├── ReportParameterModal.tsx      # Parameter collection modal
│   │   └── ReportParameterModal.types.ts
│   ├── pages/
│   │   ├── dashboard/                    # Dashboard page
│   │   ├── reports/                      # Reports catalog
│   │   │   ├── report-viewer/            # Report viewer component
│   │   │   ├── ReportsCatalog.tsx
│   │   │   └── useReportsCatalog.ts
│   │   ├── transactions/                 # Transaction history
│   │   └── audit/                        # Audit trail
│   ├── routes/                           # TanStack Router routes
│   │   ├── __root.tsx                    # Root layout
│   │   ├── index.tsx                     # Redirect to dashboard
│   │   ├── dashboard.tsx
│   │   ├── reports.tsx
│   │   ├── transactions.tsx
│   │   └── audit.tsx
│   ├── services/
│   │   └── api.ts                        # API configuration
│   ├── utils/
│   │   └── exportHelpers.ts              # Export utilities
│   └── main.tsx                          # Entry point
├── .env                                  # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## API Integration

### Reports Service

**List Reports:**
```typescript
GET /v1/reports
// Returns array of available reports
```

**Get Report Details:**
```typescript
GET /v1/reports/{id}
// Returns report metadata including parameters
```

**Execute Report:**
```typescript
GET /v1/runreports/{reportName}?R_officeId=1&R_startDate=2024-01-01&locale=en&dateFormat=dd MMMM yyyy
// Returns columnHeaders and data
```

**Response Format:**
```typescript
{
  columnHeaders: [
    { columnName: "Client Name", columnDisplayType: "STRING" },
    { columnName: "Balance", columnDisplayType: "DECIMAL" }
  ],
  data: [
    { row: ["John Doe", 5000.50] },
    { row: ["Jane Smith", 3500.75] }
  ]
}
```

### Audits Service

**List Audits:**
```typescript
GET /v1/audits?makerDateTimeFrom=2024-01-01&offset=0&limit=20
// Returns paginated audit entries
```

## User Roles

### Branch Manager
- **Access:** Office-scoped reports and transactions
- **Permissions:** READ_REPORT, READ_CLIENT, READ_LOAN
- **Scope:** Can only view data for assigned office(s)

### Administration
- **Access:** Full system access
- **Permissions:** READ_REPORT, READ_AUDIT, all data access
- **Scope:** Unrestricted access across all offices

## Report Types

### Table Reports (Most Common)
- Display data in tabular format
- Support sorting and filtering
- Exportable to CSV/Excel

### Chart Reports
- Graphical visualizations
- Data-driven charts and graphs

### Pentaho Reports
- Advanced reporting engine
- PDF and HTML output formats
- Complex layouts and calculations

## Report Parameters

Reports may require various parameters:

- **Office ID** - Which branch to report on
- **Date Range** - Start and end dates
- **Loan Product** - Specific loan product filter
- **Client** - Individual client selection
- **Status** - Account/loan status filter

Parameters are automatically detected and form fields are generated dynamically.

## Export Formats

### CSV Export
- Plain text format
- Proper escaping for special characters
- Compatible with Excel and other tools

### Excel Export
- Native .xlsx format
- Preserves data types
- Formatted columns

## Deployment

### Docker Build

```bash
# Build Docker image (from repository root)
docker build -f Dockerfile.reporting -t fineract-reporting-app .

# Run container
docker run -p 80:80 fineract-reporting-app
```

### Kubernetes Deployment

The application is designed to work with the `fineract-gitops` deployment:

- **Authentication:** OAuth2-Proxy at K8s Ingress layer
- **Gateway:** NGINX with mod_auth_openidc
- **Service:** Serves static build from nginx container
- **Health Check:** `/health` endpoint

## Development Guidelines

### Adding New Pages

1. Create route file in `src/routes/`
2. Create page component in `src/pages/`
3. Add to menu in `packages/ui/src/components/Sidebar/menus.ts`

### API Queries

Use TanStack Query for all API calls:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: async () => {
    const response = await SomeService.someMethod();
    return response;
  },
});
```

### Type Safety

All API responses should be typed:

```typescript
const response = await Service.method();
return response as unknown as YourType;
```

## Troubleshooting

### Common Issues

**Issue:** Reports not loading
- **Solution:** Check `.env` file has correct Fineract API URL and credentials

**Issue:** Parameter modal empty
- **Solution:** Verify report ID is correct and report has parameters defined

**Issue:** Export not working
- **Solution:** Check browser allows downloads, verify data is loaded

**Issue:** Date formatting errors
- **Solution:** Ensure `dateFormat` parameter matches Fineract server expectations

## Performance Optimization

- **Code Splitting:** Automatic route-based splitting
- **Lazy Loading:** Components loaded on demand
- **Query Caching:** TanStack Query caches responses
- **Build Optimization:** Vite performs tree-shaking and minification

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Create feature branch
2. Make changes following existing patterns
3. Test thoroughly
4. Build successfully
5. Create pull request

## License

See repository root LICENSE file.

## Support

For issues and questions:
- Create issue in repository
- Contact development team
- Refer to Fineract documentation: https://fineract.apache.org/

## Version History

### v1.0.0 - Initial Release
- Reports catalog with search
- Dynamic parameter collection
- Report execution and viewing
- CSV and Excel export
- Audit trail viewer
- Transaction history (placeholder)
- Dashboard with statistics
