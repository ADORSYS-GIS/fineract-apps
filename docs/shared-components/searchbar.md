# SearchBar Component Documentation

A production-ready, accessible search component that provides a consistent search experience across all applications in the Fineract ecosystem. Built with simplicity and performance in mind.

**Latest Version**: v1.0.0 (Refactored for cognitive complexity compliance)  
**Package**: `@fineract-apps/ui`  
**Bundle Size**: ~2KB gzipped

## Component Structure

The SearchBar follows a clean, simplified architecture with only 4 essential files:

```
SearchBar/
├── index.tsx             # Simple exports
├── SearchBar.types.ts    # TypeScript interfaces  
├── SearchBar.styles.ts   # Tailwind variants with CVA
└── SearchBar.tsx         # Main component (~220 lines)
```

**No over-engineering. No unnecessary complexity.** Just clean, readable code with extracted helper functions for maintainability and reduced cognitive complexity.

## Features

- **Live Search**: Real-time search with configurable debouncing
- **Dual Mode**: Client-side filtering OR async API suggestions
- **Keyboard Navigation**: Full accessibility with arrow keys, enter, escape
- **Loading States**: Visual feedback during async operations
- **Request Cancellation**: Built-in AbortController for performance
- **Flexible Variants**: Default and withButton styles
- **Size Options**: Small, medium, and large variants
- **Type Safe**: Full TypeScript support with strict interfaces
- **Lightweight**: Only ~2KB gzipped
- **Accessible**: WAI-ARIA compliant using Downshift

## Installation

The SearchBar component is part of the `@fineract-apps/ui` package and is automatically available in all frontend applications.

## Quick Start

```tsx
import { SearchBar } from '@fineract-apps/ui';

// Basic search
<SearchBar 
  placeholder="Search users..." 
  onSearch={(query) => console.log('Searching:', query)}
/>
```

## Usage Examples

### Basic Search
```tsx
<SearchBar 
  placeholder="Search accounts"
  onSearch={(value) => console.log('Searching for:', value)}
/>
```

### With Search Button
```tsx
<SearchBar
  variant="withButton"
  placeholder="Search with button"
  onSearch={(value) => console.log('Button search:', value)}
/>
```

### Client-side Suggestions
```tsx
const accounts = [
  { id: '1', label: 'Account #123 - John Doe' },
  { id: '2', label: 'Account #456 - Jane Smith' }
];

<SearchBar
  placeholder="Search accounts"
  suggestions={accounts}
  onSuggestionSelect={(suggestion) => {
    navigate(`/accounts/${suggestion.id}`);
  }}
  maxSuggestions={5}
/>
```

### Async API Search
```tsx
<SearchBar
  placeholder="Search customers"
  suggestionProvider={async (query, signal) => {
    const res = await fetch(`/api/customers/search?q=${query}`, { signal });
    const data = await res.json();
    return data.map(customer => ({
      id: customer.id,
      label: `${customer.name} - ${customer.accountNumber}`
    }));
  }}
  onSuggestionSelect={(customer) => {
    navigate(`/customers/${customer.id}`);
  }}
  debounceMs={500}
  minChars={2}
/>
```

### Controlled Component
```tsx
const [searchValue, setSearchValue] = useState('');

<SearchBar
  value={searchValue}
  onValueChange={setSearchValue}
  placeholder="Controlled search"
  size="lg"
  showClear={false}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "withButton"` | `"default"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of the search bar |
| `placeholder` | `string` | `"Search..."` | Placeholder text for the input |
| `className` | `string` | - | Additional CSS classes |
| `value` | `string` | - | Controlled input value |
| `onValueChange` | `(value: string) => void` | - | Called when input value changes |
| `onSearch` | `(value: string) => void` | - | Called when search is triggered |
| `showClear` | `boolean` | `true` | Whether to show the clear button |
| `showSearchButton` | `boolean` | `true` | Whether to show search button |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `suggestions` | `Suggestion[]` | - | Array of suggestions for client-side filtering |
| `suggestionProvider` | `(query: string, signal?: AbortSignal) => Promise<Suggestion[]>` | - | Async function to fetch suggestions |
| `onSuggestionSelect` | `(suggestion: Suggestion) => void` | - | Called when a suggestion is selected |
| `isLoading` | `boolean` | `false` | Shows loading indicator |
| `minChars` | `number` | `1` | Minimum characters before showing suggestions |
| `debounceMs` | `number` | `300` | Debounce delay for suggestions in milliseconds |
| `maxSuggestions` | `number` | `10` | Maximum number of suggestions to show |

### Suggestion Interface

```tsx
interface Suggestion {
  id: string;
  label: string;
  value?: string; // Optional for backward compatibility
}
```

## Variants & Sizing

### Variants

**Default** - Standard search bar with icon and optional clear button
```tsx
<SearchBar placeholder="Search accounts" />
```

**With Button** - Includes a search button for explicit search actions
```tsx
<SearchBar
  variant="withButton" 
  placeholder="Search with button"
