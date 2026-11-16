import type { FieldConfig, FormErrors, FormValues } from '../../form/types';
import { isFieldVisible } from '../../form/visibility';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns the first error for one field, or undefined when it is valid or hidden. */
export function validateField(field: FieldConfig, values: FormValues): string | undefined {
  if (!isFieldVisible(field, values)) return undefined;

  const { validations, label } = field;
  const value = values[field.name];

  if (field.type === 'checkbox') {
    if (validations.required && value !== true) {
      return typeof validations.required === 'string' ? validations.required : `${label} is required`;
    }
    return undefined;
  }

  const text = typeof value === 'string' ? value : '';
  const trimmed = text.trim();

  if (validations.required && !trimmed) {
    return typeof validations.required === 'string' ? validations.required : `${label} is required`;
  }
  // Optional and empty: no other rule applies.
  if (!trimmed) return undefined;

  if (validations.email && !EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address';
  }
  if (validations.digits !== undefined && !new RegExp(`^\\d{${validations.digits}}$`).test(trimmed)) {
    return `${label} must be exactly ${validations.digits} digits`;
  }
  if (validations.maxLength !== undefined && text.length > validations.maxLength) {
    return `${label} must be ${validations.maxLength} characters or fewer`;
  }
  return undefined;
}

/** Pure function of the config and the current values. Hidden fields are skipped. */
export function validate(config: FieldConfig[], values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of config) {
    const message = validateField(field, values);
    if (message) errors[field.name] = message;
  }
  return errors;
}
