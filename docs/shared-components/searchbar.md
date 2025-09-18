# Search Bar Component

A clean and focused search component that provides a consistent search experience across all applications in the Fineract ecosystem. It supports the two most essential use cases: default search and search with button.

## Features

- **Live Search**: Real-time search with debouncing
- **Suggestions**: Both client-side and server-side suggestions support
- **Keyboard Navigation**: Full keyboard support for suggestion navigation
- **Accessibility**: ARIA compliant using Downshift
- **Loading States**: Visual feedback during async operations
- **Clear/Reset**: Optional clear button functionality
- **Two Core Variants**: Default and with button styles
- **Customizable**: Easy to extend with custom styling

## Installation

The SearchBar component is part of the `@fineract-apps/ui` package and is automatically available in all frontend applications.

## Basic Usage

```tsx
import { SearchBar } from "@fineract-apps/ui";

// Default search
<SearchBar 
  placeholder="Search accounts"
  onSearch={(value) => console.log('Searching for:', value)}
/>

// With search button
<SearchBar
  variant="withButton"
  placeholder="Search with button"
  onSearch={(value) => console.log('Searching for:', value)}
/>

// With suggestions
<SearchBar
  placeholder="Search accounts"
  suggestions={[
    { id: '1', label: 'Account #123' },
    { id: '2', label: 'Account #456' }
  ]}
  onSuggestionSelect={(suggestion) => {
    console.log('Selected:', suggestion);
  }}
/>

// With async suggestions
<SearchBar
  placeholder="Search accounts"
  suggestionProvider={async (query, signal) => {
    const res = await fetch(`/api/search?q=${query}`, { signal });
    const data = await res.json();
    return data.map(item => ({
      id: item.id,
      label: item.displayName
    }));
  }}
  onSuggestionSelect={(suggestion) => {
    navigate(`/accounts/${suggestion.id}`);
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`variant\` | \`"default" \| "withButton"\` | \`"default"\` | The visual style variant |
| \`size\` | \`"sm" \| "md" \| "lg"\` | \`"md"\` | The size of the search bar |
| \`placeholder\` | \`string\` | \`"Search..."\` | Placeholder text |
| \`className\` | \`string\` | - | Additional CSS classes |
| \`onSearch\` | \`(value: string) => void\` | - | Called when search is triggered |
| \`showClear\` | \`boolean\` | \`true\` | Whether to show the clear button |
| \`showSearchButton\` | \`boolean\` | \`false\` | Whether to show search button |
| \`suggestions\` | \`Suggestion[]\` | - | Array of suggestions for client-side filtering |
| \`suggestionProvider\` | \`(query: string, signal?: AbortSignal) => Promise<Suggestion[]>\` | - | Async function to fetch suggestions |
| \`onSuggestionSelect\` | \`(suggestion: Suggestion) => void\` | - | Called when a suggestion is selected |
| \`isLoading\` | \`boolean\` | \`false\` | Shows loading indicator |
| \`minChars\` | \`number\` | \`2\` | Minimum characters before showing suggestions |
| \`debounceMs\` | \`number\` | \`250\` | Debounce delay for suggestions in ms |
| \`maxSuggestions\` | \`number\` | \`8\` | Maximum number of suggestions to show |

## Variants

### Default
Standard search bar with icon and optional clear button.
```tsx
<SearchBar placeholder="Search accounts" />
```

### With Button
Includes a search button, useful for explicit search actions.
```tsx
<SearchBar
  variant="withButton"
  placeholder="Search with button"
/>
```

### Different Sizes
Control the size of the search bar:
```tsx
<SearchBar size="sm" placeholder="Small search" />
<SearchBar size="md" placeholder="Medium search" />
<SearchBar size="lg" placeholder="Large search" />
```

## Accessibility

The SearchBar component follows WAI-ARIA guidelines and includes:

- Proper ARIA roles and attributes (`combobox`, `listbox`, `option`)
- Keyboard navigation:
  - `↑/↓`: Navigate through suggestions
  - `Enter`: Select suggestion or trigger search
  - `Esc`: Close suggestions
- Clear button has proper aria-label
- Loading state announcements
- Focus management

## Examples

### Basic Search
```tsx
<SearchBar
  placeholder="Search accounts"
  onSearch={(value) => {
    console.log('Searching:', value);
  }}
/>
```

### With Async Suggestions
```tsx
const [loading, setLoading] = useState(false);

<SearchBar
  placeholder="Search accounts"
  suggestionProvider={async (query, signal) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${query}`, { signal });
      const data = await res.json();
      return data.map(item => ({
        id: item.id,
        label: item.name
      }));
    } finally {
      setLoading(false);
    }
  }}
  isLoading={loading}
  onSuggestionSelect={(suggestion) => {
    navigate(`/accounts/${suggestion.id}`);
  }}
/>
```

### Customization
```tsx
// Custom styling
<SearchBar
  placeholder="Custom search"
  className="max-w-md mx-auto"
  size="lg"
/>

// Different configurations
<SearchBar
  variant="withButton"
  showClear={false}
  debounceMs={500}
  minChars={3}
/>
```

## Technical Details

The SearchBar uses:
- Downshift for accessibility and keyboard interactions
- class-variance-authority for variant management
- AbortController for cancelling outdated requests
- Debouncing for performance

## Best Practices

1. **Error Handling**: Always handle errors in your suggestion provider:
```tsx
const handleSuggestions = async (query: string, signal?: AbortSignal) => {
  try {
    const data = await fetchSuggestions(query, signal);
    return data.map(toSuggestion);
  } catch (err) {
    if (err.name === 'AbortError') return [];
    console.error('Search error:', err);
    return []; // Or show error state
  }
};
```

2. **Performance**: Use debouncing and cancellation:
```tsx
<SearchBar
  debounceMs={300} // Adjust based on your needs
  minChars={2}     // Prevent unnecessary searches
  maxSuggestions={8} // Limit number of results
/>
```

3. **Responsive Design**: Use appropriate sizes and styling:
```tsx
<SearchBar
  size="md"
  className="hidden md:block" // Hide on mobile
/>
<SearchBar
  size="sm"
  className="block md:hidden" // Show on mobile
/>
```