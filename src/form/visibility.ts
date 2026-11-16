import type { FieldConfig, FormValues } from './types';

export function isFieldVisible(field: FieldConfig, values: FormValues): boolean {
  if (!field.visibleWhen) return true;
  return values[field.visibleWhen.field] === field.visibleWhen.equals;
}
