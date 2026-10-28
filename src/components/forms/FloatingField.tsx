import type { FormEvent, InputHTMLAttributes, ReactNode } from 'react';

interface FloatingFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  helperText?: string;
  error?: string;
}

export function FloatingField({
  id,
  label,
  icon,
  className = '',
  helperText,
  error,
  required,
  onInvalid,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...props
}: FloatingFieldProps) {
  const inputId =
    id ??
    (typeof props.name === 'string'
      ? props.name
      : label.toLowerCase().replace(/\s+/g, '-'));

  const describedByIds = [
    ariaDescribedBy,
    helperText ? `${inputId}-helper` : undefined,
    error ? `${inputId}-error` : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const isInvalid = Boolean(error || ariaInvalid);

  const handleInvalid = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    onInvalid?.(event);
  };

  return (
    <div
      className={`floating-field ${isInvalid ? 'floating-field--error' : ''}`.trim()}
    >
      {icon ? <span className="floating-field__icon">{icon}</span> : null}
      <input
        id={inputId}
        className={className}
        placeholder=" "
        aria-invalid={isInvalid}
        aria-describedby={describedByIds || undefined}
        aria-required={required || undefined}
        required={required}
        onInvalid={handleInvalid}
        {...props}
      />
      <label htmlFor={inputId}>{label}</label>
    </div>
  );
}
