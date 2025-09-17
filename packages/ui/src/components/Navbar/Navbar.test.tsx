// // /frontend/shared/src/components/ui/Navbar/Navbar.test.tsx
// import { render, screen, fireEvent } from '@testing-library/react';
// import { Navbar } from './index';

// test('renders user info', () => {
//   render(<Navbar userName="Jane Doe" userId="12345" onLogout={jest.fn()} onToggleMenu={function (): void {
//     throw new Error('Function not implemented.');
//   } } isMenuOpen={false} />);
//   expect(screen.getByText('Jane Doe (ID: 12345)')).toBeInTheDocument();
// });

// test('handles logout click', () => {
//   const handleLogout = jest.fn();
//   render(<Navbar userName="Jane Doe" userId="12345" onLogout={handleLogout} onToggleMenu={function (): void {
//     throw new Error('Function not implemented.');
//   } } isMenuOpen={false} />);
//   fireEvent.click(screen.getByText('Menu'));
//   fireEvent.click(screen.getByText('Logout'));
//   expect(handleLogout).toHaveBeenCalled();
// });
