import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { BalanceDisplay } from './BalanceDisplay';

describe('BalanceDisplay', () => {
  it('renders balance with default currency', () => {
    render(<BalanceDisplay balance={100000} />);
    expect(screen.getByText(/100.*000/)).toBeInTheDocument();
    expect(screen.getByText('XAF')).toBeInTheDocument();
  });

  it('renders with custom currency', () => {
    render(<BalanceDisplay balance={50000} currency="EUR" />);
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<BalanceDisplay balance={0} isLoading={true} />);
    // Should show loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('toggles balance visibility', () => {
    render(<BalanceDisplay balance={100000} />);

    // Initially balance should be visible
    expect(screen.getByText(/100.*000/)).toBeInTheDocument();

    // Click hide button
    const toggleButton = screen.getByRole('button', { name: /hide balance/i });
    fireEvent.click(toggleButton);

    // Balance should be hidden
    expect(screen.getByText('••••••')).toBeInTheDocument();

    // Click show button
    const showButton = screen.getByRole('button', { name: /show balance/i });
    fireEvent.click(showButton);

    // Balance should be visible again
    expect(screen.getByText(/100.*000/)).toBeInTheDocument();
  });

  it('renders available balance when different from main balance', () => {
    render(
      <BalanceDisplay balance={100000} availableBalance={90000} />
    );

    expect(screen.getByText('dashboard.accountBalance')).toBeInTheDocument();
    expect(screen.getByText('dashboard.availableBalance')).toBeInTheDocument();
  });

  it('does not render available balance section when same as main balance', () => {
    render(
      <BalanceDisplay balance={100000} availableBalance={100000} />
    );

    expect(screen.queryByText('dashboard.availableBalance')).not.toBeInTheDocument();
  });

  it('renders trend indicator when positive', () => {
    render(
      <BalanceDisplay
        balance={100000}
        trend={{ value: 5000, isPositive: true }}
      />
    );

    expect(screen.getByText(/\+/)).toBeInTheDocument();
    expect(screen.getByText(/5.*000/)).toBeInTheDocument();
  });

  it('renders trend indicator when negative', () => {
    render(
      <BalanceDisplay
        balance={100000}
        trend={{ value: 3000, isPositive: false }}
      />
    );

    // Should show minus sign for negative trend
    const trendText = screen.getByText(/-/);
    expect(trendText).toBeInTheDocument();
  });

  it('hides trend when balance is hidden', () => {
    render(
      <BalanceDisplay
        balance={100000}
        trend={{ value: 5000, isPositive: true }}
      />
    );

    // Click hide button
    const toggleButton = screen.getByRole('button', { name: /hide balance/i });
    fireEvent.click(toggleButton);

    // Trend should not be visible
    expect(screen.queryByText(/this month/)).not.toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender, container } = render(
      <BalanceDisplay balance={100000} size="sm" />
    );
    expect(container.querySelector('.text-xl')).toBeInTheDocument();

    rerender(<BalanceDisplay balance={100000} size="md" />);
    expect(container.querySelector('.text-3xl')).toBeInTheDocument();

    rerender(<BalanceDisplay balance={100000} size="lg" />);
    expect(container.querySelector('.text-4xl')).toBeInTheDocument();
  });
});
