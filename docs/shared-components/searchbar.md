# SearchBar Component

A simple and reusable search component for consistent search experiences across all applications in the fineract-apps monorepo.

## Overview

The SearchBar component provides a lightweight, accessible search input with multiple variants and built-in states. It's designed to be simple to implement while maintaining consistent styling and behavior across the Cashier, Account Manager, and Branch Manager applications.

## Features

- **Multiple Variants**: Default, with button, and expandable search
- **Responsive Design**: Works seamlessly across all screen sizes
- **Accessibility First**: Full ARIA support and keyboard navigation
- **Flexible States**: Loading, disabled, and clear functionality
- **Simple API**: Easy to integrate with minimal setup
- **Well Tested**: 97%+ test coverage with comprehensive test suite

## Installation

The SearchBar component is available in the shared UI library:

```typescript
import { SearchBar } from "@fineract-apps/ui";
```

## Basic Usage

### Default Search Input

```typescript
import { SearchBar } from "@fineract-apps/ui";
import { useState } from "react";

function SearchExample() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <SearchBar
      value={searchValue}
      onValueChange={setSearchValue}
      placeholder="Search transactions..."
    />
  );
}
```

### Search with Button

```typescript
function SearchWithButton() {
  const [query, setQuery] = useState("");

  const handleSearch = (searchTerm: string) => {
    console.log("Searching for:", searchTerm);
    // Implement your search logic here
  };

  return (
    <SearchBar
      variant="withButton"
      value={query}
      onValueChange={setQuery}
      onSearch={handleSearch}
      placeholder="Search customers..."
    />
  );
}
```

### Expandable Search (Mobile-Friendly)

```typescript
function ExpandableSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchBar
      variant="expandable"
      value={searchTerm}
      onValueChange={setSearchTerm}
      placeholder="Search accounts..."
      size="sm"
    />
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | Current search input value |
| `onValueChange` | `(value: string) => void` | - | Callback when input value changes |
| `onSearch` | `(value: string) => void` | - | Callback when search is triggered (Enter key or button click) |
| `placeholder` | `string` | `"Search..."` | Input placeholder text |
| `variant` | `"default" \| "withButton" \| "expandable"` | `"default"` | Visual variant of the search bar |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of the search input |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `isLoading` | `boolean` | `false` | Shows loading spinner when true |
| `showClear` | `boolean` | `true` | Whether to show clear button when there's text |
| `className` | `string` | - | Additional CSS classes |

### Variants

#### Default
Basic search input with search icon and optional clear button.

```typescript
<SearchBar 
  variant="default"
  value={searchValue}
  onValueChange={setSearchValue}
/>
```

#### With Button
Includes a search button for explicit search trigger.

```typescript
<SearchBar 
  variant="withButton"
  value={searchValue}
  onValueChange={setSearchValue}
  onSearch={handleSearch}
/>
```

#### Expandable
Starts as a search icon, expands to full input when clicked. Perfect for mobile layouts.

```typescript
<SearchBar 
  variant="expandable"
  value={searchValue}
  onValueChange={setSearchValue}
/>
```

### Sizes

| Size | Description | Use Case |
|------|-------------|----------|
| `sm` | Small (32px height) | Compact interfaces, mobile |
| `md` | Medium (40px height) | Default size for most use cases |
| `lg` | Large (48px height) | Prominent search features |

## Advanced Usage

### Loading States

```typescript
function SearchWithLoading() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Search results for:", searchTerm);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchBar
      variant="withButton"
      value={query}
      onValueChange={setQuery}
      onSearch={handleSearch}
      isLoading={isLoading}
      placeholder="Search with loading state..."
    />
  );
}
```

### Controlled Input with Validation

```typescript
function ValidatedSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleValueChange = (value: string) => {
    setSearchTerm(value);
    // Validate input (e.g., minimum length)
    setIsValid(value.length === 0 || value.length >= 3);
  };

  const handleSearch = (value: string) => {
    if (isValid && value.trim()) {
      // Perform search
      console.log("Searching for:", value);
    }
  };

  return (
    <div>
      <SearchBar
        value={searchTerm}
        onValueChange={handleValueChange}
        onSearch={handleSearch}
        placeholder="Type at least 3 characters..."
        className={isValid ? "" : "border-red-500"}
      />
      {!isValid && (
        <p className="text-red-500 text-sm mt-1">
          Please enter at least 3 characters
        </p>
      )}
    </div>
  );
}
```

### Integration with Filtering

```typescript
function FilterableList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items] = useState([
    "Apple", "Banana", "Cherry", "Date", "Elderberry"
  ]);

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SearchBar
        value={searchTerm}
        onValueChange={setSearchTerm}
        placeholder="Filter items..."
        size="lg"
      />
      
      <ul className="space-y-2">
        {filteredItems.map((item, index) => (
          <li key={index} className="p-2 border rounded">
            {item}
          </li>
        ))}
      </ul>
      
      {filteredItems.length === 0 && searchTerm && (
        <p className="text-muted-foreground">No items found</p>
      )}
    </div>
  );
}
```

## Accessibility Features

The SearchBar component includes comprehensive accessibility support:

### Keyboard Navigation
- **Enter**: Triggers search action
- **Escape**: Clears input and collapses expandable variant
- **Tab**: Standard focus navigation

### ARIA Support
- Proper labeling with `aria-label` attributes
- Screen reader friendly button descriptions
- Semantic HTML structure

### Example with Custom Labels

```typescript
<SearchBar
  value={searchValue}
  onValueChange={setSearchValue}
  placeholder="Search customer accounts"
  className="[&>div>input]:aria-[label='Search customer accounts']"
