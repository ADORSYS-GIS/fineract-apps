import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPhoneNumber, formatAccountNumber } from './formatters';

describe('formatCurrency', () => {
  it('formats XAF currency with thousands separator', () => {
    expect(formatCurrency(1000, 'XAF')).toMatch(/1.*000/);
  });

  it('formats large numbers correctly', () => {
    expect(formatCurrency(1234567, 'XAF')).toMatch(/1.*234.*567/);
  });

  it('formats zero', () => {
    expect(formatCurrency(0, 'XAF')).toMatch(/0/);
  });

  it('formats negative numbers', () => {
    expect(formatCurrency(-5000, 'XAF')).toMatch(/-.*5.*000/);
  });

  it('formats with decimal places for EUR', () => {
    const result = formatCurrency(1234.56, 'EUR');
    expect(result).toMatch(/1.*234/);
  });
});

describe('formatDate', () => {
  it('formats date with default format', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('formats date with short format', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'short');
    expect(result).toBeTruthy();
  });

  it('formats date with long format', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'long');
    expect(result).toBeTruthy();
  });

  it('formats date with time', () => {
    const date = new Date('2024-01-15T14:30:00');
    const result = formatDate(date, 'datetime');
    expect(result).toContain('2024');
  });

  it('handles string dates', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('2024');
  });
});

describe('formatPhoneNumber', () => {
  it('formats Cameroon phone number', () => {
    const result = formatPhoneNumber('+237612345678');
    expect(result).toContain('612');
  });

  it('handles phone number without country code', () => {
    const result = formatPhoneNumber('612345678');
    expect(result).toBeTruthy();
  });
});

describe('formatAccountNumber', () => {
  it('masks account number showing only last 4 digits', () => {
    const result = formatAccountNumber('1234567890123456');
    expect(result).toContain('****');
    expect(result).toContain('3456');
  });

  it('handles short account numbers', () => {
    const result = formatAccountNumber('1234');
    expect(result).toBeTruthy();
  });
});
