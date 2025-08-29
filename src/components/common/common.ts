export const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Weak', color: 'red', width: '25%' };
  if (score === 2 || score === 3) return { label: 'Medium', color: 'orange', width: '66%' };
  return { label: 'Strong', color: 'green', width: '100%' };
};