# SearchBar Component

A reusable search input component with multiple variants for different use cases.

## Overview

The SearchBar component provides a search input with search icon, optional clear functionality, and loading states. It comes in three variants to handle different UI scenarios.

## Installation

```typescript
import { SearchBar } from "@fineract-apps/ui";
import "@fineract-apps/ui/styles.css";
```

## Variants

### Default
A standard search input with search icon and clear button. Updates the value as you type.

```typescript
function BasicSearch() {
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

### With Button
Adds a "Search" button for explicit search actions. Good for triggered searches rather than real-time filtering.

```typescript
function SearchWithButton() {
  const [query, setQuery] = useState("");

  const handleSearch = (searchTerm: string) => {
    console.log("Searching for:", searchTerm);
    // Your search logic here
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

### Expandable
Starts as a search icon, expands into a full input when clicked. Useful for mobile layouts or when space is limited.

```typescript
function ExpandableSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchBar
      variant="expandable"
      value={searchTerm}
      onValueChange={setSearchTerm}
      placeholder="Quick search..."
    />
  );
}
```

## Props

The SearchBar is designed to work seamlessly with TanStack Query for backend integration. Use `onValueChange` for real-time filtering of local data, and `onSearch` for triggered API calls when working with server-side search endpoints.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | Current search input value - control this with React state |
| `onValueChange` | `(value: string) => void` | - | Called on every keystroke - use for real-time filtering or updating search state |
| `onSearch` | `(value: string) => void` | - | Called when user presses Enter or clicks search button - use to trigger TanStack Query refetch |
| `placeholder` | `string` | `"Search..."` | Descriptive placeholder text to guide users (e.g., "Search customers by name...") |
| `variant` | `"default" \| "withButton" \| "expandable"` | `"default"` | Choose based on UX: `default` for filtering, `withButton` for explicit searches, `expandable` for mobile |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of the search input |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `isLoading` | `boolean` | `false` | Shows loading spinner when true |
| `showClear` | `boolean` | `true` | Whether to show clear button when there's text |
| `className` | `string` | - | Additional CSS classes |

## Sizes

| Size | Height | Use Case |
|------|--------|----------|
| `sm` | 32px | Compact interfaces, mobile |
| `md` | 40px | Default size for most use cases |
| `lg` | 44px | Prominent search features |

## Common Usage Patterns

### Loading State

Show a spinner while performing async search operations. Use the `isLoading` prop to display loading feedback to users.

```typescript
function SearchWithLoading() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    // Your async search logic
    await fetchResults(searchTerm);
    setIsLoading(false);
  };

  return (
    <SearchBar
      variant="withButton"
      value={query}
      onValueChange={setQuery}
      onSearch={handleSearch}
      isLoading={isLoading}
      placeholder="Search..."
    />
  );
}
```

### Real-time Filtering

Filter a list of items as the user types. The search updates immediately without needing to press Enter or click a button.

```typescript
function FilterableList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items] = useState(["Apple", "Banana", "Cherry"]);

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <SearchBar
        value={searchTerm}
        onValueChange={setSearchTerm}
        placeholder="Filter items..."
      />
      
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Keyboard Navigation

- **Enter**: Triggers search action
- **Escape**: Clears input and collapses expandable variant
- **Tab**: Focus navigation between elements

## Styling

Add custom styles using the `className` prop:

```typescript
<SearchBar
  value={searchValue}
  onValueChange={setSearchValue}
  className="w-full max-w-md"
  size="lg"
/>
```



## Integration with Button Component

### Button Usage Details

The SearchBar internally uses the Button component for all interactive elements:

#### Clear Button (X)
```typescript
// Rendered when showClear={true} and there's input value
<Button
  variant="ghost"
  size="sm" 
  className="p-1 h-auto w-auto hover:bg-accent"
  aria-label="Clear input"
>
  <X className="h-3 w-3" />
</Button>
```

#### Search Button (withButton variant)
```typescript
// Rendered when variant="withButton"
<Button
  size="sm"
  className="px-3 py-1 text-sm"
  onClick={handleSearch}
  disabled={disabled}
>
  Search
</Button>
```

#### Expandable Trigger Button
```typescript
// Rendered when variant="expandable" and not expanded
<Button
  variant="ghost"
  size="sm"
  className="cursor-pointer justify-center"
  aria-label="Open search"
>
  <Search className="h-4 w-4 text-muted-foreground" />
</Button>
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

test('button interactions work correctly', () => {
  const mockOnSearch = jest.fn();
  
  render(
    <SearchBar 
      variant="withButton"
      value="test"
      onValueChange={() => {}}
      onSearch={mockOnSearch}
    />
  );
  
  const searchButton = screen.getByRole('button', { name: /search/i });
  fireEvent.click(searchButton);
  
  expect(mockOnSearch).toHaveBeenCalledWith('test');
});
```

## Best Practices

### Component Usage
1. **Use appropriate variants**: Choose `expandable` for mobile/compact layouts, `withButton` for explicit search actions, `default` for real-time filtering
2. **Size selection**: Use `sm` for compact interfaces, `md` for standard layouts, `lg` for prominent search features
3. **Provide meaningful placeholders**: Help users understand what they can search for (e.g., "Search customers by name or ID...")

### State Management
4. **Handle empty states**: Show appropriate messages when no results are found
5. **Loading states**: Always use `isLoading` prop during async operations to provide user feedback
6. **Controlled inputs**: Always use controlled pattern with `value` and `onValueChange` for predictable behavior

### Accessibility & UX
7. **Keyboard navigation**: Test Enter key for search, Escape for clearing/closing, Tab for focus management
8. **ARIA labels**: Provide descriptive labels for screen readers
9. **Error handling**: Implement proper validation and error messaging
10. **Performance**: Consider debouncing for expensive search operations (implement in your handler, not in the component)

### Styling & Theme
11. **Consistent theming**: Rely on CSS variables rather than custom classes when possible
12. **Button consistency**: Let the integrated Button component handle all interactive styling
13. **Responsive design**: Use different variants for different screen sizes

## Troubleshooting

### Common Issues

**Input not updating:**
- Ensure you're using controlled input pattern with `value` and `onValueChange`
- Check that `onValueChange` callback is properly implemented
- Verify state updates are not being blocked by parent components

**Search not triggering:**
- Check that `onSearch` callback is properly implemented for `withButton` variant
- Verify Enter key handling works (should trigger automatically)
- Ensure the input has focus when pressing Enter

**Buttons not working:**
- Verify Button component is properly imported in your app
- Check that CSS variables are defined in your theme
- Ensure `@fineract-apps/ui/styles.css` is imported

**Styling issues:**
- Import UI library styles: `import "@fineract-apps/ui/styles.css"`
- Check that CSS variables are properly defined in your theme
- Use `className` prop for additional custom styling
- Verify Tailwind CSS is configured correctly

**Focus/accessibility problems:**
- Test keyboard navigation (Tab, Enter, Escape)
- Verify ARIA labels are working with screen readers
- Check focus-visible states are appearing correctly

**TypeScript errors:**
- Ensure proper prop types are used
- Check that `onValueChange` signature matches `(value: string) => void`
- Verify `onSearch` callback signature matches `(value: string) => void`

### Performance Issues

**Slow search responses:**
- Implement debouncing in your search handler (not in the component)
- Consider using `isLoading` state during async operations
- Avoid heavy operations in `onValueChange` callbacks

### Getting Help

For additional support:
- Check the component tests for comprehensive usage examples
- Review the TypeScript types for complete API documentation  
- Consult the architecture guide for integration patterns
- See the Button component docs for styling details
- Check the CSS variables in `styles.css` for theming options

---

*This component is part of the fineract-apps shared UI library. For technical issues or feature requests, please refer to the project's contribution guidelines.*