import type { FieldConfig, FormValues } from './types';

export function buildInitialValues(config: FieldConfig[]): FormValues {
  const values: FormValues = {};
  for (const field of config) {
    values[field.name] = field.type === 'checkbox' ? false : '';
  }
  return values;
}
