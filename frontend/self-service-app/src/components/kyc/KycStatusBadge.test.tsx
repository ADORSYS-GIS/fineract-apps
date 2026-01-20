import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { KycStatusBadge } from './KycStatusBadge';

describe('KycStatusBadge', () => {
  it('renders pending status with correct styling', () => {
    render(<KycStatusBadge status="pending" />);

    const badge = screen.getByText('kyc.status.pending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('renders approved status with correct styling', () => {
    render(<KycStatusBadge status="approved" />);

    const badge = screen.getByText('kyc.status.approved');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('renders rejected status with correct styling', () => {
    render(<KycStatusBadge status="rejected" />);

    const badge = screen.getByText('kyc.status.rejected');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('renders in_review status with correct styling', () => {
    render(<KycStatusBadge status="in_review" />);

    const badge = screen.getByText('kyc.status.in_review');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('renders with small size', () => {
    render(<KycStatusBadge status="pending" size="sm" />);

    const badge = screen.getByText('kyc.status.pending');
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
  });

  it('renders with medium size (default)', () => {
    render(<KycStatusBadge status="pending" />);

    const badge = screen.getByText('kyc.status.pending');
    expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm');
  });

  it('renders with large size', () => {
    render(<KycStatusBadge status="pending" size="lg" />);

    const badge = screen.getByText('kyc.status.pending');
    expect(badge).toHaveClass('px-3', 'py-1.5', 'text-base');
  });

  it('shows icon when showIcon is true', () => {
    render(<KycStatusBadge status="approved" showIcon={true} />);

    const badge = screen.getByText('kyc.status.approved');
    const icon = badge.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    render(<KycStatusBadge status="approved" showIcon={false} />);

    const badge = screen.getByText('kyc.status.approved');
    const icon = badge.querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });
});
