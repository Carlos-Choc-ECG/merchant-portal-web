export function isValidEmail(value: string): boolean {
  const trimmedValue = value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(trimmedValue);
}

export function validateEmail(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Email is required.';
  }

  if (!isValidEmail(trimmedValue)) {
    return 'Please enter a valid email address.';
  }

  return '';
}

export function validateRequired(value: string, fieldName: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return `${fieldName} is required.`;
  }

  return '';
}
