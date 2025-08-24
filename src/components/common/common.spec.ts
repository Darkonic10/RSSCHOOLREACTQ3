import { getPasswordStrength } from '@/components/common/common.ts';

describe('getPasswordStrength', () => {
  it('returns Weak for empty or very simple passwords', () => {
    expect(getPasswordStrength('')).toEqual({ label: 'Weak', color: 'red', width: '25%' });
    expect(getPasswordStrength('abc')).toEqual({ label: 'Weak', color: 'red', width: '25%' });
    expect(getPasswordStrength('abcdefgh')).toEqual({ label: 'Weak', color: 'red', width: '25%' });
  });

  it('returns Medium for passwords with two or three criteria', () => {
    expect(getPasswordStrength('abcdefgH')).toEqual({ label: 'Medium', color: 'orange', width: '66%' });
    expect(getPasswordStrength('abcdef12')).toEqual({ label: 'Medium', color: 'orange', width: '66%' });
    expect(getPasswordStrength('Abcdef12')).toEqual({ label: 'Medium', color: 'orange', width: '66%' });
  });

  it('returns Strong for passwords meeting all criteria', () => {
    expect(getPasswordStrength('Abcdef1!')).toEqual({ label: 'Strong', color: 'green', width: '100%' });
    expect(getPasswordStrength('P@ssw0rd123')).toEqual({ label: 'Strong', color: 'green', width: '100%' });
  });
});