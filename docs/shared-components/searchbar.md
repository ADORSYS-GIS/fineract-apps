# SearchBar Component Documentation

A production-ready, accessible search component that provides a consistent search experience across all applications in the Fineract ecosystem. Built with simplicity and performance in mind.

## Component Structure

The SearchBar follows a clean, simplified architecture with only 4 essential files:

```
SearchBar/
├── index.ts              # Simple export
├── SearchBar.types.ts    # TypeScript interfaces  
├── SearchBar.styles.ts   # Tailwind variants with CVA
└── SearchBar.tsx         # Main component (~150 lines)
```

**No over-engineering. No unnecessary complexity.** Just clean, readable code that provides everything you need.

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
| `showSearchButton` | `boolean` | `false` | Whether to show search button |
| `suggestions` | `Suggestion[]` | - | Array of suggestions for client-side filtering |
| `suggestionProvider` | `(query: string, signal?: AbortSignal) => Promise<Suggestion[]>` | - | Async function to fetch suggestions |
| `onSuggestionSelect` | `(suggestion: Suggestion) => void` | - | Called when a suggestion is selected |
| `isLoading` | `boolean` | `false` | Shows loading indicator |
| `minChars` | `number` | `2` | Minimum characters before showing suggestions |
| `debounceMs` | `number` | `250` | Debounce delay for suggestions in milliseconds |
| `maxSuggestions` | `number` | `8` | Maximum number of suggestions to show |

### Suggestion Interface

```tsx
interface Suggestion {
  id: string;
  label: string;
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
  variant="withButton"
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

## Technical Implementation

### Dependencies
- **Downshift**: Accessibility and keyboard interactions
- **class-variance-authority**: Style variant management  
- **Lucide React**: Icons (Search, X, Loader2)
- **AbortController**: Request cancellation
- **Custom debounce utility**: Performance optimization

### Architecture Highlights
- **Single file component**: No over-engineering or micro-abstractions
- **Generic utilities**: Reusable functions in `lib/utils.ts`
- **Type safe**: Strict TypeScript interfaces
- **Performance optimized**: Built-in debouncing and request cancellation
- **Accessible by design**: Uses Downshift for keyboard navigation

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

## What Makes This Component Great

- **Simple API**: Easy to use, hard to misuse
- **Flexible**: Works with any data source (client-side or API)
- **Performant**: Built-in optimizations for real-world usage  
- **Accessible**: Screen reader and keyboard friendly
- **Type Safe**: Full TypeScript support with interfaces
- **Small Bundle**: Only ~2KB gzipped
- **Production Ready**: Used across multiple Fineract applications

**Result**: 150 lines of clean, readable code that provides everything you need for a production-ready search component.