/>
```

### Sizes

Control the visual size of the search bar:
```tsx
<SearchBar size="sm" placeholder="Small search" />
<SearchBar size="md" placeholder="Medium search" />  
<SearchBar size="lg" placeholder="Large search" />
```

## Accessibility

The SearchBar component is fully accessible and follows WAI-ARIA guidelines:

**ARIA Support:**
- Proper roles and attributes (`combobox`, `listbox`, `option`)
- Screen reader announcements for loading states
- Clear button with descriptive `aria-label`
- Focus management between input and suggestions

**Keyboard Navigation:**
- `↑/↓` - Navigate through suggestions
- `Enter` - Select suggestion or trigger search  
- `Esc` - Close suggestions dropdown
- `Tab` - Move focus to next element

## Advanced Examples

### Real-world Account Search
```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

<SearchBar
  placeholder="Search customer accounts..."
  suggestionProvider={async (query, signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/accounts/search?q=${query}`, { signal });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      return data.accounts.map(account => ({
        id: account.id,
        label: `${account.customerName} - ${account.accountNumber}`
      }));
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Search failed. Please try again.');
        console.error('Search error:', err);
      }
      return [];
    } finally {
      setLoading(false);
    }
  }}
  isLoading={loading}
  onSuggestionSelect={(account) => {
    navigate(`/accounts/${account.id}`);
  }}
  debounceMs={300}
  minChars={3}
  maxSuggestions={6}
/>
{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
```

### Custom Styling & Configuration
```tsx
// Large search with custom styling
<SearchBar
  placeholder="Search transactions..."
  className="max-w-2xl mx-auto shadow-lg"
  size="lg"
  showClear={false}
  debounceMs={500}
  minChars={2}
/>

// Compact mobile search  
<SearchBar
  placeholder="Quick search"
  size="sm"
  className="w-full md:w-80"
  debounceMs={200}
/>
```

### Complete Integration Example
```tsx
import { useState, useCallback } from 'react';
import { SearchBar } from '@fineract-apps/ui';
import type { Suggestion } from '@fineract-apps/ui';

function CustomerSearchPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchCustomers = useCallback(async (query: string, signal?: AbortSignal) => {
    try {
      const response = await fetch(`/api/customers/search?q=${encodeURIComponent(query)}`, {
        signal,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const { customers } = await response.json();
      return customers.map((customer: any) => ({
        id: customer.id,
        label: `${customer.fullName} - ${customer.accountNumber}`,
        value: customer.accountNumber
      }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Customer search failed:', error);
        throw error;
      }
      return [];
    }
  }, [token]);

  const handleCustomerSelect = useCallback((suggestion: Suggestion) => {
    setSelectedCustomer(suggestion.id);
    // Add to search history
    setSearchHistory(prev => [suggestion.label, ...prev.slice(0, 4)]);
  }, []);

  const handleSearch = useCallback((query: string) => {
    // Handle direct search without suggestion selection
    console.log('Direct search:', query);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Search</h1>
      
      <SearchBar
        placeholder="Search customers by name or account number..."
        suggestionProvider={searchCustomers}
        onSuggestionSelect={handleCustomerSelect}
        onSearch={handleSearch}
        size="lg"
        className="mb-4"
        debounceMs={300}
        minChars={2}
        maxSuggestions={6}
      />

      {searchHistory.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                onClick={() => handleSearch(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Customer selected: {selectedCustomer}</p>
        </div>
      )}
    </div>
  );
}
```

## Technical Implementation

### Dependencies
- **Downshift**: Accessibility and keyboard interactions
- **class-variance-authority**: Style variant management  
- **Lucide React**: Icons (Search, X, Loader2)
- **AbortController**: Request cancellation
- **Custom debounce utility**: Performance optimization

### Architecture Highlights
- **Low cognitive complexity**: Refactored with extracted helper functions for better maintainability
- **Performance optimized**: useCallback hooks prevent unnecessary re-renders
- **Generic utilities**: Reusable functions in `lib/utils.ts` and `lib/searchUtils.ts`
- **Type safe**: Strict TypeScript interfaces with comprehensive prop validation
- **Accessible by design**: Uses Downshift for keyboard navigation and ARIA compliance
- **Quality gate compliant**: Meets SonarQube standards for code complexity and maintainability

## Best Practices

### Error Handling
Always handle errors gracefully in your suggestion provider:
```tsx
const searchProvider = async (query: string, signal?: AbortSignal) => {
  try {
    const data = await fetchSuggestions(query, signal);
    return data.map(item => ({ id: item.id, label: item.name }));
  } catch (err) {
    if (err.name === 'AbortError') return []; // Request was cancelled
    console.error('Search error:', err);
    // Show error state or return empty array
    return [];
  }
};
```

### Performance Optimization
Configure debouncing and limits based on your use case:
```tsx
<SearchBar
  debounceMs={300}      // Balance between responsiveness and API load
  minChars={2}          // Prevent searches with too few characters
  maxSuggestions={8}    // Limit results for better UX
/>
```

### Responsive Design
Adapt the SearchBar for different screen sizes:
```tsx
// Desktop
<SearchBar
  size="md" 
  className="hidden md:block w-96"
/>

// Mobile  
<SearchBar
  size="sm"
  className="block md:hidden w-full"
  placeholder="Search..."
/>
```

## Testing

The SearchBar component comes with comprehensive test coverage:

### Test Coverage
- **91%+ statement coverage** with 8 comprehensive test cases
- **82%+ branch coverage** testing all conditional logic paths  
- **94%+ function coverage** ensuring all methods are tested

### Test Cases Include
- Basic rendering and props validation
- Input value changes and controlled/uncontrolled modes
- Client-side suggestion filtering and selection
- Async suggestion provider with loading states
- Clear button functionality and state management
- Search button interactions and keyboard navigation
- Loading states and error handling
- Accessibility features and ARIA attributes

### Running Tests
```bash
# Run SearchBar tests specifically
pnpm test -- packages/ui/src/components/SearchBar/SearchBar.test.tsx

# Run with coverage
pnpm test:coverage
```

## What Makes This Component Great

- **Simple API**: Easy to use, hard to misuse
- **Flexible**: Works with any data source (client-side or API)
- **Performant**: Built-in optimizations for real-world usage  
- **Accessible**: Screen reader and keyboard friendly
- **Type Safe**: Full TypeScript support with interfaces
- **Small Bundle**: Only ~2KB gzipped
- **Production Ready**: Used across multiple Fineract applications

## Troubleshooting

### Common Issues

**Suggestions not showing:**
- Ensure `minChars` requirement is met (default: 1 character)
- Check if `suggestionProvider` returns valid `Suggestion[]` format
- Verify async provider isn't throwing unhandled errors

**Performance issues:**
- Adjust `debounceMs` (default: 300ms) for your use case
- Set appropriate `maxSuggestions` limit (default: 10)
- Use `minChars` to prevent unnecessary API calls

**TypeScript errors:**
- Ensure suggestions match the `Suggestion` interface
- Import types: `import type { Suggestion, SearchBarProps } from '@fineract-apps/ui'`

**Accessibility issues:**
- Verify screen reader announcements work in your environment
- Test keyboard navigation (arrows, enter, escape, tab)
- Check that ARIA attributes are preserved when customizing

### Migration from Legacy Versions
If migrating from an over-engineered version with multiple micro-files:
1. Remove any custom hooks or helper files
2. Use the simplified 4-file structure
3. Update import paths to use the main component export
4. Test thoroughly as the API may have been simplified

**Result**: 220 lines of clean, well-structured code with extracted helper functions that provides everything you need for a production-ready search component while maintaining low cognitive complexity and high maintainability.