/>
```

## Styling Customization

### Custom Styling

```typescript
// Custom size and styling
<SearchBar
  value={searchValue}
  onValueChange={setSearchValue}
  className="w-full max-w-md mx-auto"
  size="lg"
/>

// Custom variant styling
<SearchBar
  variant="withButton"
  value={searchValue}
  onValueChange={setSearchValue}
  onSearch={handleSearch}
  className="border-2 border-primary rounded-lg"
/>
```

### Theme Integration

The component automatically adapts to your application's theme:

- Uses semantic color tokens (`primary`, `muted-foreground`, `accent`)
- Respects dark/light mode preferences
- Consistent with other UI components

## Performance Considerations

The SearchBar component is optimized for performance:

- **Lightweight**: Minimal dependencies and simple state management
- **No Debouncing**: Immediate updates for responsive feel
- **Memory Efficient**: No complex hooks or external libraries
- **Tree-shakable**: Only imports what you use

## Common Patterns

### 1. Real-time Search

```typescript
function RealTimeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Trigger search on every change
  useEffect(() => {
    if (query.trim()) {
      // Perform search logic
      const filtered = data.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <SearchBar
      value={query}
      onValueChange={setQuery}
      placeholder="Type to search..."
    />
  );
}
```

### 2. Search History

```typescript
function SearchWithHistory() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim() && !history.includes(searchTerm)) {
      setHistory(prev => [searchTerm, ...prev.slice(0, 4)]);
    }
    // Perform search...
  };

  return (
    <SearchBar
      variant="withButton"
      value={query}
      onValueChange={setQuery}
      onSearch={handleSearch}
    />
  );
}
```

### 3. Mobile-First Design

```typescript
function ResponsiveSearch() {
  return (
    <div className="w-full">
      {/* Mobile: Expandable */}
      <div className="md:hidden">
        <SearchBar
          variant="expandable"
          size="sm"
          value={mobileQuery}
          onValueChange={setMobileQuery}
        />
      </div>
      
      {/* Desktop: Full search with button */}
      <div className="hidden md:block">
        <SearchBar
          variant="withButton"
          size="md"
          value={desktopQuery}
          onValueChange={setDesktopQuery}
          onSearch={handleDesktopSearch}
        />
      </div>
    </div>
  );
}
```

## Testing

The SearchBar component includes comprehensive test coverage (97%+). Here are example test patterns:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

test('handles user input correctly', () => {
  const mockOnValueChange = jest.fn();
  
  render(
    <SearchBar 
      value=""
      onValueChange={mockOnValueChange}
    />
  );
  
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test query' } });
  
  expect(mockOnValueChange).toHaveBeenCalledWith('test query');
});
```

## Best Practices

1. **Use appropriate variants**: Choose `expandable` for mobile, `withButton` for explicit actions
2. **Provide meaningful placeholders**: Help users understand what they can search for
3. **Handle empty states**: Show appropriate messages when no results are found
4. **Consider loading states**: Use `isLoading` prop for async operations
5. **Validate input**: Implement client-side validation as needed
6. **Test accessibility**: Ensure keyboard navigation and screen reader compatibility

## Troubleshooting

### Common Issues

**Input not updating:**
- Ensure you're using controlled input pattern with `value` and `onValueChange`

**Search not triggering:**
- Check that `onSearch` callback is properly implemented
- Verify Enter key handling in your event handlers

**Styling not applying:**
- Use `className` prop for custom styling
- Ensure Tailwind classes are properly configured

### Getting Help

For additional support:
- Check the component tests for usage examples
- Review the TypeScript types for complete API documentation
- Consult the main documentation for architecture patterns

---

*This component is part of the fineract-apps shared UI library. For technical issues or feature requests, please refer to the project's contribution guidelines.*