import type { ReactElement } from 'react';

import { Checkbox, Field, Select, TextInput } from '../design-system';
import type { FieldConfig, FieldType, FieldValue } from './types';

type ControlProps = {
  field: FieldConfig;
  value: FieldValue;
  invalid: boolean;
  onChange: (value: FieldValue) => void;
  onFocus: () => void;
  onBlur: () => void;
};

/** Maps a config `type` to an atom. Adding a field type means adding an entry here. */
const controls: Record<FieldType, (props: ControlProps) => ReactElement> = {
  text: ({ field, value, invalid, onChange, onFocus, onBlur }) => (
    <TextInput
      value={String(value)}
      label={field.label}
      placeholder={field.placeholder}
      inputMode={field.inputMode}
      invalid={invalid}
      onChangeText={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  ),
  email: ({ field, value, invalid, onChange, onFocus, onBlur }) => (
    <TextInput
      value={String(value)}
      label={field.label}
      placeholder={field.placeholder}
      inputMode={field.inputMode ?? 'email'}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      invalid={invalid}
      onChangeText={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  ),
  textarea: ({ field, value, invalid, onChange, onFocus, onBlur }) => (
    <TextInput
      multiline
      value={String(value)}
      label={field.label}
      placeholder={field.placeholder}
      invalid={invalid}
      onChangeText={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  ),
  select: ({ field, value, invalid, onChange, onBlur }) => (
    <Select
      value={String(value)}
      label={field.label}
      options={field.options ?? []}
      placeholder={field.placeholder}
      invalid={invalid}
      onChange={onChange}
      onBlur={onBlur}
    />
  ),
  checkbox: ({ field, value, invalid, onChange }) => (
    <Checkbox value={value === true} label={field.label} invalid={invalid} onChange={onChange} />
  ),
};

export type FormFieldProps = {
  field: FieldConfig;
  value: FieldValue;
  error?: string;
  onChange: (name: string, value: FieldValue) => void;
  onFocus?: (name: string) => void;
  onBlur: (name: string) => void;
};

export function FormField({ field, value, error, onChange, onFocus, onBlur }: FormFieldProps) {
  // A checkbox draws its own label next to the box.
  const showFieldLabel = field.type !== 'checkbox';

  return (
    <Field
      label={showFieldLabel ? field.label : undefined}
      required={Boolean(field.validations.required)}
      hint={field.hint}
      error={error}
    >
      {controls[field.type]({
        field,
        value,
        invalid: Boolean(error),
        onChange: (next) => onChange(field.name, next),
        onFocus: () => onFocus?.(field.name),
        onBlur: () => onBlur(field.name),
      })}
    </Field>
  );
}
