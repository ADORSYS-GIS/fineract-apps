// // /frontend/shared/src/components/ui/Button/Button.test.tsx
// import { render, screen, fireEvent } from '@testing-library/react';
// import { Button } from './index';

// test('renders button with text', () => {
//   render(<Button>Click Me</Button>);
//   expect(screen.getByText('Click Me')).not;
// });

// test('calls onClick when clicked', () => {
//   const handleClick = jest.fn();
//   render(<Button onClick={handleClick}>Click Me</Button>);
//   fireEvent.click(screen.getByText('Click Me'));
//   expect(handleClick).toHaveBeenCalledTimes(1);
// });

// test('does not call onClick when disabled', () => {
//   const handleClick = jest.fn();
//   render(<Button disabled onClick={handleClick}>Click Me</Button>);
//   fireEvent.click(screen.getByText('Click Me'));
//   expect(handleClick).not.toHaveBeenCalled();
// });
