# Search Bar Component

A versatile search component that provides a consistent search experience across all applications in the Fineract ecosystem. It supports various features like suggestions, async search, keyboard navigation, and multiple visual variants.

## Features

- **Live Search**: Real-time search with debouncing
- **Suggestions**: Both client-side and server-side suggestions support
- **Keyboard Navigation**: Full keyboard support for suggestion navigation
- **Accessibility**: ARIA compliant using Downshift
- **Loading States**: Visual feedback during async operations
- **Clear/Reset**: Optional clear button functionality
- **Multiple Variants**: Simple, with button, and expandable styles
- **Responsive Design**: Adapts to different screen sizes
- **Theme Integration**: Uses semantic color tokens

## Installation

The SearchBar component is part of the `@fineract-apps/ui` package and is automatically available in all frontend applications.

## Basic Usage

```tsx
import { SearchBar } from "@fineract-apps/ui";

// Simple search
<SearchBar 
  placeholder="Search accounts"
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
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`variant\` | \`"default" \| "simple" \| "withButton" \| "expandable"\` | \`"default"\` | The visual style variant |
| \`size\` | \`"sm" \| "md" \| "lg"\` | \`"md"\` | The size of the search bar |
| \`placeholder\` | \`string\` | \`"Search"\` | Placeholder text |
| \`onSearch\` | \`(value: string) => void\` | - | Called when search is triggered |
| \`showClear\` | \`boolean\` | \`true\` | Whether to show the clear button |
| \`onClear\` | \`() => void\` | - | Called when clear button is clicked |
| \`suggestions\` | \`Suggestion[]\` | - | Array of suggestions for client-side filtering |
| \`suggestionProvider\` | \`(query: string, signal?: AbortSignal) => Promise<Suggestion[]>\` | - | Async function to fetch suggestions |
| \`minChars\` | \`number\` | \`2\` | Minimum characters before showing suggestions |
| \`debounceMs\` | \`number\` | \`250\` | Debounce delay for suggestions in ms |
| \`maxSuggestions\` | \`number\` | \`8\` | Maximum number of suggestions to show |
| \`onSuggestionSelect\` | \`(suggestion: Suggestion) => void\` | - | Called when a suggestion is selected |
| \`isLoading\` | \`boolean\` | \`false\` | Shows loading indicator |
| \`showSearchButton\` | \`boolean\` | \`false\` | Shows search button (for withButton variant) |

## Variants

### Default
Standard search bar with icon and optional clear button.
```tsx
<SearchBar placeholder="Search" />
```

### Simple
Compact version for space-constrained areas.
```tsx
<SearchBar 
  variant="simple"
  size="sm"
  placeholder="Quick search"
/>
```

### With Button
Includes a search button, useful for explicit search actions.
```tsx
<SearchBar
  variant="withButton"
  showSearchButton
  placeholder="Search with button"
/>
```

### Expandable
Collapses to an icon and expands on focus, great for navigation bars.
```tsx
<SearchBar
  variant="expandable"
  size="sm"
  placeholder="Click to expand"
/>
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

### Expandable in Navigation
```tsx
<nav className="flex items-center justify-between">
  <Logo />
  <SearchBar
    variant="expandable"
    size="sm"
    placeholder="Search"
    className="max-w-xs"
  />
  <UserMenu />
</nav>
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

3. **Responsive Design**: Use appropriate variants:
```tsx
<SearchBar
  variant="default"
  className="hidden md:flex" // Hide on mobile
/>
<SearchBar
  variant="expandable"
  className="flex md:hidden" // Show on mobile
/>
```