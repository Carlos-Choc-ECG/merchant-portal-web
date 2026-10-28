import type { ReactNode } from 'react';

interface FormFieldGroupProps {
  children: ReactNode;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  id?: string;
  fieldId?: string;
  className?: string;
}

export function FormFieldGroup({
  children,
  label,
  description,
  error,
  required,
  id,
  fieldId,
  className = '',
}: FormFieldGroupProps) {
  const generatedId = fieldId ?? id ?? 'form-field-group';
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`form-field-group ${className}`.trim()}>
      {label ? (
        <label className="form-field-group__label" htmlFor={generatedId}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      ) : null}

      {description ? (
        <p id={descriptionId} className="form-field-group__description">
          {description}
        </p>
      ) : null}

      <div className="form-field-group__control" aria-describedby={describedBy}>
        {children}
      </div>

      {error ? (
        <p id={errorId} className="form-field-group__error" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}
